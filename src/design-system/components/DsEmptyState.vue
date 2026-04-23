<template>
  <div
    class="ds-empty"
    :class="[`ds-empty--${size}`, `ds-empty--${variant}`]"
    role="status"
  >
    <div class="ds-empty__art" :class="`ds-empty__art--${variant}`">
      <slot name="illustration">
        <img v-if="icon" :src="icon" :alt="title || ''" />

        <!-- default: open book with pen -->
        <svg
          v-else-if="variant === 'default'"
          class="ds-empty__svg"
          viewBox="0 0 240 160"
          width="240"
          height="160"
          fill="none"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <!-- pages -->
          <path d="M40 48 Q120 32 200 48 L200 124 Q120 108 40 124 Z" stroke="currentColor" />
          <!-- spine -->
          <path d="M120 40 L120 116" stroke="currentColor" opacity="0.5" />
          <!-- text lines left -->
          <path d="M58 66 L104 60" stroke="currentColor" opacity="0.4" />
          <path d="M58 78 L104 74" stroke="currentColor" opacity="0.4" />
          <path d="M58 90 L100 88" stroke="currentColor" opacity="0.4" />
          <!-- text lines right -->
          <path d="M136 60 L182 66" stroke="currentColor" opacity="0.4" />
          <path d="M136 74 L182 78" stroke="currentColor" opacity="0.4" />
          <path d="M140 88 L182 90" stroke="currentColor" opacity="0.4" />
          <!-- pen (terracotta accent) -->
          <path d="M158 30 L196 68 L190 80 L176 78 L170 72 L172 58 Z"
                stroke="var(--ds-accent-300)" />
          <path d="M186 58 L170 72" stroke="var(--ds-accent-300)" />
        </svg>

        <!-- search: magnifier + empty scroll -->
        <svg
          v-else-if="variant === 'search'"
          class="ds-empty__svg"
          viewBox="0 0 240 160"
          width="240"
          height="160"
          fill="none"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <!-- scroll -->
          <path d="M60 36 Q60 30 66 30 L164 30 Q170 30 170 36 L170 124 Q170 130 164 130 L66 130 Q60 130 60 124 Z"
                stroke="currentColor" />
          <path d="M60 42 L170 42" stroke="currentColor" opacity="0.4" />
          <path d="M60 118 L170 118" stroke="currentColor" opacity="0.4" />
          <path d="M78 64 L128 64" stroke="currentColor" opacity="0.3" />
          <path d="M78 78 L140 78" stroke="currentColor" opacity="0.3" />
          <path d="M78 92 L116 92" stroke="currentColor" opacity="0.3" />
          <!-- magnifier (terracotta) -->
          <circle cx="172" cy="98" r="24" stroke="var(--ds-accent-300)" />
          <path d="M190 116 L208 134" stroke="var(--ds-accent-300)" />
        </svg>

        <!-- error: broken compass + topo lines -->
        <svg
          v-else-if="variant === 'error'"
          class="ds-empty__svg"
          viewBox="0 0 240 160"
          width="240"
          height="160"
          fill="none"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <!-- topo contours -->
          <path d="M20 120 Q80 108 160 118 T236 112" stroke="currentColor" opacity="0.3" />
          <path d="M20 134 Q80 124 160 132 T236 128" stroke="currentColor" opacity="0.3" />
          <path d="M20 148 Q80 140 160 146 T236 144" stroke="currentColor" opacity="0.3" />
          <!-- compass body -->
          <circle cx="120" cy="76" r="44" stroke="currentColor" />
          <circle cx="120" cy="76" r="4" stroke="currentColor" />
          <!-- broken needle (terracotta) -->
          <path d="M120 76 L104 44" stroke="var(--ds-accent-300)" />
          <path d="M120 76 L138 56" stroke="var(--ds-accent-300)" />
          <!-- crack line -->
          <path d="M92 56 L108 72 L100 84 L116 96" stroke="currentColor" opacity="0.5" />
        </svg>

        <!-- success: check inside laurel -->
        <svg
          v-else-if="variant === 'success'"
          class="ds-empty__svg"
          viewBox="0 0 240 160"
          width="240"
          height="160"
          fill="none"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <!-- left laurel -->
          <path d="M88 40 Q68 80 88 120" stroke="currentColor" />
          <path d="M82 54 Q70 58 66 68" stroke="currentColor" opacity="0.6" />
          <path d="M78 72 Q64 76 62 86" stroke="currentColor" opacity="0.6" />
          <path d="M80 92 Q66 96 68 108" stroke="currentColor" opacity="0.6" />
          <!-- right laurel -->
          <path d="M152 40 Q172 80 152 120" stroke="currentColor" />
          <path d="M158 54 Q170 58 174 68" stroke="currentColor" opacity="0.6" />
          <path d="M162 72 Q176 76 178 86" stroke="currentColor" opacity="0.6" />
          <path d="M160 92 Q174 96 172 108" stroke="currentColor" opacity="0.6" />
          <!-- check (terracotta) -->
          <path d="M100 80 L116 96 L144 66" stroke="var(--ds-accent-300)" stroke-width="2.25" />
        </svg>
      </slot>
    </div>

    <h3 v-if="title || $slots.title" class="ds-empty__title">
      <slot name="title">{{ title }}</slot>
    </h3>

    <p v-if="body || description || $slots.body || $slots.description" class="ds-empty__desc">
      <slot name="body">
        <slot name="description">{{ body || description }}</slot>
      </slot>
    </p>

    <div v-if="$slots.cta || $slots.actions || ctaLabel" class="ds-empty__actions">
      <slot name="cta">
        <slot name="actions">
          <!-- NOTE: Phase 3 — replace with <DsButton variant="primary" /> once import boundary opens. -->
          <button
            v-if="ctaLabel"
            type="button"
            class="ds-empty__cta"
            @click="onCtaClick"
          >
            {{ ctaLabel }}
          </button>
        </slot>
      </slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DsEmptyState',
  props: {
    // Preserved original API
    title:       { type: String, default: '' },
    description: { type: String, default: '' },
    icon:        { type: String, default: null },
    size:        { type: String, default: 'md', validator: v => ['sm', 'md', 'lg'].includes(v) },
    // Extended API
    body:        { type: String, default: '' },
    ctaLabel:    { type: String, default: '' },
    ctaTo:       { type: [String, Object], default: null },
    variant:     {
      type: String,
      default: 'default',
      validator: v => ['default', 'search', 'error', 'success'].includes(v)
    }
  },
  methods: {
    onCtaClick (e) {
      this.$emit('cta-click', e)
      if (this.ctaTo && this.$router) {
        try { this.$router.push(this.ctaTo) } catch (_) { /* noop */ }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.ds-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: var(--ds-space-3);
  padding-block: var(--ds-space-10);
  padding-inline: var(--ds-space-4);
  color: var(--ds-text);
  max-inline-size: 420px;
  margin-inline: auto;

  &--sm { padding-block: var(--ds-space-6);  }
  &--md { padding-block: var(--ds-space-10); }
  &--lg { padding-block: var(--ds-space-16); max-inline-size: 480px; }

  &__art {
    color: var(--ds-neutral-500); // warm taupe for line-art strokes
    display: flex;
    align-items: center;
    justify-content: center;
    margin-block-end: var(--ds-space-2);

    img {
      inline-size: auto;
      block-size: auto;
      max-inline-size: 240px;
      max-block-size: 160px;
      opacity: 0.9;
    }
  }

  &__svg {
    inline-size: clamp(180px, 60%, 240px);
    block-size: auto;
  }

  &--error &__art { color: var(--ds-neutral-600); }
  &--success &__art { color: var(--ds-neutral-500); }

  &__title {
    font-family: var(--ds-font-heading);
    font-size: 20px;
    font-weight: var(--ds-weight-semibold);
    line-height: var(--ds-leading-arabic);
    color: var(--ds-ink);
    margin: 0;
  }

  &__desc {
    font-family: var(--ds-font-body);
    font-size: 15px;
    font-weight: var(--ds-weight-regular);
    line-height: var(--ds-leading-arabic);
    color: var(--ds-taupe);
    margin: 0;
    max-inline-size: 42ch;
  }

  &__actions {
    display: flex;
    gap: var(--ds-space-3);
    margin-block-start: var(--ds-space-3);
    flex-wrap: wrap;
    justify-content: center;
  }

  // Fallback CTA — mirrors DsButton primary indigo. Replace in Phase 3.
  &__cta {
    appearance: none;
    border: 0;
    cursor: pointer;
    font-family: var(--ds-font-heading);
    font-weight: var(--ds-weight-semibold);
    font-size: var(--ds-text-sm);
    color: var(--ds-text-on-indigo);
    background: var(--ds-brand-600);
    padding: 0.625rem 1.25rem;
    border-radius: var(--ds-radius-md);
    transition:
      background-color var(--ds-duration-fast) var(--ds-ease-out),
      transform var(--ds-duration-fast) var(--ds-ease-out),
      box-shadow var(--ds-duration-fast) var(--ds-ease-out);

    &:hover  { background: var(--ds-brand-500); }
    &:active { transform: translateY(1px); background: var(--ds-brand-700); }
    &:focus-visible {
      outline: none;
      box-shadow: var(--ds-shadow-focus);
    }
  }
}

@media (prefers-reduced-motion: reduce) {
  .ds-empty__cta { transition: none; }
}
</style>
