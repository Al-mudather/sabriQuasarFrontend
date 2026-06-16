<template>
  <div class="slide">
    <div class="slide__media">
      <img
        class="slide__image"
        :src="FORMAT_THE_IAMGE_URL(slider.slide?.cover ?? '')"
        :alt="slider.slide?.title ?? ''"
      />
    </div>

    <div class="slide__body">
      <div class="slide__heading">
        <h2 class="slide__title">{{ slider.slide?.title }}</h2>
        <p class="slide__brief">{{ slider.slide?.brief }}</p>
      </div>

      <div v-if="remaining > 0" class="slide__countdown">
        <div class="unit">
          <h3 class="unit__value">{{ countdown.days }}</h3>
          <span class="unit__label">{{ $t('يـوم') }}</span>
        </div>
        <div class="unit">
          <h3 class="unit__value">{{ countdown.hours }}</h3>
          <span class="unit__label">{{ $t('ساعة') }}</span>
        </div>
        <div class="unit">
          <h3 class="unit__value">{{ countdown.minutes }}</h3>
          <span class="unit__label">{{ $t('دقيقة') }}</span>
        </div>
        <div class="unit">
          <h3 class="unit__value">{{ countdown.seconds }}</h3>
          <span class="unit__label">{{ $t('ثانيه') }}</span>
        </div>
      </div>

      <DsButton
        variant="primary"
        size="md"
        :loading="loadingDetails"
        @click="goToCourseDetails"
      >
        {{ $t('التفاصيل') }}
      </DsButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { FORMAT_THE_IAMGE_URL } from 'src/utils/functions.js'
import { withMinDuration } from 'src/utils/withMinDuration'
import { courseSlug } from 'src/utils/courseSlug'
import type { HomePageSlider } from 'src/types/marketing-content/types'

interface Props {
  slider: HomePageSlider
}

const props = defineProps<Props>()
const router = useRouter()

const now = ref(Date.now())
let timer: ReturnType<typeof setInterval> | null = null

const startMs = computed(() =>
  props.slider.startDate ? new Date(props.slider.startDate).getTime() : 0
)

const remaining = computed(() => Math.max(0, startMs.value - now.value))

const countdown = computed(() => {
  const ms = remaining.value
  const totalSecs = Math.floor(ms / 1000)
  const days = Math.floor(totalSecs / 86400)
  const hours = Math.floor((totalSecs % 86400) / 3600)
  const minutes = Math.floor((totalSecs % 3600) / 60)
  const seconds = totalSecs % 60
  return { days, hours, minutes, seconds }
})

onMounted(() => {
  timer = setInterval(() => { now.value = Date.now() }, 1000)
})

onBeforeUnmount(() => {
  if (timer !== null) clearInterval(timer)
})

const loadingDetails = ref(false)

async function goToCourseDetails (): Promise<void> {
  if (loadingDetails.value) return
  loadingDetails.value = true
  try {
    await withMinDuration(
      Promise.resolve(
        router.push({
          name: 'course-details',
          params: {
            name: courseSlug(props.slider.slide?.title ?? ''),
            pk: String(props.slider.slide?.pk ?? ''),
            id: props.slider.slide?.id ?? ''
          }
        }),
      ),
      300,
    )
  } catch {
    /* navigation aborted/duplicated — nothing to do */
  } finally {
    loadingDetails.value = false
  }
}
</script>

<style lang="scss" scoped>
.slide {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: var(--ds-space-6, 1.5rem);
  align-items: center;
  padding: var(--ds-space-6, 1.5rem);
}

.slide__media {
  display: flex;
  justify-content: center;
}

.slide__image {
  inline-size: 100%;
  max-inline-size: 320px;
  block-size: auto;
  border-radius: var(--ds-radius-lg, 16px);
  object-fit: cover;
  box-shadow: var(--ds-shadow-md, 0 4px 12px rgba(0, 0, 0, 0.08));
}

.slide__body {
  display: flex;
  flex-direction: column;
  gap: var(--ds-space-5, 1.25rem);
  text-align: center;
}

.slide__title {
  font-family: var(--ds-font-heading, inherit);
  font-weight: var(--ds-weight-bold, 700);
  font-size: var(--ds-font-size-2xl, 1.5rem);
  color: var(--ds-color-text-primary, #104982);
  margin: 0 0 var(--ds-space-2, 0.5rem);
}

.slide__brief {
  font-size: var(--ds-font-size-md, 1rem);
  color: var(--ds-color-text-secondary, #5a6a7a);
  line-height: var(--ds-line-height-relaxed, 1.6);
  margin: 0;
}

.slide__countdown {
  display: flex;
  justify-content: center;
  gap: var(--ds-space-3, 0.75rem);
  flex-wrap: wrap;
}

.unit {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-inline-size: 64px;
  padding: var(--ds-space-3, 0.75rem);
  background: var(--ds-color-surface-subtle, #f4f7fb);
  border-radius: var(--ds-radius-md, 12px);
}

.unit__value {
  font-family: var(--ds-font-heading, inherit);
  font-weight: var(--ds-weight-bold, 700);
  font-size: var(--ds-font-size-xl, 1.25rem);
  color: var(--ds-color-text-primary, #104982);
  margin: 0;
}

.unit__label {
  font-size: var(--ds-font-size-xs, 0.75rem);
  color: var(--ds-color-text-secondary, #5a6a7a);
  margin-block-start: var(--ds-space-1, 0.25rem);
}

@media (max-width: 768px) {
  .slide {
    grid-template-columns: 1fr;
  }
}
</style>
