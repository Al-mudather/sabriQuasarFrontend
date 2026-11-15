// useLearningProgress.start()/end(): one EndLearningUnit per visit, and a late
// answer never touches a newer visit. Apollo is replaced by hand-settled mocks.
import { ref } from 'vue'

interface Deferred { resolve: (value: unknown) => void; reject: (e: Error) => void }
const startCalls: Array<Deferred & { vars: { progressData: { courseUnitContentId: number } } }> = []
const endCalls: Array<Deferred & { vars: { progressId: number; progressData: { courseUnitContentId: number } } }> = []

jest.mock('src/graphql/classroom/mutation/StartLearningUnit', () => ({ StartLearningUnit: { kind: 'start' } }))
jest.mock('src/graphql/classroom/mutation/EndLearningUnit', () => ({ EndLearningUnit: { kind: 'end' } }))
jest.mock('src/graphql/classroom/query/GetAllLearningProgressByCourse', () => ({ GetAllLearningProgressByCourse: { kind: 'list' } }))
jest.mock('src/composables/classroom/useStaleAfterTtl', () => ({ useStaleAfterTtl: () => ({ markFresh: () => undefined }) }))
jest.mock('@vue/apollo-composable', () => {
  const vue = jest.requireActual('vue') as typeof import('vue')
  return {
    useApolloClient: () => ({ client: { query: jest.fn() } }),
    useQuery: () => ({ result: vue.ref(undefined), refetch: jest.fn(), onResult: jest.fn(), onError: jest.fn() }),
    useMutation: (doc: { kind: string }) => ({
      mutate: (vars: never) =>
        new Promise((resolve, reject) => {
          ;(doc.kind === 'start' ? startCalls : endCalls).push({ vars, resolve, reject })
        }),
    }),
  }
})

import { useLearningProgress } from 'src/composables/classroom/useLearningProgress'

const flush = async (): Promise<void> => { for (let i = 0; i < 6; i++) await Promise.resolve() }
const started = (pk: number): unknown => ({ data: { startLearningUnit: { success: true, learning: { pk } } } })
const ended = (pk: number, complete: string | null = '2026-11-13T10:00:00Z'): unknown => ({ data: { endLearningUnit: { success: true, learning: { pk, complete } } } })

function setup(): ReturnType<typeof useLearningProgress> {
  startCalls.length = 0
  endCalls.length = 0
  return useLearningProgress(ref(14), ref(501))
}
async function startLesson(lp: ReturnType<typeof useLearningProgress>, contentPk: number, progressPk: number): Promise<void> {
  const p = lp.start(contentPk, 101)
  startCalls[startCalls.length - 1]?.resolve(started(progressPk))
  await p
}

describe('useLearningProgress end()', () => {
  it('does nothing before a lesson was started', async () => {
    const lp = setup()
    await lp.end()
    expect(endCalls).toHaveLength(0)
  })

  it('sends ONE EndLearningUnit when several callers end the same visit at once', async () => {
    const lp = setup()
    await startLesson(lp, 1001, 9001)
    const a = lp.end() // lesson tap
    const b = lp.end() // route watcher
    const c = lp.end() // unmount hook
    await flush()
    expect(endCalls).toHaveLength(1)
    expect(endCalls[0]?.vars.progressId).toBe(9001)
    endCalls[0]?.resolve(ended(9001))
    await Promise.all([a, b, c])
    expect(lp.currentProgressId.value).toBeNull()
    expect(lp.progressMap.value[1001]?.complete).toBe('2026-11-13T10:00:00Z')
    await lp.end() // already ended: nothing more to send
    expect(endCalls).toHaveLength(1)
  })

  it('keeps the progress id when the mutation fails, so a later end() retries', async () => {
    const lp = setup()
    await startLesson(lp, 1001, 9001)
    const first = lp.end()
    await flush()
    endCalls[0]?.reject(new Error('network'))
    await first
    expect(lp.currentProgressId.value).toBe(9001)
    const second = lp.end()
    await flush()
    expect(endCalls).toHaveLength(2)
    endCalls[1]?.resolve(ended(9001))
    await second
    expect(lp.currentProgressId.value).toBeNull()
  })

  it('a slow End(A) does not clear the id of lesson B started meanwhile', async () => {
    const lp = setup()
    await startLesson(lp, 1001, 9001)
    const endA = lp.end()
    await flush()
    await startLesson(lp, 1002, 9002)
    endCalls[0]?.resolve(ended(9001))
    await endA
    expect(lp.currentProgressId.value).toBe(9002)
    expect(lp.progressMap.value[1001]?.complete).toBeTruthy() // A's row is still patched
    expect(lp.progressMap.value[1002]?.complete ?? null).toBeNull()
  })

  it('A → B → A with a slow End(A): the late answer cannot clear the NEW visit to A (same progress row)', async () => {
    const lp = setup()
    await startLesson(lp, 1001, 9001)
    const endFirstVisit = lp.end()
    await flush()
    expect(endCalls).toHaveLength(1)
    await startLesson(lp, 1001, 9001) // back on A: the backend returns the same row
    endCalls[0]?.resolve(ended(9001, null))
    await endFirstVisit
    expect(lp.currentProgressId.value).toBe(9001) // the new visit is still open
    const endSecondVisit = lp.end()
    await flush()
    expect(endCalls).toHaveLength(2) // and it gets its own EndLearningUnit
    endCalls[1]?.resolve(ended(9001))
    await endSecondVisit
    expect(lp.currentProgressId.value).toBeNull()
  })

  it('ending the new visit while the old End is still in flight is NOT merged into the old request', async () => {
    const lp = setup()
    await startLesson(lp, 1001, 9001)
    void lp.end()
    await flush()
    await startLesson(lp, 1001, 9001)
    void lp.end()
    await flush()
    expect(endCalls).toHaveLength(2)
  })

  it('a stale Start answer (an older lesson) is ignored', async () => {
    const lp = setup()
    const slow = lp.start(1001, 101)
    const fast = lp.start(1002, 101)
    startCalls[1]?.resolve(started(9002))
    await fast
    startCalls[0]?.resolve(started(9001))
    await slow
    expect(lp.currentProgressId.value).toBe(9002)
    void lp.end()
    await flush()
    expect(endCalls[0]?.vars.progressId).toBe(9002)
    expect(endCalls[0]?.vars.progressData.courseUnitContentId).toBe(1002)
  })
})
