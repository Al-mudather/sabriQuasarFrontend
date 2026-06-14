<template>
  <main class="legal-page">
    <header class="legal-page__hero">
      <h1>{{ isEnglish ? 'Terms and Conditions' : 'الأحكام والشروط' }}</h1>
    </header>

    <section class="legal-page__content">
      <div class="legal-card legal-card--warning">
        <h2>{{ isEnglish ? 'Important note' : 'ملاحظة مهمة' }}</h2>
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

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useSettingsStore } from 'src/stores/settings'

defineOptions({ name: 'TermsAndConditions' })

const settings = useSettingsStore()
const { isEnglish } = storeToRefs(settings)

interface Clause { en: string; ar: string }

const notice: Clause = {
  en: 'Please read the following conditions carefully before using the educational platform. By using the platform you are agree to all the terms and conditions and committed to be bound by them. If you do not agree to any of the terms, please do not use the platform.',
  ar: 'يُرجى قراءة الأحكام والشروط التالية بعناية قبل استخدام المنصة التعليمية. يُعدّ استخدامك للمنصة إقراراً منك بقبول هذه الأحكام والالتزام بها. إن كنت لا توافق على أي من هذه الشروط، فيُرجى الامتناع عن استخدام المنصة.'
}

const clauses: Clause[] = [
  { en: 'All rights of courses and advertisements on the platform are reserved to Dr. Sabri Abu Qarun Training Center.',
    ar: 'جميع حقوق الدورات والمحتوى الإعلاني المنشور على المنصة محفوظة لمركز د. صبري أبوقرون للتدريب.' },
  { en: 'It is forbidden to circulate any lecture or part of a lecture by downloading from the platform and sending it to another person.',
    ar: 'يُحظر تداول أي محاضرة أو أي جزء منها عن طريق تنزيلها من المنصة وإرسالها إلى أي طرف آخر.' },
  { en: 'It is prohibited to circulate any questions or part of the exams within the platform to any other person.',
    ar: 'يُحظر تداول أسئلة الاختبارات أو أي جزء منها المتاحة داخل المنصة، أو إفشاؤها لأي طرف آخر.' },
  { en: 'Fees are not refunded after completing the registration process and attaching payment invoice on the platform.',
    ar: 'لا تُردّ الرسوم المدفوعة بعد استكمال إجراءات التسجيل وإرفاق إشعار الدفع على المنصة.' },
  { en: 'In the case of attaching the payment invoice, you must be ensured that the date of the transaction is clear in addition to the name of the recipient, the amount paid and the invoice number.',
    ar: 'عند إرفاق إشعار الدفع، يجب التحقق من وضوح جميع البيانات الآتية: تاريخ العملية، واسم المستفيد، والمبلغ المدفوع، ورقم الفاتورة.' },
  { en: 'Do not share the account "e-mail" registered on the platform with anyone else.',
    ar: 'يُمنع مشاركة بيانات الحساب المسجَّل على المنصة، بما في ذلك عنوان البريد الإلكتروني، مع أي شخص آخر.' },
  { en: 'Lectures are available for the duration of the course plus half the course period (if the duration of a course is one month as an example, the material is available for a month and a half).',
    ar: 'تظل المحاضرات متاحة طوال مدة الدورة مضافاً إليها نصف تلك المدة؛ فإذا كانت مدة الدورة شهراً واحداً مثلاً، أصبحت المادة متاحة لمدة شهر ونصف.' },
  { en: 'The course certificate is granted after attending more than 80% of the course content.',
    ar: 'تُمنح شهادة إتمام الدورة للمتدرب الذي أتم حضور ما يزيد على 80% من محتوى الدورة.' },
  { en: 'The course registration request is accepted within 72 hours from the time of submitting the application.',
    ar: 'يُعالَج طلب الالتحاق بالدورة ويُقبل خلال 72 ساعة من تاريخ تقديمه.' },
  { en: 'The course content is available on the date specified for the start of the course.',
    ar: 'يصبح محتوى الدورة متاحاً للمتدربين اعتباراً من التاريخ المحدد لانطلاقها.' },
  { en: 'The participant in a particular course is not entitled to change the account after completing the registration process for any reason, and the password for his account is not available anywhere within the platform.',
    ar: 'لا يحق للمشترك في أي دورة تغيير بيانات حسابه بعد استكمال التسجيل لأي سبب كان، كما أن كلمة المرور الخاصة بالدخول إلى الحساب لا تُخزَّن في أي موضع داخل المنصة.' },
  { en: 'No payment invoice is accepted, except on the approved accounts number for the education platform. The approved account numbers (1952614 - 2571033).',
    ar: 'لا تُقبل إشعارات الدفع إلا إذا كانت موجَّهة إلى الحسابات البنكية المعتمدة لدى المركز، وأرقامها: (1952614 - 2571033).' },
  { en: 'The payment invoice for the registration process of a course is not accepted, unless the invoice contains all its details (operation number + date + amount + account number from which the amount was issued + account number to which the amount was supplied + writing the name in quadrant in the comment box inside the invoice).',
    ar: 'لا يُقبل إشعار الدفع لإتمام التسجيل في أي دورة ما لم يتضمن كافة البيانات الآتية: رقم العملية، والتاريخ، والمبلغ، ورقم الحساب المُحوَّل منه، ورقم الحساب المُحوَّل إليه، والاسم الرباعي مكتوباً في خانة التعليقات داخل الإشعار.' },
  { en: 'The certificate is issued for the courses with the name entered by the user, and any attempt to amend the certificate name after the certificate is issued by the platform entails additional procedures and fees.',
    ar: 'تُصدر شهادة الدورة باسم المتدرب المُدخَّل عند التسجيل، وأي طلب تعديل في الاسم بعد إصدار الشهادة يستلزم اتباع إجراءات إضافية ويترتب عليه رسوم.' },
  { en: 'Violation of any of the aforementioned terms, exposes the account holder on the platform to legal accountability.',
    ar: 'يُعرِّض انتهاك أي من الأحكام الواردة أعلاه صاحب الحساب للمساءلة القانونية.' }
]
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
