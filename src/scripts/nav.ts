// Theme color constants for Safari iOS status bar
const THEME_COLORS = {
    light: '#f5f7fb', // Cool pearl for the daylight theme
    dark: '#0f172a',  // Slate-900 for dark mode
} as const;

// Update Safari iOS status bar color via theme-color meta tag and HTML background-color
// Safari iOS 18.1+ also reads background-color of fixed position elements for status bar
function updateThemeColor(isDark: boolean): void {
    const newColor = isDark ? THEME_COLORS.dark : THEME_COLORS.light;
    // Semi-transparent version for header (Safari detects it but keeps UI clean)
    const headerColor = isDark ? 'rgba(15, 23, 42, 0.01)' : 'rgba(245, 247, 251, 0.01)';

    // Update HTML background-color (Safari's primary detection method)
    document.documentElement.style.backgroundColor = newColor;

    // Update fixed header background-color (iOS 18.1+ Safari requirement)
    // Use very low opacity so Safari detects it without visual interference
    const header = document.getElementById('site-header');
    if (header) {
        header.style.backgroundColor = headerColor;
    }

    // Update meta tag as well
    const themeColorMeta = document.getElementById('theme-color-meta');
    if (themeColorMeta) {
        // Safari iOS caches theme-color and doesn't respond to setAttribute alone
        // Remove and re-insert the meta tag to force Safari to recognize the change
        const parent = themeColorMeta.parentNode;
        if (parent) {
            const newMeta = document.createElement('meta');
            newMeta.name = 'theme-color';
            newMeta.id = 'theme-color-meta';
            newMeta.content = newColor;

            parent.removeChild(themeColorMeta);
            // Insert at the beginning of head to maintain precedence
            parent.insertBefore(newMeta, parent.firstChild);
        }
    }
}

// Theme Management
function initTheme(): void {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const html = document.documentElement;

    // Check for saved theme preference, otherwise fall back to OS preference
    const savedTheme = localStorage.getItem('theme');
    const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    const currentTheme = savedTheme || (prefersLight ? 'light' : 'dark');

    // Apply the theme on page load
    if (currentTheme === 'light') {
        html.classList.remove('dark');
    } else {
        html.classList.add('dark');
    }

    // Update Safari status bar color on initial load
    updateThemeColor(html.classList.contains('dark'));

    // Sync icon + accessible name/state with the current theme
    function updateThemeControl(): void {
        const isDark = html.classList.contains('dark');

        if (isDark) {
            // Dark mode: show sun (click to go light)
            themeIcon?.classList.remove('fa-moon');
            themeIcon?.classList.add('fa-sun');
            themeToggle?.setAttribute('aria-label', 'Switch to light mode');
            themeToggle?.setAttribute('aria-pressed', 'true');
        } else {
            // Light mode: show moon (click to go dark)
            themeIcon?.classList.remove('fa-sun');
            themeIcon?.classList.add('fa-moon');
            themeToggle?.setAttribute('aria-label', 'Switch to dark mode');
            themeToggle?.setAttribute('aria-pressed', 'false');
        }
    }

    // Set initial control state
    updateThemeControl();

    // Toggle theme on button click
    themeToggle?.addEventListener('click', () => {
        // Check if browser supports View Transitions API
        if (!document.startViewTransition) {
            // Fallback: instant toggle (existing behavior)
            html.classList.toggle('dark');
            const isDark = html.classList.contains('dark');
            const newTheme = isDark ? 'dark' : 'light';
            localStorage.setItem('theme', newTheme);
            updateThemeControl();
            updateThemeColor(isDark);
            return;
        }

        // Use View Transitions API for smooth scan effect
        const transition = document.startViewTransition(() => {
            html.classList.toggle('dark');
            const isDark = html.classList.contains('dark');
            const newTheme = isDark ? 'dark' : 'light';
            localStorage.setItem('theme', newTheme);
            updateThemeColor(isDark);
        });

        // Update control after transition completes
        transition.finished.then(() => {
            updateThemeControl();
        });
    });
}

// Active Section Detection
let activeSectionCleanup: (() => void) | undefined;

function initActiveSection(): void {
    activeSectionCleanup?.();

    const sections = Array.from(document.querySelectorAll<HTMLElement>('section[id]'));
    const navLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>('.nav-link'));

    if (!sections.length || !navLinks.length) return;

    function setActiveSection(section: HTMLElement): void {
        navLinks.forEach((link) => {
            const isActive = link.getAttribute('href') === `#${section.id}`;
            link.classList.toggle('active', isActive);

            if (isActive) {
                link.setAttribute('aria-current', 'location');
            } else {
                link.removeAttribute('aria-current');
            }
        });
    }

    function updateActiveSection(): void {
        const activationLine = window.innerHeight * 0.2;
        const pageBottom = window.scrollY + window.innerHeight;
        const documentBottom = document.documentElement.scrollHeight;
        let activeSection = sections[0];

        // The final section cannot always reach the activation line on short mobile
        // viewports, so reaching the end of the document must select it explicitly.
        if (Math.ceil(pageBottom) >= documentBottom - 2) {
            activeSection = sections[sections.length - 1];
        } else {
            sections.forEach((section) => {
                if (section.getBoundingClientRect().top <= activationLine) {
                    activeSection = section;
                }
            });
        }

        setActiveSection(activeSection);
    }

    let animationFrameId: number | undefined;

    function scheduleUpdate(): void {
        if (animationFrameId !== undefined) return;

        animationFrameId = window.requestAnimationFrame(() => {
            animationFrameId = undefined;
            updateActiveSection();
        });
    }

    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);
    updateActiveSection();

    activeSectionCleanup = () => {
        window.removeEventListener('scroll', scheduleUpdate);
        window.removeEventListener('resize', scheduleUpdate);

        if (animationFrameId !== undefined) {
            window.cancelAnimationFrame(animationFrameId);
        }
    };
}

// Adaptive Navigation - Change colors based on background section
function initAdaptiveNav(): void {
    const nav = document.querySelector('nav');
    const darkSections = ['aviation']; // Sections with dark backgrounds

    if (!nav) return;

    function updateNavStyle(): void {
        if (!nav) return;

        const navRect = nav.getBoundingClientRect();
        const navCenter = navRect.top + navRect.height / 2;

        // Find which section the nav center is over
        const sections = document.querySelectorAll('section[id]');
        let isOverDarkSection = false;

        sections.forEach((section) => {
            const sectionRect = section.getBoundingClientRect();
            if (
                navCenter >= sectionRect.top &&
                navCenter <= sectionRect.bottom
            ) {
                const sectionId = section.getAttribute('id');
                if (sectionId && darkSections.includes(sectionId)) {
                    isOverDarkSection = true;
                }
            }
        });

        // Apply appropriate styling
        if (isOverDarkSection) {
            nav.classList.add('nav-over-dark');
            nav.classList.remove('nav-over-light');
        } else {
            nav.classList.add('nav-over-light');
            nav.classList.remove('nav-over-dark');
        }
    }

    // Update on scroll
    window.addEventListener('scroll', updateNavStyle);
    // Initial update
    updateNavStyle();
}

// Initialize all navigation functionality
function init(): void {
    initTheme();
    initActiveSection();
    initAdaptiveNav();
}

// Run initialization
init();

// Re-initialize on Astro page transitions
document.addEventListener('astro:page-load', init);
