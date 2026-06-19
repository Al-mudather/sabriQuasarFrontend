<template>
  <div
    class="cls-cockpit"
    :data-mobile="isMobileCockpit || null"
    :data-kind="current?.kind || null"
  >
    <aside
      v-if="!isMobileCockpit"
      class="cls-cockpit__rail"
      :data-collapsed="store.railCollapsed || null"
    >
      <CurriculumRail
        :bootstrap="ctx.bootstrap.value"
        :current-content-pk="currentContentPk"
        :collapsed="store.railCollapsed"
        @select="onSelect"
        @toggle-collapse="store.toggleRail"
      />
    </aside>

    <section class="cls-cockpit__main" ref="stageRef">
      <div v-if="ctx.loading.value && !current" class="cls-cockpit__loading">
        <q-spinner-dots color="secondary" size="48px" />
      </div>
      <ClassroomEmptyState
        v-else-if="!current"
        :title="$t('classroom.empty.contentMissing')"
        icon="videocam_off"
      />
      <div v-else class="cls-cockpit__stage">
        <div class="cls-cockpit__top">
          <!-- Lesson title now lives (centered) in the classroom header; showing
               it again above the player here was redundant. -->
          <div class="cls-cockpit__media" :data-provider="videoProvider || null">
            <VideoPlayer
              v-if="current.kind === 'video'"
              :key="current.pk"
              :model-value-raw="current.modelValueRaw"
              @begin="onBegin"
              @complete="onComplete"
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
          </div>
        </div>
      </div>
    </section>

    <!-- Side panel. Desktop: static right column. Mobile: a full-height drawer
         that slides in over the video, opened by the floating button below. -->
    <aside
      class="cls-cockpit__panel"
      :data-drawer="isMobileCockpit || null"
      :data-open="(isMobileCockpit && drawerOpen) || null"
      :aria-hidden="isMobileCockpit && !drawerOpen ? 'true' : undefined"
    >
      <button
        v-if="isMobileCockpit"
        type="button"
        class="cls-cockpit__drawer-close"
        aria-label="إغلاق"
        @click="drawerOpen = false"
      >
        <q-icon name="close" size="22px" />
      </button>

      <ClassroomSidePanel
        :active-tab="store.panelTab"
        :show-curriculum="isMobileCockpit"
        @update:active-tab="store.setTab($event)"
      >
        <template #curriculum>
          <CurriculumRail
            :bootstrap="ctx.bootstrap.value"
            :current-content-pk="currentContentPk"
            :collapsed="false"
            @select="onSelect"
          />
        </template>

        <template #overview>
          <ClassroomOverviewPanel :bootstrap="ctx.bootstrap.value" />
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

    <!-- Mobile: dimmed scrim behind the open drawer. -->
    <transition name="cls-fade">
      <div
        v-if="isMobileCockpit && drawerOpen"
        class="cls-cockpit__scrim"
        @click="drawerOpen = false"
      />
    </transition>

    <!-- Mobile: floating button that opens the lesson drawer. -->
    <q-btn
      v-if="isMobileCockpit"
      v-show="!drawerOpen"
      round
      unelevated
      size="lg"
      icon="format_list_bulleted"
      class="cls-cockpit__fab"
      :aria-label="$t('classroom.panel.curriculum')"
      @click="drawerOpen = true"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, inject, onBeforeUnmount, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useClassroomStore } from 'src/stores/classroom'
import { ClassroomContextKey } from 'src/composables/classroom/classroomContext'
import {
  parseModelValue,
  resolveVideoProvider,
  type ParsedFileValue,
  type ParsedQuizValue,
  type ParsedVideoValue,
  type VideoProvider,
} from 'src/types/classroom/types'
import CurriculumRail from 'src/components/classroom/CurriculumRail.vue'
import ClassroomSidePanel from 'src/components/classroom/ClassroomSidePanel.vue'
import ClassroomOverviewPanel from 'src/components/classroom/ClassroomOverviewPanel.vue'
import ClassroomEmptyState from 'src/components/classroom/ClassroomEmptyState.vue'
import VideoPlayer from 'src/components/classroom/player/VideoPlayer.vue'
import QuizRunner from 'src/components/classroom/quiz/QuizRunner.vue'
import FileView from 'src/components/classroom/content/FileView.vue'
import QuestionComposer from 'src/components/classroom/qa/QuestionComposer.vue'
import QuestionList from 'src/components/classroom/qa/QuestionList.vue'

defineOptions({ name: 'ClassroomContentView' })

const route = useRoute()
const router = useRouter()
const $q = useQuasar()
const store = useClassroomStore()

// Anything below Quasar's `md` breakpoint (1024px) is treated as the mobile
// cockpit: standalone curriculum rail aside is hidden and the curriculum is
// rendered inside the side panel as its first tab.
const isMobileCockpit = computed<boolean>(() => $q.screen.lt.md)
const stageRef = ref<HTMLElement | null>(null)

// Mobile only: the lesson list (curriculum / overview / Q&A) lives in a
// full-height drawer so it never crowds the video. The FAB toggles it.
const drawerOpen = ref<boolean>(false)
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

// Current lesson + its parent unit pk come from the context, which the
// layout populated via useCurrentContent (single-content query) — no need
// to iterate bootstrap.units anymore.
const current = ctx.currentContent
const currentUnitPk = ctx.currentUnitPk

// start/end come from the SINGLE useLearningProgress instance in the layout
// (via context) — instantiating our own here re-ran the whole progress query.
const startProgress = ctx.startProgress
const endProgress = ctx.endProgress

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

// Which playback engine the current video uses. The self-hosted HLS player now
// renders its own control bar BELOW the 16:9 stage, so its media box must not
// clip/aspect-lock like the embed providers — see the [data-provider] CSS below.
const videoProvider = computed<VideoProvider | null>(() => {
  if (!current.value || current.value.kind !== 'video') return null
  return resolveVideoProvider(parseModelValue<ParsedVideoValue>(current.value.modelValueRaw))
})

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
      await endProgress()
    }
    if (startTimer) {
      clearTimeout(startTimer)
      startTimer = null
    }
    if (cpk != null && upk != null && epk != null && kpk != null) {
      startTimer = setTimeout(() => {
        void startProgress(cpk, upk)
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
  void endProgress()
})

function onBegin(): void {
  // Video start event — kept for future analytics hook. StartLearningUnit is
  // driven by the 5s timer above, matching CC2 behavior (not by play event).
}

async function onComplete(): Promise<void> {
  // A natural video-end event is a strong signal to end the unit immediately.
  await endProgress()
}

async function onSelect(contentPk: number): Promise<void> {
  const cpk = coursePkRef.value
  if (cpk == null) return
  await endProgress()
  await router.push({
    name: 'classroom-content',
    params: { coursePk: String(cpk), contentPk: String(contentPk) },
  })
  // On mobile the curriculum lives in a drawer; close it after a pick so the
  // learner returns to the clean video.
  if (isMobileCockpit.value) {
    drawerOpen.value = false
  }
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
    min-block-size: 0;
    // The layout pins the page to 100vh; if the player + meta + nav
    // exceed the available height, scroll inside this column instead
    // of growing the document.
    overflow-y: auto;
    overflow-x: hidden;
    padding: 24px;
    background: var(--cls-surface, #0F0B1A);
    scrollbar-width: thin;
    scrollbar-color: var(--cls-divider, rgba(245, 242, 234, 0.08)) transparent;
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

  &__top {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  &__media {
    inline-size: 100%;
  }

  &__title {
    margin: 0;
    padding: 0 0 12px;
    font-size: 22px;
    font-weight: 600;
    line-height: 1.3;
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

}

// The media box OWNS the player dimensions for video content; the player
// component fills it 100%. Quiz/file content is left untouched so it keeps its
// natural, scrollable height.
.cls-cockpit[data-kind='video'] .cls-cockpit__media {
  aspect-ratio: 16 / 9;
  overflow: hidden;
  border-radius: var(--cls-radius-lg, 16px);
  background: #000;
}

// Providers that render our custom control bar BELOW the 16:9 stage (HLS, Vimeo)
// own their own layout, so the media box must not impose a 16:9 clip — that
// would crop the controls. YouTube / VdoCipher keep the clipped 16:9 box above.
.cls-cockpit[data-kind='video'] .cls-cockpit__media[data-provider='type_hasif'],
.cls-cockpit[data-kind='video'] .cls-cockpit__media[data-provider='vimeo'] {
  aspect-ratio: auto;
  overflow: visible;
  border-radius: 0;
  background: transparent;
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

// Mobile drawer chrome -------------------------------------------------------
// Close button floats in the drawer's top corner; the FAB opens the drawer; a
// scrim dims the video behind it. All three are mobile-only (v-if).
.cls-cockpit__scrim {
  position: fixed;
  inset: 0;
  z-index: 55;
  background: rgba(0, 0, 0, 0.55);
}

.cls-cockpit__drawer-close {
  position: absolute;
  z-index: 2;
  inset-block-start: 10px;
  inset-inline-end: 10px;
  inline-size: 34px;
  block-size: 34px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: var(--cls-radius-sm, 8px);
  cursor: pointer;
  background: var(--cls-surface-elevated, #1A1430);
  color: var(--cls-text-muted, #9890A8);

  &:hover {
    background: var(--cls-rail-hover, #1E1834);
    color: var(--cls-text-primary, #F5F2EA);
  }

  &:focus-visible {
    outline: var(--cls-focus-ring, 2px solid #C1623C);
    outline-offset: 2px;
  }
}

.cls-cockpit__fab {
  position: fixed;
  inset-block-end: calc(var(--cls-footer-h, 48px) + 16px);
  inset-inline-end: 16px;
  z-index: 50;
  background: var(--cls-accent, #C1623C) !important;
  color: #fff !important;
  box-shadow: 0 8px 24px rgba(193, 98, 60, 0.45);
}

.cls-fade-enter-active,
.cls-fade-leave-active {
  transition: opacity var(--cls-dur-med, 220ms) var(--cls-ease, ease);
}
.cls-fade-enter-from,
.cls-fade-leave-to {
  opacity: 0;
}

// ---------------------------------------------------------------------------
// Mobile cockpit (≤ Quasar md / 1024px).
//
// Layout shifts to a vertical stack: video first (full width), then the side
// panel which now hosts the curriculum as its first tab. The standalone rail
// aside is removed from the DOM entirely (v-if in the template) so it doesn't
// dominate the viewport above the video.
// ---------------------------------------------------------------------------
@media (max-width: 1023px) {
  .cls-cockpit {
    flex-direction: column;

    // The video stage takes the full width and sits at the top. The lesson
    // list now lives in a slide-in drawer, so nothing crowds the player — the
    // video keeps its clean, natural 16:9 shape.
    &__main {
      padding: 0;
      inline-size: 100%;
      align-items: flex-start;   // video hugs the top; quiz/file still scroll
    }

    &__stage {
      gap: 0;
      max-inline-size: none;
    }

    &__media {
      inline-size: 100%;
    }

    &__title {
      padding: 10px 12px 8px;
      font-size: 17px;
      line-height: 1.3;
      // Clamp title to 2 lines so the header height stays bounded on mobile.
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  }

  // Video: center the 16:9 stage vertically so the player reads as a framed
  // video rather than a small strip stranded at the top above a big black void
  // (the lesson panel is an off-canvas drawer on mobile, so nothing fills the
  // space below the video). Quiz/file keep flex-start above so they scroll from
  // the top. The real "make it big" path is fullscreen, fixed in VdoCipherPlayer.
  .cls-cockpit[data-kind='video'] .cls-cockpit__main {
    align-items: center;
  }

  // Full-bleed edge-to-edge video on mobile (no rounded corners).
  .cls-cockpit[data-kind='video'] .cls-cockpit__media {
    border-radius: 0;
  }

  // ----- Lesson drawer -------------------------------------------------------
  // On mobile the side panel (curriculum / overview / Q&A) becomes a full-height
  // drawer docked to the screen edge, parked off-canvas until the floating
  // button opens it. This keeps the video clean and uncrowded.
  // Physical anchoring (right edge) + physical translate keeps the slide
  // predictable under both RTL and LTR — a docked drawer hides off the same
  // edge it docks to. Logical inset + transform would fight in RTL.
  .cls-cockpit__panel[data-drawer] {
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    z-index: 60;
    inline-size: min(88vw, 420px);
    block-size: 100%;
    transform: translateX(100%);
    transition: transform var(--cls-dur-med, 220ms) var(--cls-ease, ease);
    box-shadow: -12px 0 40px rgba(0, 0, 0, 0.5);

    &[data-open] {
      transform: translateX(0);
    }
  }
}

// Fine-tune for very narrow devices (≤ ~430px / iPhone XR is 414px).
@media (max-width: 480px) {
  .cls-cockpit {
    &__title { padding: 8px 10px 6px; font-size: 15px; }
  }
}
</style>
