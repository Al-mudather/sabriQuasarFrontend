<template>
  <main class="registration-code">
    <div class="registration-code__card">
      <img src="~assets/img/OBJECTS.png" alt="" class="registration-code__art" />
      <h1 class="registration-code__title">{{ $t('كود الدخول (الإحالة)') }}</h1>
      <p class="registration-code__hint">
        {{ $t('أدخل كود الإحالة المرسل إليك لإتمام عملية التسجيل.') }}
      </p>

      <form @submit.prevent="REGISTER_THE_USER_WITH_REGISTERATION_CODE">
        <q-input
          rounded outlined
          v-model="r_code"
          hint="registeration code: P01xxxxxx"
          :label="$t('كود الإحالة')"
          class="registration-code__input"
        />
        <ds-button
          type="submit"
          variant="primary"
          size="lg"
          full-width
          :loading="visible"
        >
          {{ $t('تأكيد') }}
        </ds-button>
      </form>
    </div>
  </main>
</template>

<script>
import { JoinPlatform } from 'src/queries/pyramid_marketing_management/mutation/JoinPlatform'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'RegisterationCode',

  data () {
    return { r_code: null, visible: false }
  },

  computed: {
    ...mapState('pyramidManagement', ['registerationCode'])
  },

  beforeDestroy () { this.SET_REGISTERATION_CODE_ACTION('') },

  mounted () {
    this.$q.notify({
      type: 'warning',
      progress: true,
      multiLine: true,
      position: 'top',
      message: this.$t('قم بإدخال كود التسجيل')
    })

    if (this.registerationCode.length > 4) {
      this.r_code = this.registerationCode
      this.REGISTER_THE_USER_WITH_REGISTERATION_CODE()
    }
  },

  methods: {
    ...mapActions('pyramidManagement', ['SET_REGISTERATION_CODE_ACTION']),

    async REGISTER_THE_USER_WITH_REGISTERATION_CODE () {
      if (!this.r_code) {
        this.$q.notify({
          type: 'negative',
          position: 'top',
          progress: true,
          multiLine: true,
          message: 'You must enter the registeration code'
        })
        return
      }
      this.visible = true
      try {
        const res = await this.$apollo.mutate({
          mutation: JoinPlatform,
          variables: { marketingCode: this.r_code, input: {} }
        })
        if (res.data.joinPlatform.success) {
          this.$q.notify({
            type: 'positive',
            progress: true,
            multiLine: true,
            position: 'top',
            message: this.$t('مرحبا بك')
          })
          this.SET_REGISTERATION_CODE_ACTION('')
          this.$router.push({ name: 'Home' })
        }
      } catch (e) {
        if (e.message === 'GraphQL error: Pyramid matching query does not exist.') {
          this.$q.notify({
            type: 'negative',
            progress: true,
            multiLine: true,
            position: 'top',
            message: this.$t('هذا الكود خاطئ ادخل الكود الصحيح')
          })
        }
      } finally {
        this.visible = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.registration-code {
  min-block-size: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--ds-space-8) var(--ds-space-4);

  &__card {
    inline-size: 100%;
    max-inline-size: 440px;
    background: var(--ds-surface);
    border: 1px solid var(--ds-border);
    border-radius: var(--ds-radius-lg);
    padding: var(--ds-space-8) var(--ds-space-6);
    box-shadow: var(--ds-shadow-md);
    text-align: center;
  }

  &__art {
    inline-size: auto;
    max-block-size: 140px;
    margin: 0 auto var(--ds-space-4);
  }

  &__title {
    font-family: var(--ds-font-heading);
    font-size: var(--ds-text-xl);
    font-weight: var(--ds-weight-bold);
    color: var(--ds-text);
    margin: 0 0 var(--ds-space-2);
  }

  &__hint {
    color: var(--ds-text-muted);
    font-size: var(--ds-text-sm);
    margin: 0 0 var(--ds-space-5);
  }

  &__input {
    margin-block-end: var(--ds-space-4);
  }
}
</style>
