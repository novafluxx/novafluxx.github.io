// Theme color constants for Safari iOS status bar
const THEME_COLORS = {
    light: '#fdf2f8', // Warm rose/pink for sunrise theme
    dark: '#0f172a',  // Slate-900 for dark mode
} as const;

// Update Safari iOS status bar color via theme-color meta tag
function updateThemeColor(isDark: boolean): void {
    const themeColorMeta = document.getElementById('theme-color-meta');
    if (themeColorMeta) {
        themeColorMeta.setAttribute('content', isDark ? THEME_COLORS.dark : THEME_COLORS.light);
    }
}

// Theme Management
function initTheme(): void {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const html = document.documentElement;

    // Check for saved theme preference or default to 'dark'
    const currentTheme = localStorage.getItem('theme') || 'dark';

    // Apply the theme on page load
    if (currentTheme === 'light') {
        html.classList.remove('dark');
    } else {
        html.classList.add('dark');
    }

    // Update Safari status bar color on initial load
    updateThemeColor(html.classList.contains('dark'));

    // Update icon based on current theme
    function updateIcon(): void {
        if (html.classList.contains('dark')) {
            // Dark mode: show sun (click to go light)
            themeIcon?.classList.remove('fa-moon');
            themeIcon?.classList.add('fa-sun');
        } else {
            // Light mode: show moon (click to go dark)
            themeIcon?.classList.remove('fa-sun');
            themeIcon?.classList.add('fa-moon');
        }
    }

    // Set initial icon
    updateIcon();

    // Toggle theme on button click
    themeToggle?.addEventListener('click', () => {
        // Check if browser supports View Transitions API
        if (!document.startViewTransition) {
            // Fallback: instant toggle (existing behavior)
            html.classList.toggle('dark');
            const isDark = html.classList.contains('dark');
            const newTheme = isDark ? 'dark' : 'light';
            localStorage.setItem('theme', newTheme);
            updateIcon();
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

        // Update icon after transition completes
        transition.finished.then(() => {
            updateIcon();
        });
    });
}

// Active Section Detection
function initActiveSection(): void {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!sections.length || !navLinks.length) return;

    const observerOptions: IntersectionObserverInit = {
        root: null,
        rootMargin: '-20% 0px -80% 0px',
        threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');

                navLinks.forEach((link) => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach((section) => observer.observe(section));
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
