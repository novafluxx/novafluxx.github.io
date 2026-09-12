// Static perspective-projected constellation. Repaint only when the viewport,
// theme, or active section changes; no animation loop or pointer tracking.

type RGB = readonly [number, number, number];

interface Particle {
    x: number;
    y: number;
    z: number;
    size: number;
    colorIndex: number;
    twinkle: number;
}

interface Projected {
    x: number;
    y: number;
    scale: number;
}

const Z_MAX = 1400; // far plane (world units)
const FOCAL = 520; // focal length for perspective projection
const LINK_DIST = 130; // screen-space px within which particles connect

const SECTION_STRENGTHS: Readonly<Record<string, number>> = {
    hero: 1,
    work: 0.22,
    experience: 0.17,
    aviation: 0.035,
    contact: 0.3,
};

// Particles pick a color by index so the palette can swap on theme toggle
const PALETTES: Record<'dark' | 'light', readonly RGB[]> = {
    dark: [
        [96, 165, 250], // blue-400
        [167, 139, 250], // violet-400
        [103, 232, 249], // cyan-300
        [226, 232, 240], // slate-200
    ],
    light: [
        [225, 29, 72], // rose-600
        [234, 88, 12], // orange-600
        [217, 119, 6], // amber-600
        [157, 23, 77], // pink-800
    ],
};

const LINK_COLORS: Record<'dark' | 'light', RGB> = {
    dark: [148, 163, 184], // slate-400
    light: [190, 24, 93], // pink-700
};

let cleanup: (() => void) | null = null;

function initConstellation(): void {
    cleanup?.();
    cleanup = null;

    const canvas = document.getElementById('constellation-canvas') as HTMLCanvasElement | null;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let projected: Projected[] = [];

    let fieldStrength = 1;

    let theme: 'dark' | 'light' = document.documentElement.classList.contains('dark')
        ? 'dark'
        : 'light';

    function makeParticle(): Particle {
        const spread = Math.max(width, height) * 0.75;
        return {
            x: (Math.random() * 2 - 1) * spread,
            y: (Math.random() * 2 - 1) * spread * 0.7,
            z: Math.random() * Z_MAX,
            size: 1.6 + Math.random() * 1.8,
            colorIndex: Math.floor(Math.random() * PALETTES.dark.length),
            twinkle: Math.random() * Math.PI * 2,
        };
    }

    function rebuild(): void {
        const isSmall = width < 768;
        const target = Math.round((width * height) / 11000);
        const count = Math.max(40, Math.min(target, isSmall ? 55 : 120));
        particles = Array.from({ length: count }, () => makeParticle());
        projected = particles.map(() => ({ x: 0, y: 0, scale: 0 }));
    }

    function resize(): void {
        width = Math.round(window.innerWidth);
        height = Math.max(1, Math.round(canvas!.getBoundingClientRect().height));
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas!.width = Math.round(width * dpr);
        canvas!.height = Math.round(height * dpr);
        ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
        rebuild();
    }

    function draw(): void {
        ctx!.clearRect(0, 0, width, height);

        const palette = PALETTES[theme];
        const [lr, lg, lb] = LINK_COLORS[theme];
        const cx = width / 2;
        const cy = height / 2;
        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            const s = FOCAL / (FOCAL + p.z);
            projected[i].scale = s;
            projected[i].x = cx + p.x * s;
            projected[i].y = cy + p.y * s;
        }

        // Constellation lines between nearby particles, faded by distance/depth
        ctx!.lineWidth = 1;
        for (let i = 0; i < projected.length; i++) {
            const a = projected[i];
            if (a.x < -LINK_DIST || a.x > width + LINK_DIST) continue;
            for (let j = i + 1; j < projected.length; j++) {
                const b = projected[j];
                const dx = a.x - b.x;
                const dy = a.y - b.y;
                const d2 = dx * dx + dy * dy;
                if (d2 > LINK_DIST * LINK_DIST) continue;
                const closeness = 1 - Math.sqrt(d2) / LINK_DIST;
                const alpha = closeness * 0.45 * Math.min(a.scale, b.scale, 1) * fieldStrength;
                if (alpha < 0.02) continue;
                ctx!.strokeStyle = `rgba(${lr}, ${lg}, ${lb}, ${alpha.toFixed(3)})`;
                ctx!.beginPath();
                ctx!.moveTo(a.x, a.y);
                ctx!.lineTo(b.x, b.y);
                ctx!.stroke();
            }
        }

        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            const pr = projected[i];
            const radius = p.size * pr.scale;
            if (
                radius < 0.2 ||
                pr.x < -radius || pr.x > width + radius ||
                pr.y < -radius || pr.y > height + radius
            ) {
                continue;
            }
            const [r, g, b] = palette[p.colorIndex];
            const twinkle = 0.7 + 0.3 * Math.sin(p.twinkle);
            const alpha = twinkle * Math.min(1, Math.max(0.3, pr.scale)) * fieldStrength;
            // Soft halo behind near particles for a glow effect
            if (pr.scale > 0.7) {
                ctx!.fillStyle = `rgba(${r}, ${g}, ${b}, ${(alpha * 0.18).toFixed(3)})`;
                ctx!.beginPath();
                ctx!.arc(pr.x, pr.y, radius * 3, 0, Math.PI * 2);
                ctx!.fill();
            }
            ctx!.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(3)})`;
            ctx!.beginPath();
            ctx!.arc(pr.x, pr.y, radius, 0, Math.PI * 2);
            ctx!.fill();
        }
    }

    resize();
    draw();

    let resizeTimer = 0;
    const onResize = (): void => {
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(() => {
            resize();
            syncSectionStrength();
            draw();
        }, 150);
    };
    window.addEventListener('resize', onResize);

    const sections = Array.from(document.querySelectorAll<HTMLElement>('main section[id]'));
    const syncSectionStrength = (): void => {
        const sampleY = window.innerHeight * 0.5;
        const active = sections.find((candidate) => {
            const rect = candidate.getBoundingClientRect();
            return rect.top <= sampleY && rect.bottom > sampleY;
        });
        const nextStrength = active ? (SECTION_STRENGTHS[active.id] ?? 0.18) : 0.18;
        if (fieldStrength !== nextStrength) {
            fieldStrength = nextStrength;
            draw();
        }
    };
    syncSectionStrength();
    window.addEventListener('scroll', syncSectionStrength, { passive: true });

    const themeObserver = new MutationObserver(() => {
        const next = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
        if (next !== theme) {
            theme = next;
            draw();
        }
    });
    themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class'],
    });

    cleanup = () => {
        window.clearTimeout(resizeTimer);
        window.removeEventListener('resize', onResize);
        window.removeEventListener('scroll', syncSectionStrength);
        themeObserver.disconnect();
    };
}

initConstellation();

// Re-initialize on Astro page transitions
document.addEventListener('astro:page-load', initConstellation);
