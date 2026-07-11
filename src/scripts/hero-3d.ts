// 3D hero effect: a perspective-projected particle field with constellation
// lines drawn on a canvas, plus pointer-driven camera parallax and content
// tilt. No dependencies: plain canvas 2D with manual 3D projection.

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
const DRIFT_SPEED = 128; // world units/sec particles drift toward the viewer
const CAM_RANGE = 80; // max world-space camera shift from pointer
const LINK_DIST = 130; // screen-space px within which particles connect

const SECTION_STRENGTHS: Readonly<Record<string, number>> = {
    hero: 1,
    work: 0.22,
    experience: 0.17,
    aviation: 0.035,
    contact: 0.3,
};

// Glitch accent timing
const GLITCH_MIN_DELAY = 4000; // ms
const GLITCH_DELAY_RANGE = 5000; // ms of extra random delay
const GLITCH_DURATION = 380; // ms; must cover the CSS glitch keyframes

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

function initHero3D(): void {
    cleanup?.();
    cleanup = null;

    const section = document.getElementById('hero');
    const canvas = document.getElementById('constellation-canvas') as HTMLCanvasElement | null;
    const content = section?.querySelector<HTMLElement>('.hero-content') ?? null;
    if (!section || !canvas || !content) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const nameEl = section.querySelector<HTMLElement>('.hero-name');

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(pointer: fine)').matches;

    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let projected: Projected[] = [];

    let rafId = 0;
    let running = false;
    let inView = true;
    let lastTime = 0;
    let fieldStrength = 1;
    let targetFieldStrength = 1;

    // Pointer position normalized to [-1, 1]; the camera eases toward it
    let pointerX = 0;
    let pointerY = 0;
    let camX = 0;
    let camY = 0;

    let theme: 'dark' | 'light' = document.documentElement.classList.contains('dark')
        ? 'dark'
        : 'light';

    function makeParticle(atFarPlane: boolean): Particle {
        const spread = Math.max(width, height) * 0.75;
        return {
            x: (Math.random() * 2 - 1) * spread,
            y: (Math.random() * 2 - 1) * spread * 0.7,
            z: atFarPlane ? Z_MAX : Math.random() * Z_MAX,
            size: 1.6 + Math.random() * 1.8,
            colorIndex: Math.floor(Math.random() * PALETTES.dark.length),
            twinkle: Math.random() * Math.PI * 2,
        };
    }

    function rebuild(): void {
        const isSmall = width < 768;
        const target = Math.round((width * height) / 11000);
        const count = Math.max(40, Math.min(target, isSmall ? 55 : 120));
        particles = Array.from({ length: count }, () => makeParticle(false));
        projected = particles.map(() => ({ x: 0, y: 0, scale: 0 }));
    }

    function resize(): void {
        width = Math.round(window.innerWidth);
        height = Math.round(window.innerHeight - 60);
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas!.width = Math.round(width * dpr);
        canvas!.height = Math.round(height * dpr);
        ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
        rebuild();
    }

    function step(dt: number): void {
        for (const p of particles) {
            p.z -= DRIFT_SPEED * dt;
            // Once a particle flies past the camera, recycle it at the far plane
            if (p.z < -FOCAL * 0.6) {
                const next = makeParticle(true);
                p.x = next.x;
                p.y = next.y;
                p.z = next.z;
                p.twinkle = next.twinkle;
            }
        }
    }

    function draw(time: number): void {
        ctx!.clearRect(0, 0, width, height);

        const palette = PALETTES[theme];
        const [lr, lg, lb] = LINK_COLORS[theme];
        const cx = width / 2;
        const cy = height / 2;
        // Camera moves opposite the pointer so the scene recedes as content
        // tilts toward the cursor; perspective handles per-depth shift
        const camWorldX = camX * CAM_RANGE;
        const camWorldY = camY * CAM_RANGE * 0.7;

        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            const s = FOCAL / (FOCAL + p.z);
            projected[i].scale = s;
            projected[i].x = cx + (p.x - camWorldX) * s;
            projected[i].y = cy + (p.y - camWorldY) * s;
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
            const twinkle = 0.7 + 0.3 * Math.sin(time * 1.7 + p.twinkle);
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

    function frame(now: number): void {
        const dt = Math.min((now - lastTime) / 1000, 0.05);
        lastTime = now;

        camX += (pointerX - camX) * Math.min(1, dt * 3.5);
        camY += (pointerY - camY) * Math.min(1, dt * 3.5);
        fieldStrength += (targetFieldStrength - fieldStrength) * Math.min(1, dt * 4);

        if (finePointer) {
            content!.style.setProperty('--tilt-y', `${(camX * 6).toFixed(3)}deg`);
            content!.style.setProperty('--tilt-x', `${(-camY * 4).toFixed(3)}deg`);
        }

        step(dt);
        draw(now / 1000);

        if (running) {
            rafId = requestAnimationFrame(frame);
        }
    }

    function syncRunning(): void {
        const shouldRun = !document.hidden && !reducedMotion;
        if (shouldRun && !running) {
            running = true;
            lastTime = performance.now();
            rafId = requestAnimationFrame(frame);
        } else if (!shouldRun && running) {
            running = false;
            cancelAnimationFrame(rafId);
        }
    }

    function drawStatic(): void {
        step(0);
        draw(0);
    }

    // --- Wiring ---

    // Always paint one frame up front so the canvas is never blank while the
    // loop is gated off (reduced motion, hidden tab, hero out of view)
    resize();
    drawStatic();

    let resizeTimer = 0;
    const onResize = (): void => {
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(() => {
            resize();
            drawStatic();
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
        targetFieldStrength = active ? (SECTION_STRENGTHS[active.id] ?? 0.18) : 0.18;

        if (!running) {
            fieldStrength = targetFieldStrength;
            drawStatic();
        }
    };
    syncSectionStrength();
    window.addEventListener('scroll', syncSectionStrength, { passive: true });

    const onPointerMove = (e: PointerEvent): void => {
        pointerX = (e.clientX / window.innerWidth) * 2 - 1;
        pointerY = (e.clientY / window.innerHeight) * 2 - 1;
    };
    const onPointerReset = (): void => {
        pointerX = 0;
        pointerY = 0;
    };
    if (!reducedMotion && finePointer) {
        window.addEventListener('pointermove', onPointerMove, { passive: true });
        document.documentElement.addEventListener('mouseleave', onPointerReset);
        window.addEventListener('blur', onPointerReset);
    }

    const io = new IntersectionObserver((entries) => {
        inView = entries[0]?.isIntersecting ?? true;
        syncRunning();
    });
    io.observe(section);

    const onVisibility = (): void => syncRunning();
    document.addEventListener('visibilitychange', onVisibility);

    const themeObserver = new MutationObserver(() => {
        const next = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
        if (next !== theme) {
            theme = next;
            // Repaint immediately so a paused canvas (reduced motion,
            // hidden tab) doesn't keep the old palette
            if (!running) drawStatic();
        }
    });
    themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class'],
    });

    // Occasional glitch flicker on the name: toggle .glitching (CSS runs the
    // RGB-split keyframes) at random intervals while the tab is visible
    let glitchOnTimer = 0;
    let glitchOffTimer = 0;
    function scheduleGlitch(): void {
        glitchOnTimer = window.setTimeout(
            () => {
                if (document.hidden || !inView) {
                    scheduleGlitch();
                    return;
                }
                nameEl!.classList.add('glitching');
                glitchOffTimer = window.setTimeout(() => {
                    nameEl!.classList.remove('glitching');
                    scheduleGlitch();
                }, GLITCH_DURATION);
            },
            GLITCH_MIN_DELAY + Math.random() * GLITCH_DELAY_RANGE,
        );
    }
    if (!reducedMotion && nameEl) scheduleGlitch();

    syncRunning();

    cleanup = () => {
        running = false;
        cancelAnimationFrame(rafId);
        window.clearTimeout(resizeTimer);
        window.clearTimeout(glitchOnTimer);
        window.clearTimeout(glitchOffTimer);
        nameEl?.classList.remove('glitching');
        window.removeEventListener('resize', onResize);
        window.removeEventListener('scroll', syncSectionStrength);
        window.removeEventListener('pointermove', onPointerMove);
        document.documentElement.removeEventListener('mouseleave', onPointerReset);
        window.removeEventListener('blur', onPointerReset);
        document.removeEventListener('visibilitychange', onVisibility);
        io.disconnect();
        themeObserver.disconnect();
    };
}

initHero3D();

// Re-initialize on Astro page transitions
document.addEventListener('astro:page-load', initHero3D);
