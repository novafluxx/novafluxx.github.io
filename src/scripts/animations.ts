/**
 * Scroll Animation Controller
 * Handles Intersection Observer-based animations for elements with .animate-on-scroll class
 */

// Initialize scroll animations when DOM is ready
function initScrollAnimations() {
    const elements = document.querySelectorAll('.animate-on-scroll');

    if (!elements.length) return;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const element = entry.target as HTMLElement;
                    element.classList.add('animated');

                    // The animation uses `forwards`, which otherwise leaves the
                    // element on a retained compositing layer. Clear that layer
                    // once the entrance finishes so responsive resizes repaint
                    // the final layout normally.
                    const settleAnimation = (event: AnimationEvent): void => {
                        if (event.target !== element) return;

                        element.classList.add('animation-settled');
                        element.removeEventListener('animationend', settleAnimation);
                    };
                    element.addEventListener('animationend', settleAnimation);
                    // Unobserve after animation to prevent re-triggering
                    observer.unobserve(element);
                }
            });
        },
        {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px',
        }
    );

    elements.forEach((el) => observer.observe(el));
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScrollAnimations);
} else {
    initScrollAnimations();
}

// Re-initialize on view transitions (if using Astro transitions)
document.addEventListener('astro:page-load', initScrollAnimations);
