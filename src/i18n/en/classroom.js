/**
 * English i18n namespace for the internal classroom feature.
 * Imported by src/i18n/en/index.js and merged under the `classroom` key.
 */
export default {
  header: {
    exit: 'Exit classroom',
    progressLabel: 'Progress',
    loading: 'Loading classroom…',
    fallbackTitle: 'Classroom'
  },
  rail: {
    units: 'Units',
    locked: 'Locked'
  },
  panel: {
    overview: 'Overview',
    qa: 'Q&A',
    qaPlaceholder: 'Q&A will appear here.'
  },
  player: {
    comingSoon: 'This content type is not yet supported.',
    providerPending: 'This provider will be wired in a later phase.',
    prev: 'Previous',
    next: 'Next',
    provider: {
      type_hasif: 'Self-hosted video',
      vimeo: 'Vimeo',
      vdocipher: 'VdoCipher',
      youtube: 'YouTube',
      unknown: 'Video'
    },
    vdocipher: {
      missingCredentials: 'Secure video credentials are missing. Please refresh to try again.'
    }
  },
  quiz: {
    title: 'Quiz',
    send: 'Send',
    whyLabel: 'Why:',
    errorTitle: 'Could not load this quiz',
    errorDescription: 'Try again in a moment, or return to your courses.'
  },
  file: {
    download: 'Download',
    openInNewTab: 'Open in new tab'
  },
  empty: {
    noCurriculum: 'No curriculum available yet.',
    contentMissing: 'This lesson could not be found.',
    errorTitle: 'Could not load classroom',
    errorDescription: 'Try again in a moment, or return to your courses.'
  },
  footer: {
    help: 'Help'
  },
  certificate: {
    pageTitle: 'Certificate',
    issuedOn: 'Issued on',
    serial: 'Serial number',
    period: 'Period',
    totalHours: 'Total hours',
    downloadCertificate: 'Download certificate',
    share: 'Share',
    notReadyTitle: 'Your certificate is on its way',
    notReadyDescription: 'Finish every lesson in the course to unlock your certificate.',
    percentComplete: '{completed} of {total} lessons completed',
    congrats: 'Congratulations — you finished the course!'
  },
  qa: {
    composerPlaceholder: 'Ask a question about this course…',
    askBtn: 'Ask',
    noQuestions: 'No questions yet. Be the first to ask!',
    loadMore: 'Load more',
    replies: 'Replies',
    replyPlaceholder: 'Write a reply…',
    replyBtn: 'Reply',
    archive: 'Archive',
    archived: 'Archived',
    ownBadge: 'You',
    errorTitle: 'Something went wrong. Please try again.',
    // vue-i18n plural form: `zero | one | other`
    nReplies: 'no replies | 1 reply | {n} replies',
    timeAgo: {
      justNow: 'just now',
      minutes: '{n}m ago',
      hours: '{n}h ago',
      days: '{n}d ago'
    }
  }
}
