<template>
  <div
    class="cls-cockpit"
    :data-mobile="isMobileCockpit || null"
    :data-kind="shown?.kind || null"
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
      <!-- A real lesson is on screen. -->
      <div v-if="shown" class="cls-cockpit__stage">
        <div class="cls-cockpit__top">
          <!-- Selected lesson name, shown above the video. (The header shows
               the COURSE name.) -->
          <h2 class="cls-cockpit__title">{{ shown.title }}</h2>
          <div class="cls-cockpit__media" :data-provider="videoProvider || null">
            <!-- VdoCipher lessons share ONE key, so going from one VdoCipher
                 lesson to the next keeps the same player (and iframe) alive
                 and only swaps the video inside it. Every other provider is
                 still keyed per lesson. -->
            <VideoPlayer
              v-if="shown.kind === 'video'"
              :key="videoKey"
              :model-value-raw="shown.modelValueRaw"
              @begin="onBegin"
              @complete="onComplete"
            />
            <QuizRunner
              v-else-if="shown.kind === 'quiz' && quizContentId != null"
              :content-quiz-id="quizContentId"
              :title="quizTitle"
            />
            <FileView
              v-else-if="shown.kind === 'file' && currentContentPk != null && coursePkRef != null"
              :file-url="fileUrl"
              :title="shown.title"
            />
            <div
              v-else
              class="cls-cockpit__player-placeholder"
              role="img"
              :aria-label="shown.title"
            >
              <q-icon name="play_circle" size="64px" />
              <p>{{ $t('classroom.player.comingSoon') }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- No playable lesson anywhere in the course (every unit scanned, all
           empty). The rail still shows all units; we just say so here instead
           of hanging. -->
      <ClassroomEmptyState
        v-else-if="noContent"
        :title="$t('classroom.empty.noCurriculum')"
        icon="inbox"
      />

      <!-- Resolving the first lesson (bare course URL) or the current lesson is
           still loading → player-shaped skeleton, with the rail/units already
           visible alongside. -->
      <div
        v-else-if="currentContentPk == null || ctx.loading.value"
        class="cls-cockpit__loading"
      >
        <q-skeleton class="cls-cockpit__loading-player" />
      </div>

      <!-- A specific lesson was requested but its content didn't resolve. -->
      <ClassroomEmptyState
        v-else
        :title="$t('classroom.empty.contentMissing')"
        icon="videocam_off"
      />
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
import { computed, inject, onBeforeUnmount, ref, shallowRef, watch } from 'vue'
import { onBeforeRouteLeave, useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useClassroomStore } from 'src/stores/classroom'
import { ClassroomContextKey } from 'src/composables/classroom/classroomContext'
import { useCurriculumNavigation } from 'src/composables/classroom/useCurriculumNavigation'
import { stopVdoCipherPlayers } from 'src/composables/classroom/useVdoCipherSession'
import { isOpenableLesson, pickResumeAnchor, resumeFrom, withLocalHint } from 'src/utils/classroomResume'
import { recallLesson, rememberLesson } from 'src/utils/classroomResumeHint'
import {
  parseModelValue,
  resolveVideoProvider,
  type ClassroomBootstrap,
  type CurriculumContent,
  type ParsedFileValue,
  type ParsedQuizValue,
  type ParsedVideoValue,
  type ResumeRow,
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

// ---------------------------------------------------------------------------
// First-lesson resolution (bare `class/:coursePk` entry — no contentPk).
//
// Correct flow per product: render the classroom IMMEDIATELY (the rail shows
// ALL units, even empty ones — handled by CurriculumRail), then resolve which
// lesson to open in the background while the units are already on screen.
//
// The first unit(s) may be empty while the videos live in a LATER unit (real
// cases: course 143's unit 1 is empty; a course could have 9 empty units and
// the video only in the 10th). So we walk the units IN ORDER, loading each,
// and open the FIRST unit that actually yields lessons. If none anywhere has a
// lesson we show the no-content state — never an infinite spinner. The player
// area shows a skeleton during this resolve; the rail/units stay visible.
// ---------------------------------------------------------------------------
const { goToFirstUnwatched } = useCurriculumNavigation({
  bootstrap: ctx.bootstrap,
  currentContentPk,
  unitContents: ctx.unitContents,
})
const noContent = ref<boolean>(false)

/** Resolves once the progress list is in (or after `timeoutMs`, whichever first). */
function waitForProgress(timeoutMs: number): Promise<void> {
  if (ctx.progressReady.value) return Promise.resolve()
  return new Promise<void>((resolve) => {
    const finish = (): void => {
      clearTimeout(timer)
      stop()
      resolve()
    }
    const timer = setTimeout(finish, timeoutMs)
    const stop = watch(
      () => ctx.progressReady.value,
      (ready) => {
        if (ready) finish()
      },
    )
  })
}

/** True once a resolve started for `cpk` must stop: lesson chosen, or another course on screen. */
type StaleCheck = () => boolean

/**
 * Open-from-here decision for ONE anchor row (src/utils/classroomResume.ts).
 * Only the unit that owns the anchor is loaded — plus later units when
 * everything after it is finished. null = this anchor cannot be used (unit or
 * lesson gone, lesson not openable, or the resolve went stale).
 */
async function resumeFromAnchor(b: ClassroomBootstrap, anchor: ResumeRow, stale: StaleCheck): Promise<number | null> {
  if (anchor.unitPk == null) return null
  const anchorUnitPk = anchor.unitPk
  const unitIndex = b.units.findIndex((u) => u.pk === anchorUnitPk)
  if (unitIndex === -1) return null

  const isComplete = (pk: number): boolean => Boolean(ctx.progress.value[pk]?.complete)
  const lessonsOf = (unitPk: number): CurriculumContent[] => ctx.unitContents.get(unitPk) ?? []
  const hasMore = (unitPk: number): boolean => ctx.unitPagination.get(unitPk)?.hasNextPage === true
  let lessons: CurriculumContent[] = []
  const decide = (): ReturnType<typeof resumeFrom> => {
    const openable = new Set(lessons.filter((l) => isOpenableLesson(l.kind, l.modelValueRaw)).map((l) => l.pk))
    return resumeFrom(lessons.map((l) => l.pk), anchor, isComplete, (pk) => openable.has(pk))
  }
  // Settled = the anchor itself is unfinished, or an unfinished lesson was found after it.
  const settled = (): boolean => {
    const d = decide()
    return d.kind === 'open' && (!anchor.complete || d.contentPk !== anchor.contentPk)
  }

  await ctx.loadUnit(anchorUnitPk)
  if (stale()) return null
  lessons = lessonsOf(anchorUnitPk)
  // Units page at 100 lessons: keep paging until the anchor (and something
  // unfinished after it) is in view, or the unit is exhausted.
  for (let page = 0; page < 20 && hasMore(anchorUnitPk) && !settled(); page++) {
    await ctx.loadMore(anchorUnitPk)
    if (stale()) return null
    lessons = lessonsOf(anchorUnitPk)
  }
  if (decide().kind === 'anchor-not-found') return null
  // Everything after the anchor in its unit is finished: look into later units.
  for (const unit of b.units.slice(unitIndex + 1)) {
    if (settled()) break
    await ctx.loadUnit(unit.pk)
    if (stale()) return null
    lessons = [...lessons, ...lessonsOf(unit.pk)]
  }
  const decision = decide()
  return decision.kind === 'open' ? decision.contentPk : null
}

/**
 * Which lesson should a bare classroom URL open for a student WITH progress?
 * The lesson they touched last if it is unfinished, else the first unfinished
 * lesson after it. Tried first with the device-local hint, then — if that
 * points at a lesson / unit that no longer exists or cannot be opened — with
 * the server rows alone. Returns null for "no progress / cannot tell" → the
 * caller opens lesson 1.
 */
async function resolveResumeLesson(b: ClassroomBootstrap, stale: StaleCheck): Promise<number | null> {
  await waitForProgress(4000)
  if (stale()) return null
  const serverRows = ctx.resumeRows.value
  const serverAnchor = pickResumeAnchor(serverRows)
  const hintedAnchor = pickResumeAnchor(withLocalHint(serverRows, recallLesson(b.enrollmentPk)))
  const tried = new Set<ResumeRow>()
  for (const anchor of [hintedAnchor, serverAnchor]) {
    if (!anchor || tried.has(anchor)) continue
    tried.add(anchor)
    const pk = await resumeFromAnchor(b, anchor, stale)
    if (stale()) return null
    if (pk != null) return pk
  }
  return null
}

// One resolve per course at a time. A token (not a plain "in flight" flag)
// so that switching course mid-resolve neither blocks the new course nor lets
// the old run push the old course's pk with the new course's lesson.
let resolveRun = 0
let resolvingCoursePk: number | null = null

async function resolveFirstLesson(): Promise<void> {
  if (currentContentPk.value != null) return // already on a lesson
  const b = ctx.bootstrap.value
  const cpk = coursePkRef.value
  if (!b || cpk == null) return
  // Cross-course race guard: when switching courses in-app the layout persists,
  // so `bootstrap` can momentarily still hold the previous course.
  if (b.coursePk !== cpk) return
  if (resolvingCoursePk === cpk) return // this course is already being resolved
  const run = ++resolveRun
  resolvingCoursePk = cpk
  const stale: StaleCheck = () =>
    run !== resolveRun ||
    currentContentPk.value != null ||
    coursePkRef.value !== cpk ||
    ctx.bootstrap.value?.coursePk !== cpk
  noContent.value = false
  try {
    // Returning student: open the lesson they were on (one lesson, one
    // player — no lesson-1 flash). No progress → the walk below, unchanged.
    const resumePk = await resolveResumeLesson(b, stale)
    if (stale()) return
    if (resumePk != null) {
      void router.push({
        name: 'classroom-content',
        params: { coursePk: String(cpk), contentPk: String(resumePk) },
      })
      return
    }
    for (const unit of b.units) {
      const lessons = await ctx.loadUnit(unit.pk)
      if (stale()) return // user navigated, or another course is on screen now
      if (lessons && lessons.length > 0) {
        // goToFirstUnwatched scans hydrated units in order → first lesson of the
        // first non-empty unit we just loaded.
        goToFirstUnwatched(cpk)
        return
      }
    }
    noContent.value = true // walked every unit, nothing playable
  } finally {
    if (run === resolveRun) resolvingCoursePk = null
  }
}

watch(
  [() => ctx.bootstrap.value, currentContentPk, coursePkRef],
  () => {
    if (currentContentPk.value == null) void resolveFirstLesson()
  },
  { immediate: true },
)

// Current lesson + its parent unit pk come from the context, which the
// layout populated via useCurrentContent (single-content query) — no need
// to iterate bootstrap.units anymore.
const current = ctx.currentContent
const currentUnitPk = ctx.currentUnitPk

function providerOf(content: CurriculumContent | null): VideoProvider | null {
  if (!content || content.kind !== 'video') return null
  return resolveVideoProvider(parseModelValue<ParsedVideoValue>(content.modelValueRaw))
}

// What is actually on screen. It follows `current`, with one deliberate lag:
// when the lesson on screen is a VdoCipher video and the next one is NOT
// (Vimeo / self-hosted / file / quiz / nothing), the VdoCipher player is
// stopped gracefully first — about:blank, wait for it, remove — and only then
// is the stage switched. Once Vue unmounts the player there is nothing left
// to wait for, and the next media element would start 0 ms after it.
// VdoCipher → VdoCipher needs no lag: the same player stays mounted.
const shown = shallowRef<CurriculumContent | null>(current.value)
let shownToken = 0
watch(current, async (next) => {
  const token = ++shownToken
  if (providerOf(shown.value) === 'vdocipher' && providerOf(next) !== 'vdocipher') {
    await stopVdoCipherPlayers()
  }
  if (token === shownToken) shown.value = next
})

// Leaving the classroom: same graceful stop before the page is torn down.
onBeforeRouteLeave(async () => {
  await stopVdoCipherPlayers()
})

// Remember the lesson on screen (per enrollment, this device) so the next
// bare entry resumes here even while the cached progress list is stale.
watch(
  () => [shown.value?.pk ?? null, currentUnitPk.value, enrollmentPkRef.value] as const,
  ([pk, unitPk, enrollmentPk]) => {
    if (pk == null || unitPk == null || enrollmentPk == null || pk !== currentContentPk.value) return
    rememberLesson(enrollmentPk, pk, unitPk)
  },
  { immediate: true },
)

// start/end come from the SINGLE useLearningProgress instance in the layout
// (via context) — instantiating our own here re-ran the whole progress query.
const startProgress = ctx.startProgress
const endProgress = ctx.endProgress

// Parse modelValue on-demand for the current content type.
const parsedQuiz = computed<ParsedQuizValue | null>(() => {
  if (!shown.value || shown.value.kind !== 'quiz') return null
  return parseModelValue<ParsedQuizValue>(shown.value.modelValueRaw)
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
const videoProvider = computed<VideoProvider | null>(() => providerOf(shown.value))

// One shared key for every VdoCipher lesson (persistent player); per-lesson
// keys for everything else.
const videoKey = computed<string>(() =>
  videoProvider.value === 'vdocipher' ? 'vdocipher' : `lesson-${shown.value?.pk ?? 'none'}`,
)

const parsedFile = computed<ParsedFileValue | null>(() => {
  if (!shown.value || shown.value.kind !== 'file') return null
  return parseModelValue<ParsedFileValue>(shown.value.modelValueRaw)
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

// End the lesson, THEN re-read the enrollment. EndLearningUnit returns only
// `success` + the single `learning` row, so Apollo cannot update the enrollment
// entity from its payload — and the Overview panel reads its
// `completed / total / percentage` straight off that entity via the bootstrap.
// Without this refresh the header sat at a stale percentage until the learner
// hit reload. `refreshEnrollment` is a network re-read of a query we already
// own; it is cheap and only fires on real lesson-boundary events.
async function endProgressAndSync(): Promise<void> {
  await endProgress()
  ctx.refreshEnrollment()
}

watch(
  () => [currentContentPk.value, currentUnitPk.value, enrollmentPkRef.value, coursePkRef.value] as const,
  ([cpk, upk, epk, kpk], prev) => {
    const [prevCpk] = prev ?? []
    if (prevCpk && prevCpk !== cpk) {
      // End the previous lesson in the background: navigation never waits on
      // this mutation (a slow connection made a tap look dead and invited a
      // second one). useLearningProgress.end() captures the row it ends before
      // its first await and sends ONE EndLearningUnit per row.
      void endProgressAndSync()
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
  await endProgressAndSync()
}

// Lesson tap: navigate at once. Ending the lesson being left is the route
// watcher's job (above) and runs in the background. A second tap on the
// lesson already open — or already being opened — does nothing.
let pendingSelectPk: number | null = null

function onSelect(contentPk: number): void {
  const cpk = coursePkRef.value
  if (cpk == null) return
  // On mobile the curriculum lives in a drawer; close it after a pick so the
  // learner returns to the clean video.
  if (isMobileCockpit.value) {
    drawerOpen.value = false
  }
  if (contentPk === currentContentPk.value || contentPk === pendingSelectPk) return
  pendingSelectPk = contentPk
  void router
    .push({
      name: 'classroom-content',
      params: { coursePk: String(cpk), contentPk: String(contentPk) },
    })
    .finally(() => {
      if (pendingSelectPk === contentPk) pendingSelectPk = null
    })
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
    display: flex;
    align-items: center;
    justify-content: center;
    inline-size: 100%;
    max-inline-size: 960px;
    align-self: center;
  }

  &__loading-player {
    inline-size: 100%;
    aspect-ratio: 16 / 9;
    border-radius: var(--cls-radius-lg, 16px);
    background: rgba(245, 242, 234, 0.07);
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

// VdoCipher help panel (shown after automatic recovery from a DRM session
// error gave up): a title, four steps and a retry button do not fit a 16:9 box
// at phone width, so let the box grow with the panel. Browsers without :has()
// keep the 16:9 box and the panel scrolls inside it.
@supports selector(:has(*)) {
  .cls-cockpit[data-kind='video'] .cls-cockpit__media:has(.cls-vdo[data-state='failed']) {
    aspect-ratio: auto;
    min-block-size: 0;

    :deep(.cls-vdo__help) {
      position: relative;
      inset: auto;
    }
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

  // Al-Hasif's control bar ends with a row of two buttons (speed / quality).
  // Keep that row clear of the floating lesson-list button (60px + 16px gap,
  // pinned above the footer), and when the stage is taller than the screen
  // (landscape phones) let it scroll from its top instead of clipping it.
  .cls-cockpit[data-kind='video'] .cls-cockpit__media[data-provider='type_hasif'] {
    margin-block-end: 84px;
  }
  // Landscape phones: the footer collapses, so the button sits lower
  // relative to the scrolling column — leave room for all of it.
  @media (max-height: 500px) {
    .cls-cockpit[data-kind='video'] .cls-cockpit__media[data-provider='type_hasif'] {
      margin-block-end: 136px;
    }
  }
  @supports selector(:has(*)) {
    .cls-cockpit[data-kind='video'] .cls-cockpit__main:has(.cls-cockpit__media[data-provider='type_hasif']) {
      align-items: safe center;
    }
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
