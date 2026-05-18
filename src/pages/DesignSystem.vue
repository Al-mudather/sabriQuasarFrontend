<template>
  <main class="ds-showcase">
    <header class="ds-showcase__head">
      <h1 class="ds-showcase__title">Design system</h1>
      <p class="ds-showcase__subtitle">
        Primitives for the STC training platform. Preview in both LTR and RTL —
        tokens live in <code>src/design-system/tokens.scss</code>.
      </p>
      <div class="ds-showcase__controls">
        <label>
          <input type="checkbox" v-model="rtl" /> Preview RTL
        </label>
      </div>
    </header>

    <section class="ds-showcase__section">
      <h2>Colors</h2>
      <div class="ds-swatches">
        <div v-for="s in swatches" :key="s.label" class="ds-swatch">
          <div class="ds-swatch__chip" :style="{ background: s.value }"></div>
          <div class="ds-swatch__meta">
            <strong>{{ s.label }}</strong>
            <code>{{ s.token }}</code>
          </div>
        </div>
      </div>
    </section>

    <section class="ds-showcase__section">
      <h2>Typography</h2>
      <div class="ds-type">
        <div v-for="t in typeSamples" :key="t.label">
          <small>{{ t.label }}</small>
          <p :style="{ fontSize: `var(${t.token})`, lineHeight: 1.25 }">
            {{ $t('التدريب الطبي · Medical training platform') }}
          </p>
        </div>
      </div>
    </section>

    <section class="ds-showcase__section">
      <h2>Buttons</h2>
      <div class="ds-row">
        <ds-button variant="primary">Primary</ds-button>
        <ds-button variant="secondary">Secondary</ds-button>
        <ds-button variant="accent">Accent</ds-button>
        <ds-button variant="ghost">Ghost</ds-button>
        <ds-button variant="danger">Danger</ds-button>
        <ds-button disabled>Disabled</ds-button>
        <ds-button loading>Loading</ds-button>
      </div>
      <div class="ds-row" style="margin-top:1rem">
        <ds-button size="sm">Small</ds-button>
        <ds-button size="md">Medium</ds-button>
        <ds-button size="lg">Large</ds-button>
      </div>
    </section>

    <section class="ds-showcase__section">
      <h2>Badges</h2>
      <div class="ds-row">
        <ds-badge>Neutral</ds-badge>
        <ds-badge variant="brand">Brand</ds-badge>
        <ds-badge variant="accent">Accent</ds-badge>
        <ds-badge variant="success">In progress</ds-badge>
        <ds-badge variant="warning">Pending</ds-badge>
        <ds-badge variant="danger">Expired</ds-badge>
        <ds-badge variant="info">New</ds-badge>
      </div>
    </section>

    <section class="ds-showcase__section">
      <h2>Progress</h2>
      <div class="ds-stack">
        <ds-progress-bar :value="28" show-label />
        <ds-progress-bar :value="64" variant="accent" show-label />
        <ds-progress-bar :value="100" variant="success" show-label />
        <ds-progress-bar indeterminate />
      </div>
    </section>

    <section class="ds-showcase__section">
      <h2>Skeleton</h2>
      <div class="ds-row ds-row--align-start">
        <ds-skeleton shape="circle" width="3rem" />
        <div style="flex:1; display:flex; flex-direction:column; gap:.5rem">
          <ds-skeleton shape="line" width="60%" />
          <ds-skeleton shape="line" width="40%" />
        </div>
        <ds-skeleton shape="pill" width="8rem" />
      </div>
    </section>

    <section class="ds-showcase__section">
      <h2>Cards</h2>
      <div class="ds-grid">
        <ds-card>
          <template #media>
            <ds-skeleton shape="rect" height="160px" radius="0" />
          </template>
          <h3>Course title goes here</h3>
          <ds-progress-bar :value="42" show-label />
          <ds-button variant="accent" full-width>{{ $t('اذهب إلى الدرس') }}</ds-button>
        </ds-card>
        <ds-card elevation="lg" interactive>
          <template #media>
            <ds-skeleton shape="rect" height="160px" radius="0" />
          </template>
          <h3>Interactive card</h3>
          <p class="muted">Click or focus me — hover lifts, focus shows a ring.</p>
        </ds-card>
        <ds-card elevation="flat">
          <h3>Flat card</h3>
          <p class="muted">Border, no shadow. For dense data lists.</p>
        </ds-card>
      </div>
    </section>

    <section class="ds-showcase__section">
      <h2>Empty state</h2>
      <ds-empty-state
        :title="$t('لا توجد كورسات بعد')"
        :description="$t('ابدأ رحلتك التعليمية بتصفح الكورسات المتاحة والاشتراك في الأنسب لك.')"
      >
        <template #actions>
          <ds-button variant="primary">{{ $t('تصفح الكورسات') }}</ds-button>
          <ds-button variant="ghost">{{ $t('تعرف على المنصة') }}</ds-button>
        </template>
      </ds-empty-state>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from 'vue'

defineOptions({ name: 'DesignSystemPage' })

interface Swatch { label: string; token: string; value: string }
interface TypeSample { label: string; token: string }

const rtl = ref(document.documentElement.getAttribute('dir') === 'rtl')

const swatches: Swatch[] = [
  { label: 'Brand 600',   token: '--ds-brand-600',   value: 'var(--ds-brand-600)' },
  { label: 'Brand 700',   token: '--ds-brand-700',   value: 'var(--ds-brand-700)' },
  { label: 'Brand 50',    token: '--ds-brand-50',    value: 'var(--ds-brand-50)' },
  { label: 'Accent 300',  token: '--ds-accent-300',  value: 'var(--ds-accent-300)' },
  { label: 'Accent 500',  token: '--ds-accent-500',  value: 'var(--ds-accent-500)' },
  { label: 'Neutral 800', token: '--ds-neutral-800', value: 'var(--ds-neutral-800)' },
  { label: 'Neutral 500', token: '--ds-neutral-500', value: 'var(--ds-neutral-500)' },
  { label: 'Neutral 100', token: '--ds-neutral-100', value: 'var(--ds-neutral-100)' },
  { label: 'Success',     token: '--ds-success',     value: 'var(--ds-success)' },
  { label: 'Warning',     token: '--ds-warning',     value: 'var(--ds-warning)' },
  { label: 'Danger',      token: '--ds-danger',      value: 'var(--ds-danger)' }
]

const typeSamples: TypeSample[] = [
  { label: '4xl', token: '--ds-text-4xl' },
  { label: '3xl', token: '--ds-text-3xl' },
  { label: '2xl', token: '--ds-text-2xl' },
  { label: 'xl',  token: '--ds-text-xl'  },
  { label: 'lg',  token: '--ds-text-lg'  },
  { label: 'md',  token: '--ds-text-md'  },
  { label: 'sm',  token: '--ds-text-sm'  }
]

watch(rtl, (v) => {
  document.documentElement.setAttribute('dir', v ? 'rtl' : 'ltr')
}, { immediate: true })

onBeforeUnmount(() => {
  // Don't leave dir flipped when navigating away
  document.documentElement.setAttribute('dir', 'rtl')
})
</script>

<style lang="scss" scoped>
.ds-showcase {
  max-inline-size: 1120px;
  margin-inline: auto;
  padding: var(--ds-space-10) var(--ds-space-6);
  font-family: var(--ds-font-body);
  color: var(--ds-text);

  &__head {
    margin-block-end: var(--ds-space-10);
    padding-block-end: var(--ds-space-6);
    border-block-end: 1px solid var(--ds-border);
  }

  &__title {
    font-family: var(--ds-font-heading);
    font-size: var(--ds-text-4xl);
    font-weight: var(--ds-weight-bold);
    margin: 0;
  }

  &__subtitle {
    color: var(--ds-text-muted);
    margin-block-start: var(--ds-space-2);
    max-inline-size: 55ch;
    code { font-family: monospace; font-size: 0.85em; }
  }

  &__controls {
    margin-block-start: var(--ds-space-4);
    label { display: inline-flex; align-items: center; gap: var(--ds-space-2); cursor: pointer; }
  }

  &__section {
    margin-block-end: var(--ds-space-12);
    h2 {
      font-family: var(--ds-font-heading);
      font-size: var(--ds-text-xl);
      margin-block: 0 var(--ds-space-4);
    }
  }
}

.ds-swatches {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: var(--ds-space-3);
}
.ds-swatch {
  display: flex;
  align-items: center;
  gap: var(--ds-space-3);
  padding: var(--ds-space-2);
  border: 1px solid var(--ds-border);
  border-radius: var(--ds-radius-md);
  &__chip {
    inline-size: 42px;
    block-size: 42px;
    border-radius: var(--ds-radius-sm);
    border: 1px solid var(--ds-border);
    flex-shrink: 0;
  }
  &__meta { display: flex; flex-direction: column; font-size: var(--ds-text-xs); }
  &__meta code { color: var(--ds-text-muted); }
}

.ds-type {
  display: flex;
  flex-direction: column;
  gap: var(--ds-space-4);
  > div { display: flex; flex-direction: column; gap: var(--ds-space-1); }
  small { color: var(--ds-text-muted); font-size: var(--ds-text-xs); }
  p     { margin: 0; }
}

.ds-row {
  display: flex;
  flex-wrap: wrap;
  gap: var(--ds-space-3);
  align-items: center;
  &--align-start { align-items: flex-start; }
}
.ds-stack {
  display: flex;
  flex-direction: column;
  gap: var(--ds-space-4);
}
.ds-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: var(--ds-space-4);
  h3 { font-family: var(--ds-font-heading); font-size: var(--ds-text-lg); margin: 0; }
  .muted { color: var(--ds-text-muted); font-size: var(--ds-text-sm); margin: 0; }
}
</style>
