/**
 * Smooth Scroll Controller
 * Handles smooth scrolling to anchor links with offset for fixed navigation
 */

const HEADER_OFFSET = 60; // Fixed header height in pixels

function initSmoothScroll() {
    // Get all anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach((anchor) => {
        anchor.addEventListener('click', (e) => {
            const href = anchor.getAttribute('href');
            if (!href || href === '#') return;

            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                e.preventDefault();

                // Calculate scroll position with offset
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - HEADER_OFFSET;

                // Smooth scroll to target
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth',
                });

                // Update URL without jumping
                if (history.pushState) {
                    history.pushState(null, '', href);
                }
            }
        });
    });
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSmoothScroll);
} else {
    initSmoothScroll();
}

// Re-initialize on view transitions
document.addEventListener('astro:page-load', initSmoothScroll);
