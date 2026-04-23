/**
 * STC motion primitives — GSAP-based.
 *
 * The six named motions below map 1:1 to the "Motion Language" section
 * of `.stitch/DESIGN.md`. Every primitive:
 *
 *   1. Respects `prefers-reduced-motion` (early-return `null`).
 *   2. Accepts an optional overrides object.
 *   3. Returns a handle the caller can `.kill()` / clean up.
 *
 * Import pattern:
 *
 *   import { slowBreath, cascade } from '@/design-system/motion';
 *   const tween = slowBreath('.hero-portrait');
 *   onBeforeUnmount(() => tween?.kill());
 */

import { gsap } from 'gsap';

const isBrowser = typeof window !== 'undefined';

const prefersReducedMotion =
  isBrowser &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Slow, 8-second organic scale pulse. DESIGN.md — "Slow Breath": used
 * on hero portraiture, cards at rest, and ambient brand marks.
 *
 * @param {Element|string} target
 * @param {{scale?: number, duration?: number}} [opts]
 * @returns {gsap.core.Tween|null}
 */
export function slowBreath(target, { scale = 1.03, duration = 8 } = {}) {
  if (prefersReducedMotion) return null;
  return gsap.to(target, {
    scale,
    duration,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1,
  });
}

/**
 * Horizontal drift at a glacial pace — DESIGN.md "Contour Drift". Used
 * on background topographic contours / decorative SVG layers to keep
 * hero areas "alive" without distracting.
 *
 * @param {Element|string} target
 * @param {{distance?: string|number, duration?: number}} [opts]
 * @returns {gsap.core.Tween|null}
 */
export function contourDrift(target, { distance = '5%', duration = 24 } = {}) {
  if (prefersReducedMotion) return null;
  return gsap.to(target, {
    xPercent: typeof distance === 'string' && distance.endsWith('%')
      ? parseFloat(distance)
      : undefined,
    x: typeof distance === 'number' ? distance : undefined,
    duration,
    ease: 'none',
    yoyo: true,
    repeat: -1,
  });
}

/**
 * Staggered fade-and-rise entrance — DESIGN.md "Cascade". Used when a
 * group of sibling elements enters the viewport together (card grids,
 * list items, hero lines).
 *
 * NOTE: ScrollTrigger integration lands in Phase 2. For now this fires
 * immediately; callers scope it inside an IntersectionObserver if they
 * need scroll-gated entrances.
 *
 * @param {Element[]|NodeList|string} targets
 * @param {{stagger?: number, y?: number, duration?: number}} [opts]
 * @returns {gsap.core.Tween|null}
 */
export function cascade(targets, { stagger = 0.08, y = 16, duration = 0.6 } = {}) {
  if (prefersReducedMotion) {
    // Still make elements visible — just without the animation.
    gsap.set(targets, { opacity: 1, y: 0 });
    return null;
  }
  return gsap.fromTo(
    targets,
    { opacity: 0, y },
    { opacity: 1, y: 0, duration, stagger, ease: 'power2.out' }
  );
}

/**
 * Tween a number from `from` → `to` and write the formatted result
 * into `target.textContent`. DESIGN.md "Counter Up" — used for KPI
 * tiles, trainee counts, hours-taught numbers, etc.
 *
 * @param {Element|string} target
 * @param {{from?: number, to: number, duration?: number, format?: (v:number)=>string}} opts
 * @returns {gsap.core.Tween|null}
 */
export function counterUp(
  target,
  {
    from = 0,
    to,
    duration = 1.2,
    format = (v) => Math.round(v).toLocaleString('ar-EG'),
  } = {}
) {
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  if (!el) return null;

  if (prefersReducedMotion) {
    el.textContent = format(to);
    return null;
  }

  const proxy = { value: from };
  return gsap.to(proxy, {
    value: to,
    duration,
    ease: 'power2.out',
    onUpdate: () => {
      el.textContent = format(proxy.value);
    },
  });
}

/**
 * Pointer-following magnetic pull — DESIGN.md "Magnetic". Apply to
 * primary CTAs and interactive mark elements. The element translates
 * toward the cursor while the pointer is inside its bounds.
 *
 * @param {Element|string} target
 * @param {{strength?: number}} [opts] — higher = more pull (pixels at edge)
 * @returns {{kill: () => void}|null}
 */
export function magnetic(target, { strength = 4 } = {}) {
  if (!isBrowser || prefersReducedMotion) return null;
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  if (!el) return null;

  const quickX = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power3.out' });
  const quickY = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power3.out' });

  const onMove = (e) => {
    const rect = el.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width - 0.5;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;
    quickX(relX * strength * 8);
    quickY(relY * strength * 8);
  };
  const onLeave = () => {
    quickX(0);
    quickY(0);
  };

  el.addEventListener('pointermove', onMove);
  el.addEventListener('pointerleave', onLeave);

  return {
    kill() {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
      gsap.set(el, { x: 0, y: 0 });
    },
  };
}

/**
 * Cream-coloured wipe reveal — DESIGN.md "Cream Wipe". Used on section
 * transitions and image reveals: a cream rectangle slides across the
 * element, revealing content behind it.
 *
 * This implementation clip-paths the target's `::after` pseudo via an
 * inline style helper. Callers should ensure the target has
 * `position: relative`. A richer SVG-mask version lands in Phase 2.
 *
 * @param {Element|string} target
 * @param {{duration?: number}} [opts]
 * @returns {gsap.core.Tween|null}
 */
export function creamWipe(target, { duration = 1.2 } = {}) {
  if (prefersReducedMotion) {
    gsap.set(target, { clipPath: 'inset(0 0 0 0)' });
    return null;
  }
  return gsap.fromTo(
    target,
    { clipPath: 'inset(0 100% 0 0)' },
    { clipPath: 'inset(0 0% 0 0)', duration, ease: 'power3.inOut' }
  );
}

/**
 * Expose all primitives on `window.STCMotion` for ad-hoc debugging in
 * the browser console. Idempotent — safe to call multiple times.
 */
export function registerStcMotions() {
  if (!isBrowser) return;
  window.STCMotion = {
    slowBreath,
    contourDrift,
    cascade,
    counterUp,
    magnetic,
    creamWipe,
    prefersReducedMotion,
  };
}

export default {
  slowBreath,
  contourDrift,
  cascade,
  counterUp,
  magnetic,
  creamWipe,
  registerStcMotions,
};
