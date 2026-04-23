<template>
  <main class="legal-page">
    <header class="legal-page__hero">
      <h1>{{ isEnglish ? 'Terms and Conditions' : 'الأحكام والشروط' }}</h1>
    </header>

    <section class="legal-page__content">
      <div class="legal-card legal-card--warning">
        <h2>{{ isEnglish ? 'Important note' : 'ملاحظه مهمة' }}</h2>
        <p>{{ isEnglish ? notice.en : notice.ar }}</p>
      </div>

      <div class="legal-card">
        <h2>{{ isEnglish ? 'Terms and conditions' : 'الأحكام والشروط' }}</h2>
        <ol class="legal-clauses">
          <li v-for="(c, i) in clauses" :key="i">
            {{ isEnglish ? c.en : c.ar }}
          </li>
        </ol>
      </div>
    </section>
  </main>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'TermsAndConditions',

  data () {
    return {
      notice: {
        en: 'Please read the following conditions carefully before using the educational platform. By using the platform you are agree to all the terms and conditions and committed to be bound by them. If you do not agree to any of the terms, please do not use the platform.',
        ar: 'يرجى قراءة الشروط التاليه جيدا قبل إستخدامك للمنصه التعليميه. حيث إستخدامك لها يعني قبولك لهذه الشروط و موافقتك على الإلتزام بها. في حالة عدم موافقتك يرجى عدم إستخدام المنصه.'
      },
      clauses: [
        { en: 'All rights of courses and advertisements on the platform are reserved to Dr. Sabri Abu Qarun Training Center.',
          ar: 'جميع حقوق الكورسات و الاعلانات بالمنصة محفوظة لمركز د.صبري أبوقرون للتدريب.' },
        { en: 'It is forbidden to circulate any lecture or part of a lecture by downloading from the platform and sending it to another person.',
          ar: 'يمنع تداول أي محاضرة أو جزء من محاضرة بالتحميل من المنصه و ارسالها لشخص آخر.' },
        { en: 'It is prohibited to circulate any questions or part of the exams within the platform to any other person.',
          ar: 'يمنع تداول أي اسئلة أو جزء منها من الامتحانات الموجودة داخل المنصة لأي شخص آخر.' },
        { en: 'Fees are not refunded after completing the registration process and attaching payment invoice on the platform.',
          ar: 'لا تسترد الرسوم بعد اتمام عملية التسجيل وارفاق اشعار التوريد في المنصة.' },
        { en: 'In the case of attaching the payment invoice, you must be ensured that the date of the transaction is clear in addition to the name of the recipient, the amount paid and the invoice number.',
          ar: 'في حالة إرفاق فاتورة الدفع يجب التأكد من أن يكون تاريخ العمليه واضحا بإضافه إلى إسم المرسل إليه, المبلغ المدفوع و رقم الفاتوره.' },
        { en: 'Do not share the account "e-mail" registered on the platform with anyone else.',
          ar: 'عدم مشاركه الحساب "الايميل" المسجل بالمنصة مع أي شخص آخر.' },
        { en: 'Lectures are available for the duration of the course plus half the course period (if the duration of a course is one month as an example, the material is available for a month and a half).',
          ar: 'المحاضرات تكون متاحة طيلة فترة الكورس زائدا نصف فتره الكورس (اذا كان الكورس مدته شهر تكون المادة متاحة شهر و نصف) على سبيل المثال.' },
        { en: 'The course certificate is granted after attending more than 80% of the course content.',
          ar: 'تمنح شهادة الكورسات بعد حضور اكثر من 80% من محتوي الكورس.' },
        { en: 'The course registration request is accepted within 72 hours from the time of submitting the application.',
          ar: 'يقبل طلب التسجيل في الكورس خلال 72 ساعه من زمن رفع الطلب.' },
        { en: 'The course content is available on the date specified for the start of the course.',
          ar: 'يتوفر محتوي الكورس في التاريخ المحدد لبداية الكورس.' },
        { en: 'The participant in a particular course is not entitled to change the account after completing the registration process for any reason, and the password for his account is not available anywhere within the platform.',
          ar: 'لا يحق للمشترك في الكورس المعين تغيير البريد الالكتروني بعد اتمام عملية التسجيل لأي سبب و كلمة المرور الخاصه بالبريد الالكتروني للدخول خاصة بصاحب الحساب لا تتوفر في أي مكان داخل المنصة.' },
        { en: 'No payment invoice is accepted, except on the approved accounts number for the education platform. The approved account numbers (1952614 - 2571033).',
          ar: 'لا يقبل أي اشعار توريد الا على الحسابات المعتمدة للمركز ارقام الحساب المعتمدة (1952614 - 2571033).' },
        { en: 'The payment invoice for the registration process of a course is not accepted, unless the invoice contains all its details (operation number + date + amount + account number from which the amount was issued + account number to which the amount was supplied + writing the name in quadrant in the comment box inside the invoice).',
          ar: 'لا يقبل اشعار توريد لاتمام عملية التسجيل للكورس إلا إذا كان الاشعار يحتوي على كل تفاصيله (رقم العمليه + التاريخ + المبلغ + رقم الحساب الصادر منه المبلغ + رقم الحساب المورد إليه المبلغ + كتابه الاسم رباعي في خانة التعليق داخل الاشعار).' },
        { en: 'The certificate is issued for the courses with the name entered by the user, and any attempt to amend the certificate name after the certificate is issued by the platform entails additional procedures and fees.',
          ar: 'تصدر الشهادة للدورات بالاسم المدخل من قبل الطالب وأي تعديل بعد صدور الشهادة من قبل المنصه تترتب عليه اجراءات و رسوم إضافية.' },
        { en: 'Violation of any of the aforementioned terms, exposes the account holder on the platform to legal accountability.',
          ar: 'مخالفة أي من البنود المذكورة تعرض صاحب الحساب في المنصه للمساءلة القانونية.' }
      ]
    }
  },

  computed: {
    ...mapState('settings', ['isEnglish'])
  }
}
</script>

<style lang="scss" scoped>
.legal-page {
  background: var(--ds-surface-muted);
  min-block-size: 100vh;

  &__hero {
    background: linear-gradient(135deg, var(--ds-brand-700), var(--ds-brand-600));
    color: var(--ds-text-onBrand);
    padding: var(--ds-space-10) var(--ds-space-4);

    h1 {
      max-inline-size: 1120px;
      margin: 0 auto;
      font-family: var(--ds-font-heading);
      font-size: var(--ds-text-3xl);
      font-weight: var(--ds-weight-bold);

      @media (min-width: 900px) { font-size: var(--ds-text-4xl); }
    }
  }

  &__content {
    max-inline-size: 880px;
    margin-inline: auto;
    padding: var(--ds-space-8) var(--ds-space-3) var(--ds-space-16);
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-5);

    @media (min-width: 600px) { padding-inline: var(--ds-space-4); }
  }
}

.legal-card {
  background: var(--ds-surface);
  border: 1px solid var(--ds-border);
  border-radius: var(--ds-radius-lg);
  padding: var(--ds-space-5);
  box-shadow: var(--ds-shadow-xs);

  h2 {
    font-family: var(--ds-font-heading);
    font-size: var(--ds-text-xl);
    font-weight: var(--ds-weight-bold);
    color: var(--ds-text);
    margin: 0 0 var(--ds-space-3);
  }

  p { margin: 0; line-height: var(--ds-leading-arabic); color: var(--ds-text); }

  &--warning {
    border-inline-start: 4px solid var(--ds-accent-300);
    background: var(--ds-accent-50);

    h2 { color: var(--ds-accent-600); }
  }
}

.legal-clauses {
  margin: 0;
  padding-inline-start: var(--ds-space-5);
  display: flex;
  flex-direction: column;
  gap: var(--ds-space-3);

  li {
    color: var(--ds-text);
    line-height: var(--ds-leading-arabic);
    padding-inline-start: var(--ds-space-1);
    &::marker {
      color: var(--ds-brand-600);
      font-weight: var(--ds-weight-bold);
    }
  }
}
</style>
