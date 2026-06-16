/**
 * Arabic i18n namespace for the internal classroom feature.
 * Imported by src/i18n/ar/index.js and merged under the `classroom` key.
 */
export default {
  header: {
    exit: 'الخروج من الفصل',
    progressLabel: 'التقدم',
    loading: 'جارٍ تحميل الفصل…',
    fallbackTitle: 'الفصل الدراسي'
  },
  rail: {
    units: 'الوحدات',
    locked: 'مقفل'
  },
  panel: {
    curriculum: 'محتوى الدورة',
    overview: 'نظرة عامة',
    qa: 'الأسئلة والأجوبة',
    qaPlaceholder: 'ستظهر الأسئلة والأجوبة هنا.'
  },
  overview: {
    joinTelegram: 'انضم لقروب التليجرام',
    telegramMissing: 'لم يتم إنشاء المجموعة من قبل الدكتور بعد.',
    requestCertificate: 'اطلب شهادتك',
    certificateSuccess: 'تم تجهيز شهادتك بنجاح، يمكنك تحميلها الآن من صفحة شهاداتي.',
    certificateError: 'تعذر تجهيز شهادتك. حاول مرة أخرى.'
  },
  player: {
    comingSoon: 'نوع المحتوى هذا غير مدعوم حتى الآن.',
    providerPending: 'سيتم توصيل هذا المزود في مرحلة لاحقة.',
    prev: 'السابق',
    next: 'التالي',
    provider: {
      type_hasif: 'فيديو مستضاف ذاتيًا',
      vimeo: 'Vimeo',
      vdocipher: 'VdoCipher',
      youtube: 'YouTube',
      unknown: 'فيديو'
    },
    vdocipher: {
      missingCredentials: 'بيانات اعتماد الفيديو الآمن غير متوفرة. يرجى التحديث للمحاولة مرة أخرى.'
    },
    controls: {
      seek: 'تمرير',
      watched: 'تمت مشاهدته',
      play: 'تشغيل',
      pause: 'إيقاف مؤقت',
      back10: 'إرجاع 10 ثوانٍ',
      forward10: 'تقديم 10 ثوانٍ',
      mute: 'كتم الصوت',
      unmute: 'إلغاء الكتم',
      volume: 'مستوى الصوت',
      speed: 'السرعة',
      quality: 'الجودة',
      more: 'خيارات أخرى',
      fullscreen: 'ملء الشاشة',
      exitFullscreen: 'إنهاء ملء الشاشة'
    }
  },
  quiz: {
    title: 'الاختبار',
    send: 'إرسال',
    whyLabel: 'السبب:',
    errorTitle: 'تعذّر تحميل الاختبار',
    errorDescription: 'حاول بعد قليل، أو عد إلى قائمة دوراتك.'
  },
  file: {
    download: 'تنزيل',
    openInNewTab: 'فتح في علامة تبويب جديدة'
  },
  empty: {
    noCurriculum: 'لا يوجد منهج متاح بعد.',
    contentMissing: 'تعذّر العثور على هذا الدرس.',
    errorTitle: 'تعذّر تحميل الفصل',
    errorDescription: 'حاول بعد قليل، أو عد إلى قائمة دوراتك.'
  },
  footer: {
    help: 'المساعدة'
  },
  backToTop: 'العودة إلى الأعلى',
  certificate: {
    pageTitle: 'الشهادة',
    issuedOn: 'تاريخ الإصدار',
    serial: 'الرقم التسلسلي',
    period: 'الفترة',
    totalHours: 'إجمالي الساعات',
    downloadCertificate: 'تنزيل الشهادة',
    share: 'مشاركة',
    notReadyTitle: 'شهادتك في الطريق',
    notReadyDescription: 'أكمل جميع دروس الدورة للحصول على شهادتك.',
    percentComplete: 'تم إكمال {completed} من {total} درسًا',
    congrats: 'تهانينا — لقد أكملت الدورة!'
  },
  qa: {
    composerPlaceholder: 'اطرح سؤالاً حول هذه الدورة…',
    askBtn: 'اطرح سؤالاً',
    cancel: 'إلغاء',
    noQuestions: 'لا توجد أسئلة بعد. كن أول من يسأل!',
    loadMore: 'تحميل المزيد',
    replies: 'الردود',
    replyPlaceholder: 'اكتب ردًا…',
    replyBtn: 'رد',
    archive: 'أرشفة',
    archived: 'مؤرشف',
    ownBadge: 'أنت',
    errorTitle: 'حدث خطأ. يرجى المحاولة مرة أخرى.',
    nReplies: 'لا ردود | رد واحد | ردّان | {n} ردود | {n} ردًا | {n} رد',
    timeAgo: {
      justNow: 'الآن',
      minutes: 'منذ {n} د',
      hours: 'منذ {n} س',
      days: 'منذ {n} ي'
    }
  }
}
