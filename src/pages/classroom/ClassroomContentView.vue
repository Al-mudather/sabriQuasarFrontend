<template>
  <div class="cls-cockpit">
    <aside class="cls-cockpit__rail" :data-collapsed="store.railCollapsed || null">
      <CurriculumRail
        :bootstrap="ctx.bootstrap.value"
        :current-content-pk="currentContentPk"
        :collapsed="store.railCollapsed"
        @select="onSelect"
        @toggle-collapse="store.toggleRail"
      />
    </aside>

    <section class="cls-cockpit__main">
      <div v-if="ctx.loading.value && !current" class="cls-cockpit__loading">
        <q-spinner-dots color="secondary" size="48px" />
      </div>
      <ClassroomEmptyState
        v-else-if="!current"
        :title="$t('classroom.empty.contentMissing')"
        icon="videocam_off"
      />
      <div v-else class="cls-cockpit__stage">
        <div class="cls-cockpit__kind-badge">{{ current.modelName }}</div>
        <h2 class="cls-cockpit__title">{{ current.title }}</h2>

        <VideoPlayer
          v-if="current.kind === 'video'"
          :model-value-raw="current.modelValueRaw"
          @begin="onBegin"
          @complete="onComplete"
          @error="onVideoError"
        />
        <QuizRunner
          v-else-if="current.kind === 'quiz' && quizContentId != null"
          :content-quiz-id="quizContentId"
          :title="quizTitle"
        />
        <FileView
          v-else-if="current.kind === 'file' && currentContentPk != null && coursePkRef != null"
          :file-url="fileUrl"
          :title="current.title"
        />
        <div
          v-else
          class="cls-cockpit__player-placeholder"
          role="img"
          :aria-label="current.title"
        >
          <q-icon name="play_circle" size="64px" />
          <p>{{ $t('classroom.player.comingSoon') }}</p>
        </div>

        <div class="cls-cockpit__nav">
          <button
            type="button"
            class="cls-cockpit__nav-btn"
            :disabled="!prevContent"
            @click="goToPrevAndEnd"
          >
            {{ $t('classroom.player.prev') }}
          </button>
          <button
            type="button"
            class="cls-cockpit__nav-btn"
            :disabled="!nextContent"
            @click="goToNextAndEnd"
          >
            {{ $t('classroom.player.next') }}
          </button>
        </div>
      </div>
    </section>

    <aside class="cls-cockpit__panel">
      <ClassroomSidePanel
        :active-tab="store.panelTab"
        @update:active-tab="store.setTab($event)"
      >
        <template #overview>
          <div class="cls-cockpit__panel-body">
            <h3>{{ $t('classroom.panel.overview') }}</h3>
            <p v-if="ctx.bootstrap.value">
              {{ ctx.bootstrap.value.completedContents }} /
              {{ ctx.bootstrap.value.totalContents }}
            </p>
          </div>
        </template>
        <template #qa>
          <div class="cls-cockpit__panel-body cls-cockpit__panel-body--scrollable">
            <QuestionComposer
              v-if="coursePkRef"
              :course-id="coursePkRef"
            />
            <QuestionList
              v-if="coursePkRef"
              :course-id="coursePkRef"
            />
            <div v-else class="cls-cockpit__panel-hint">{{ $t('classroom.panel.qaPlaceholder') }}</div>
          </div>
        </template>
      </ClassroomSidePanel>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, onBeforeUnmount, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useClassroomStore } from 'src/stores/classroom'
import { ClassroomContextKey } from 'src/composables/classroom/classroomContext'
import { useCurriculumNavigation } from 'src/composables/classroom/useCurriculumNavigation'
import { useLearningProgress } from 'src/composables/classroom/useLearningProgress'
import {
  parseModelValue,
  type CurriculumContent,
  type ParsedFileValue,
  type ParsedQuizValue,
} from 'src/types/classroom/types'
import CurriculumRail from 'src/components/classroom/CurriculumRail.vue'
import ClassroomSidePanel from 'src/components/classroom/ClassroomSidePanel.vue'
import ClassroomEmptyState from 'src/components/classroom/ClassroomEmptyState.vue'
import VideoPlayer from 'src/components/classroom/player/VideoPlayer.vue'
import QuizRunner from 'src/components/classroom/quiz/QuizRunner.vue'
import FileView from 'src/components/classroom/content/FileView.vue'
import QuestionComposer from 'src/components/classroom/qa/QuestionComposer.vue'
import QuestionList from 'src/components/classroom/qa/QuestionList.vue'

defineOptions({ name: 'ClassroomContentView' })

const route = useRoute()
const router = useRouter()
const store = useClassroomStore()
const injected = inject(ClassroomContextKey)
if (!injected) throw new Error('ClassroomContentView must be used inside ClassroomLayout')
const ctx = injected

const currentContentPk = computed<number | null>(() => {
  const raw = route.params.contentPk
  const first = Array.isArray(raw) ? raw[0] : raw
  const n = Number(first)
  return Number.isFinite(n) && n > 0 ? n : null
})

const coursePkRef = computed<number | null>(() => {
  const raw = route.params.coursePk
  const first = Array.isArray(raw) ? raw[0] : raw
  const n = Number(first)
  return Number.isFinite(n) && n > 0 ? n : null
})

const enrollmentPkRef = computed<number | null>(() => ctx.bootstrap.value?.enrollmentPk ?? null)

const current = computed<CurriculumContent | null>(() => {
  const b = ctx.bootstrap.value
  const pk = currentContentPk.value
  if (!b || pk == null) return null
  for (const u of b.units) {
    for (const c of u.contents) if (c.pk === pk) return c
  }
  return null
})

/** Find the unit pk that contains the current content (needed for StartLearningUnit). */
const currentUnitPk = computed<number | null>(() => {
  const b = ctx.bootstrap.value
  const pk = currentContentPk.value
  if (!b || pk == null) return null
  for (const u of b.units) {
    for (const c of u.contents) if (c.pk === pk) return u.pk
  }
  return null
})

const { nextContent, prevContent, goToNext, goToPrev } = useCurriculumNavigation(
  ctx.bootstrap,
  currentContentPk,
)

const { start, end } = useLearningProgress(coursePkRef, enrollmentPkRef)

// Parse modelValue on-demand for the current content type.
const parsedQuiz = computed<ParsedQuizValue | null>(() => {
  if (!current.value || current.value.kind !== 'quiz') return null
  return parseModelValue<ParsedQuizValue>(current.value.modelValueRaw)
})
const quizContentId = computed<number | null>(() => {
  const id = parsedQuiz.value?.id
  if (id == null) return null
  const n = Number(id)
  return Number.isFinite(n) && n > 0 ? n : null
})
const quizTitle = computed<string | null>(() => parsedQuiz.value?.quiz_title ?? null)

const parsedFile = computed<ParsedFileValue | null>(() => {
  if (!current.value || current.value.kind !== 'file') return null
  return parseModelValue<ParsedFileValue>(current.value.modelValueRaw)
})
const fileUrl = computed<string>(() => {
  const att = parsedFile.value?.attachment
  if (!att) return ''
  if (/^https?:\/\//i.test(att)) return att
  // CC2 composes file URLs as `${location.origin}${attachment}` — mirror that.
  if (typeof window !== 'undefined' && att.startsWith('/')) return `${window.location.origin}${att}`
  return att
})

// Fire Start 5s after content landed (matches CC2 class.vue:218-220). End fires
// on content switch / unmount so the backend can mark complete when appropriate.
let startTimer: ReturnType<typeof setTimeout> | null = null

watch(
  () => [currentContentPk.value, currentUnitPk.value, enrollmentPkRef.value, coursePkRef.value] as const,
  async ([cpk, upk, epk, kpk], prev) => {
    const [prevCpk] = prev ?? []
    if (prevCpk && prevCpk !== cpk) {
      // Flush end for the previous content before starting new.
      await end()
    }
    if (startTimer) {
      clearTimeout(startTimer)
      startTimer = null
    }
    if (cpk != null && upk != null && epk != null && kpk != null) {
      startTimer = setTimeout(() => {
        void start(cpk, upk)
      }, 5000)
    }
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  if (startTimer) {
    clearTimeout(startTimer)
    startTimer = null
  }
  void end()
})

function onBegin(): void {
  // Video start event — kept for future analytics hook. StartLearningUnit is
  // driven by the 5s timer above, matching CC2 behavior (not by play event).
}

async function onComplete(): Promise<void> {
  // A natural video-end event is a strong signal to end the unit immediately.
  await end()
}

function onVideoError(message: string): void {
  console.warn('[classroom/player] video error', message)
}

async function onSelect(contentPk: number): Promise<void> {
  const cpk = coursePkRef.value
  if (cpk == null) return
  await end()
  void router.push({
    name: 'classroom-content',
    params: { coursePk: String(cpk), contentPk: String(contentPk) },
  })
}

async function goToNextAndEnd(): Promise<void> {
  await end()
  goToNext()
}

async function goToPrevAndEnd(): Promise<void> {
  await end()
  goToPrev()
}
</script>

<style lang="scss" scoped>
@use 'src/design-system/classroom/tokens.scss';

.cls-cockpit {
  display: flex;
  flex: 1 1 auto;
  min-block-size: 0;
  inline-size: 100%;

  &__rail {
    flex: 0 0 var(--cls-rail-w, 320px);
    inline-size: var(--cls-rail-w, 320px);
    transition: inline-size var(--cls-dur-med, 220ms) var(--cls-ease, ease);

    &[data-collapsed] {
      flex-basis: var(--cls-rail-w-collapsed, 64px);
      inline-size: var(--cls-rail-w-collapsed, 64px);
    }
  }

  &__main {
    flex: 1 1 auto;
    display: flex;
    align-items: stretch;
    justify-content: center;
    min-inline-size: 0;
    padding: 24px;
    background: var(--cls-surface, #0F0B1A);
  }

  &__panel {
    flex: 0 0 var(--cls-panel-w, 360px);
    inline-size: var(--cls-panel-w, 360px);
  }

  &__loading {
    display: inline-flex;
    align-self: center;
  }

  &__stage {
    display: flex;
    flex-direction: column;
    gap: 16px;
    inline-size: 100%;
    max-inline-size: 960px;
    color: var(--cls-text-primary, #F5F2EA);
  }

  &__kind-badge {
    align-self: flex-start;
    padding: 4px 10px;
    border-radius: 999px;
    background: var(--cls-accent-soft, rgba(193, 98, 60, 0.16));
    color: var(--cls-accent, #C1623C);
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  &__title {
    margin: 0;
    font-size: 22px;
    font-weight: 600;
  }

  &__player-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    aspect-ratio: 16 / 9;
    background: rgba(18, 14, 34, 0.8);
    border: 1px dashed var(--cls-divider, rgba(245, 242, 234, 0.08));
    border-radius: var(--cls-radius-lg, 16px);
    color: var(--cls-text-muted, #9890A8);
    font-size: 13px;
  }

  &__nav {
    display: flex;
    gap: 12px;
    justify-content: space-between;
  }

  &__nav-btn {
    flex: 1 1 auto;
    padding: 10px 16px;
    background: var(--cls-surface-elevated, #1A1430);
    color: var(--cls-text-primary, #F5F2EA);
    border: 1px solid var(--cls-divider, rgba(245, 242, 234, 0.08));
    border-radius: var(--cls-radius-md, 12px);
    font: inherit;
    cursor: pointer;
    transition: background var(--cls-dur-fast, 180ms) var(--cls-ease, ease);

    &:hover:not(:disabled) { background: var(--cls-rail-hover, #1E1834); }
    &:disabled { opacity: 0.4; cursor: not-allowed; }
  }
}

.cls-cockpit__panel-body {
  padding: 20px;
  color: var(--cls-text-primary, #F5F2EA);
  block-size: 100%;

  &--scrollable {
    padding: 12px;
    overflow-y: auto;
  }
}

.cls-cockpit__panel-hint {
  color: var(--cls-text-muted, #9890A8);
  font-size: 13px;
  padding: 20px;
}

@media (max-width: 1023px) {
  .cls-cockpit {
    flex-direction: column;

    &__rail, &__panel {
      flex: 0 0 auto;
      inline-size: 100%;
      block-size: auto;
    }
  }
}
</style>
