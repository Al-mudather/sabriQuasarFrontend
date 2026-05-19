<template>
  <footer class="app-footer" role="contentinfo">
    <!-- Topographic seam divider -->
    <div class="app-footer__seam" aria-hidden="true">
      <svg
        class="app-footer__seam-svg"
        viewBox="0 0 1200 60"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0,20 C200,5 420,45 600,25 C780,5 980,40 1200,18"
          fill="none"
          stroke="currentColor"
          stroke-width="1.2"
        />
        <path
          d="M0,36 C220,22 440,56 620,36 C800,20 1000,52 1200,32"
          fill="none"
          stroke="currentColor"
          stroke-width="1.2"
        />
        <path
          d="M0,50 C240,40 460,64 640,48 C820,32 1020,60 1200,46"
          fill="none"
          stroke="currentColor"
          stroke-width="1.2"
        />
      </svg>
    </div>

    <div class="app-footer__inner">
      <div class="app-footer__grid">
        <!-- 1) Brand column -->
        <div class="app-footer__col app-footer__col--brand">
          <div class="app-footer__lockup">
            <img
              :src="logoSrc"
              :alt="brandNameAr"
              class="app-footer__logo"
            />
          </div>
          <h2 class="app-footer__wordmark">{{ brandNameAr }}</h2>
          <p class="app-footer__tagline">{{ brandNameEn }}</p>
          <p class="app-footer__mission">
            {{ $t('مركز متخصص في التطوير الذاتي والتدريب المهني، يقدم تجربة تعليمية عربية متكاملة عبر برامج معتمدة يقودها خبراء متمرسون.') }}
          </p>
          <ul class="app-footer__social" :aria-label="$t('روابط التواصل الاجتماعي')">
            <li
              v-for="social in socials"
              :key="social.name"
              class="app-footer__social-item"
            >
              <a
                :href="social.href"
                :aria-label="social.label"
                class="app-footer__social-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  class="app-footer__social-icon"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <template v-if="social.name === 'instagram'">
                    <rect x="3" y="3" width="18" height="18" rx="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.5" cy="6.5" r="0.75" fill="currentColor" />
                  </template>
                  <template v-else-if="social.name === 'youtube'">
                    <path d="M22 8.5a3 3 0 0 0-2.1-2.1C18 6 12 6 12 6s-6 0-7.9.4A3 3 0 0 0 2 8.5 31 31 0 0 0 1.5 12 31 31 0 0 0 2 15.5a3 3 0 0 0 2.1 2.1C6 18 12 18 12 18s6 0 7.9-.4a3 3 0 0 0 2.1-2.1A31 31 0 0 0 22.5 12 31 31 0 0 0 22 8.5Z" />
                    <path d="m10 9.5 5 2.5-5 2.5Z" fill="currentColor" />
                  </template>
                  <template v-else-if="social.name === 'twitter'">
                    <path d="M4 4h3.5l4.2 5.8L16.5 4H20l-6.4 8.2L20.5 20H17l-4.7-6.3L7 20H4l6.9-8.7Z" />
                  </template>
                  <template v-else-if="social.name === 'linkedin'">
                    <rect x="3" y="3" width="18" height="18" rx="3" />
                    <path d="M7.5 10v7" />
                    <circle cx="7.5" cy="7" r="0.9" fill="currentColor" />
                    <path d="M11.5 17v-4.2a2.3 2.3 0 1 1 4.5 0V17" />
                  </template>
                </svg>
              </a>
            </li>
          </ul>
        </div>

        <!-- 2) Courses -->
        <div class="app-footer__col">
          <h3 class="app-footer__heading">{{ $t('الدورات') }}</h3>
          <ul class="app-footer__links">
            <li v-for="item in coursesLinks" :key="item.to">
              <router-link :to="item.to" class="app-footer__link">
                {{ item.label }}
              </router-link>
            </li>
          </ul>
        </div>

        <!-- 3) Center -->
        <div class="app-footer__col">
          <h3 class="app-footer__heading">{{ $t('المركز') }}</h3>
          <ul class="app-footer__links">
            <li v-for="item in centerLinks" :key="item.to">
              <router-link :to="item.to" class="app-footer__link">
                {{ item.label }}
              </router-link>
            </li>
          </ul>
        </div>

        <!-- 4) Support & Legal -->
        <div class="app-footer__col">
          <h3 class="app-footer__heading">{{ $t('الدعم والقانون') }}</h3>
          <ul class="app-footer__links">
            <li v-for="item in supportLinks" :key="item.to">
              <router-link :to="item.to" class="app-footer__link">
                {{ item.label }}
              </router-link>
            </li>
          </ul>
        </div>
      </div>

      <!-- Bottom bar -->
      <div class="app-footer__bottom">
        <p class="app-footer__copyright">
          © 2026 {{ $t('مركز د. صبري أبوقرون للتدريب — جميع الحقوق محفوظة') }}
        </p>
        <p class="app-footer__tagline-end">
          {{ $t('صُنع بعناية لطلاب الطب الناطقين بالعربية') }}
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { LOGO, BRAND } from 'src/design-system/brand'

const { t } = useI18n()

const emit = defineEmits<{
  (e: 'locale-change', val: string): void
}>()

const logoSrc = LOGO.full
const brandNameAr = BRAND.nameAr
const brandNameEn = BRAND.nameEn

// Labels go through t() so they react to locale flips.
const coursesLinks = computed(() => [
  { to: '/courses',   label: t('كل الدورات') },
  { to: '/myCourses', label: t('دوراتي') },
  { to: '/cart/',     label: t('سلة المشتريات') }
])

const centerLinks = computed(() => [
  { to: '/',         label: t('الرئيسية') },
  { to: '/courses',  label: t('الدورات') },
  { to: '/profile',  label: t('حسابي') }
])

const supportLinks = computed(() => [
  { to: '/termsandConditions', label: t('الشروط والأحكام') },
  { to: '/privacyPolicy',      label: t('سياسة الخصوصية') }
])

const socials = computed(() => [
  { name: 'instagram', href: '#', label: t('إنستغرام') },
  { name: 'youtube',   href: '#', label: t('يوتيوب') },
  { name: 'twitter',   href: '#', label: t('إكس / تويتر') },
  { name: 'linkedin',  href: '#', label: t('لينكد إن') }
])
</script>

<style lang="scss" scoped>
.app-footer {
  position: relative;
  background: var(--ds-brand-600);
  color: var(--ds-cream);
  padding-block: clamp(4rem, 9vw, 6rem);
  padding-block-start: 0; /* seam holds top visual */
  font-family: var(--ds-font-body);
}

/* ---------- Topographic seam ---------- */
.app-footer__seam {
  width: 100%;
  height: 60px;
  color: var(--ds-cream);
  opacity: 0.1;
  pointer-events: none;
  margin-block-end: clamp(2rem, 5vw, 3rem);
}

.app-footer__seam-svg {
  display: block;
  width: 100%;
  height: 100%;
}

/* ---------- Inner + grid ---------- */
.app-footer__inner {
  max-width: 1200px;
  margin-inline: auto;
  padding-inline: clamp(1rem, 4vw, 2.5rem);
}

.app-footer__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: clamp(2.5rem, 5vw, 3.5rem);

  @media (min-width: 768px) {
    grid-template-columns: 1.4fr 1fr 1fr 1fr;
    gap: clamp(2rem, 4vw, 3rem);
  }
}

.app-footer__col {
  display: flex;
  flex-direction: column;
  gap: var(--ds-space-3);
}

/* ---------- Brand column ---------- */
.app-footer__lockup {
  width: 140px;
  max-width: 100%;
  padding: var(--ds-space-3);
  background: rgba(251, 247, 240, 0.08);
  border: 1px solid rgba(251, 247, 240, 0.12);
  border-radius: var(--ds-radius-md);
  box-shadow: var(--ds-shadow-sm);
}

.app-footer__logo {
  display: block;
  width: 100%;
  height: auto;
  object-fit: contain;
}

.app-footer__wordmark {
  margin: var(--ds-space-2) 0 0;
  font-family: var(--ds-font-heading);
  font-weight: var(--ds-weight-semibold);
  font-size: 20px;
  line-height: 1.3;
  color: var(--ds-cream);
}

.app-footer__tagline {
  margin: 0;
  font-family: var(--ds-font-body);
  font-weight: var(--ds-weight-regular);
  font-size: 13px;
  line-height: 1.5;
  color: rgba(246, 241, 234, 0.68);
}

.app-footer__mission {
  margin: var(--ds-space-2) 0 0;
  font-family: var(--ds-font-body);
  font-weight: var(--ds-weight-regular);
  font-size: 14px;
  line-height: 1.85;
  color: var(--ds-cream);
  max-width: 32ch;
}

/* ---------- Social ---------- */
.app-footer__social {
  list-style: none;
  margin: var(--ds-space-3) 0 0;
  padding: 0;
  display: flex;
  align-items: center;
  gap: var(--ds-space-3);
}

.app-footer__social-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: var(--ds-radius-md);
  color: var(--ds-cream);
  background: transparent;
  border: 1px solid rgba(251, 247, 240, 0.16);
  transition:
    background-color var(--ds-duration-fast) var(--ds-ease-out),
    border-color     var(--ds-duration-fast) var(--ds-ease-out),
    transform        var(--ds-duration-fast) var(--ds-ease-out);

  &:hover,
  &:focus-visible {
    background: rgba(251, 247, 240, 0.1);
    border-color: rgba(251, 247, 240, 0.32);
    transform: translateY(-1px);
  }
}

.app-footer__social-icon {
  display: block;
}

/* ---------- Link columns ---------- */
.app-footer__heading {
  margin: 0 0 var(--ds-space-2);
  font-family: var(--ds-font-heading);
  font-weight: var(--ds-weight-medium);
  font-size: 14px;
  line-height: 1.4;
  color: var(--ds-cream);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.app-footer__links {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--ds-space-2);
}

.app-footer__link {
  position: relative;
  display: inline-block;
  font-family: var(--ds-font-body);
  font-weight: var(--ds-weight-regular);
  font-size: 14px;
  line-height: 1.85;
  color: rgba(246, 241, 234, 0.68);
  text-decoration: none;
  padding-block: 2px;
  transition: color var(--ds-duration-fast) var(--ds-ease-out);

  &::after {
    content: '';
    position: absolute;
    inset-block-end: 0;
    inset-inline-end: 0;
    inset-inline-start: auto;
    height: 1px;
    width: 100%;
    background: var(--ds-cream);
    transform: scaleX(0);
    transform-origin: inset-inline-end;
    transition: transform var(--ds-duration-base) var(--ds-ease-out);
  }

  &:hover,
  &:focus-visible {
    color: var(--ds-cream);

    &::after {
      transform: scaleX(0.5);
    }
  }
}

/* ---------- Bottom bar ---------- */
.app-footer__bottom {
  margin-block-start: clamp(2.5rem, 5vw, 3.5rem);
  padding-block-start: var(--ds-space-5);
  border-block-start: 1px solid rgba(246, 241, 234, 0.5);
  border-block-start-width: 1px;
  border-block-start-color: rgba(138, 122, 106, 0.5);
  display: flex;
  flex-direction: column;
  gap: var(--ds-space-3);
  align-items: flex-start;

  @media (min-width: 600px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}

.app-footer__copyright {
  margin: 0;
  font-family: var(--ds-font-mono);
  font-size: 11px;
  line-height: 1.6;
  color: rgba(246, 241, 234, 0.6);
}


.app-footer__tagline-end {
  margin: 0;
  font-family: var(--ds-font-body);
  font-size: 12px;
  color: rgba(246, 241, 234, 0.6);
}
/* ---------- Locale toggle (removed) ---------- */
.app-footer__locale {
  display: inline-flex;
  align-items: center;
  gap: var(--ds-space-2);
  padding: 4px var(--ds-space-3);
  border: 1px solid var(--ds-indigo-lifted);
  border-radius: var(--ds-radius-pill);
  background: transparent;
}

.app-footer__locale-btn {
  appearance: none;
  background: transparent;
  border: 0;
  padding: 2px var(--ds-space-1);
  font-family: var(--ds-font-body);
  font-weight: var(--ds-weight-medium);
  font-size: 12px;
  line-height: 1.4;
  color: rgba(246, 241, 234, 0.7);
  cursor: pointer;
  transition: color var(--ds-duration-fast) var(--ds-ease-out);

  &:hover,
  &:focus-visible {
    color: var(--ds-cream);
  }

  &.is-active {
    color: var(--ds-cream);
    font-weight: var(--ds-weight-semibold);
  }
}

.app-footer__locale-sep {
  color: rgba(246, 241, 234, 0.32);
  font-size: 12px;
  user-select: none;
}
</style>
