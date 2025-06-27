<template>
  <div class="msPayment">
    <!-- Main Payment Options -->
    <div
      v-if="!showBankakPayment && !showStripePayment"
      class="payment-options"
    >
      <div class="payment-header">
        <h1 class="main-title">{{ $t("إختر طريقة الدفع اللتي تناسبك") }}</h1>
        <p class="subtitle">اختر الطريقة الأنسب لك لإتمام عملية الشراء</p>
      </div>

      <div class="payment-methods-grid">
        <!-- Bangkok Payment Option -->
        <div
          class="payment-card bankak-card"
          @click="selectPaymentMethod('bankak')"
        >
          <div class="card-header">
            <div class="payment-icon bankak-icon">
              <img src="~assets/img/bankk.png" alt="بنكك" />
            </div>
            <div class="payment-badge">الأكثر استخداماً</div>
          </div>
          <div class="card-content">
            <h3 class="payment-title">
              {{ $t("الدفع عن طريق ارفاق فاتورة البنك") }}
            </h3>
            <p class="payment-description">
              ارفق صورة الإشعار البنكي وسيتم تفعيل الدورة خلال 24 ساعة
            </p>
            <ul class="payment-features">
              <li>آمن ومضمون 100%</li>
              <li>يقبل جميع البنوك السودانية</li>
              <li>تفعيل خلال 24 ساعة</li>
            </ul>
          </div>
          <div class="card-footer">
            <div class="select-button">
              <span>اختر هذه الطريقة</span>
              <i class="arrow-icon">←</i>
            </div>
          </div>
        </div>

        <!-- Stripe Payment Option -->
        <div
          class="payment-card stripe-card"
          @click="selectPaymentMethod('stripe')"
        >
          <div class="card-header">
            <div class="payment-icon stripe-icon">
              <img src="~assets/img/visa.png" alt="بطاقة ائتمانية" />
            </div>
            <div class="payment-badge instant">فوري</div>
          </div>
          <div class="card-content">
            <h3 class="payment-title">{{ $t("الدفع بالبطاقة الائتمانية") }}</h3>
            <p class="payment-description">
              ادفع بأمان باستخدام Visa أو Mastercard وتفعيل فوري
            </p>
            <ul class="payment-features">
              <li>تفعيل فوري للدورة</li>
              <li>مشفر وآمن بتقنية SSL</li>
              <li>يقبل جميع البطاقات العالمية</li>
            </ul>
          </div>
          <div class="card-footer">
            <div class="select-button">
              <span>اختر هذه الطريقة</span>
              <i class="arrow-icon">←</i>
            </div>
          </div>
        </div>
      </div>

      <!-- Total Price Display -->
      <div class="total-section">
        <div class="total-card">
          <div class="total-content">
            <div class="total-label">
              <h2>{{ $t("المجمــوع") }}</h2>
              <p>إجمالي المبلغ المطلوب</p>
            </div>
            <div class="total-amount">
              <h3>{{ FORMAT_COUSRE_PRICE(totalPaymentFees, 3) }}</h3>
              <span class="currency">{{ currency }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bangkok Payment Component -->
    <div v-if="showBankakPayment" class="payment-method-container">
      <div class="payment-header-nav">
        <q-btn
          flat
          round
          dense
          icon="arrow_back"
          @click="goBackToOptions"
          class="back-button"
          size="lg"
        />
        <div class="nav-title">
          <h3>{{ $t("الدفع عن طريق ارفاق فاتورة البنك") }}</h3>
          <p>ارفق صورة الإشعار البنكي</p>
        </div>
      </div>
      <div class="payment-content">
        <bankak-payment />
      </div>
    </div>

    <!-- Stripe Payment Component -->
    <div v-if="showStripePayment" class="payment-method-container">
      <div class="payment-header-nav">
        <q-btn
          flat
          round
          dense
          icon="arrow_back"
          @click="goBackToOptions"
          class="back-button"
          size="lg"
        />
        <div class="nav-title">
          <h3>{{ $t("الدفع بالبطاقة الائتمانية") }}</h3>
          <p>ادفع بأمان باستخدام بطاقتك الائتمانية</p>
        </div>
      </div>

      <!-- Stripe Payment Details -->
      <div class="stripe-payment-container">
        <div class="amount-display-card">
          <div class="amount-header">
            <div class="payment-icon-small">
              <img src="~assets/img/visa.png" alt="Stripe" />
            </div>
            <h2>{{ $t("المبلغ المطلوب دفعه") }}</h2>
          </div>
          <div class="amount-details">
            <div class="amount-value">
              <h3>${{ calculateDollarAmount() }}</h3>
              <p>{{ $t("دولار أمريكي") }}</p>
            </div>
            <div class="conversion-note">
              <p>سيتم التحويل تلقائياً حسب سعر الصرف الحالي</p>
            </div>
          </div>
        </div>

        <div class="payment-action-card">
          <div class="security-badges">
            <div class="security-badge">
              <i class="security-icon">🔒</i>
              <span>مشفر وآمن</span>
            </div>
            <div class="security-badge">
              <i class="security-icon">⚡</i>
              <span>تفعيل فوري</span>
            </div>
          </div>

          <q-btn
            color="primary"
            size="xl"
            @click="initiateStripePayment"
            :loading="stripeLoading"
            class="pay-button"
            no-caps
          >
            <q-icon name="payment" class="q-mr-sm" size="sm" />
            {{ $t("ادفع الآن") }}
          </q-btn>

          <p class="payment-note">
            بالضغط على "ادفع الآن" ستتم إعادة توجيهك إلى صفحة الدفع الآمنة
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { CreateNewOrderWithBulkOrderDetails } from "src/queries/order_management/mutation/CreateNewOrderWithBulkOrderDetails";
import { CreateStripeCheckout } from "src/queries/checkout_management/mutation/CreateStripeCheckout";
import { StripePublishableKey } from "src/queries/checkout_management/query/StripePublishableKey";
import { GetMyProfileData } from "src/queries/account_management/query/GetMyProfileData";
import bankakPayment from "src/components/ShoppingCard/bankakPay.vue";
import { CheckTheUserPermissionToUsePlatforme } from "src/queries/pyramid_marketing_management/query/CheckPyramidAffiliateQuery";
import _ from "lodash";

export default {
  name: "paymentCartpage",

  data() {
    return {
      showBankakPayment: false,
      showStripePayment: false,
      stripeLoading: false,
      errorMessages: [],
      lodash: _,
    };
  },

  components: {
    "bankak-payment": bankakPayment,
  },

  async created() {
    // Check if the user has a registration code
    this.CHECK_IF_THE_USER_HASE_THE_REGISTERATION_CODE();

    // Check if user completed profile data
    const res = await this.$apollo.query({
      query: GetMyProfileData,
    });

    if (res.data.me.pk) {
      if (
        res.data.me.fullName &&
        (res.data.me.phoneNumber2 || res.data.me.phoneNumber3)
      ) {
        // Profile is complete, continue
      } else {
        this.$q.notify({
          type: "negative",
          progress: true,
          multiLine: true,
          position: "top",
          message: "يجب ان تكمل بياناتك الشخصيه",
        });
        this.$router.push({ name: "user-info" });
      }
    }
  },

  async mounted() {
    // Check if shopping cart is empty
    this.WHEN_THE_BASKET_CONTAIN_COURSE_WITH_ZERO_COST_DELETE_IT();
    if (this.shoppingCartDataList.length == 0) {
      this.$q.notify({
        type: "negative",
        progress: true,
        multiLine: true,
        position: "top",
        message: "لا يمكنك شراء لا شيء",
      });
      this.$router.push({ name: "Home" });
    }

    this.$root.$emit("activateShoppingProgress", "paymentData");

    const shoppingProcess = ["cartCourses", "loginCart", "paymentData"];
    shoppingProcess.map((process) => {
      const name = `[data-cart="${process}"]`;
      try {
        document.querySelector(name).classList.add("active");
        document.querySelector(name).nextSibling.classList.add("show");
      } catch (error) {
        document.querySelector(name).classList.add("active");
        document.querySelector(name).nextSibling.classList.add("show");
      }
    });
  },

  computed: {
    ...mapState("shoppingCart", ["shoppingCartDataList", "totalPaymentFees"]),
    ...mapState("settings", ["currency"]),
  },

  methods: {
    ...mapActions("shoppingCart", [
      "setShoppinCartDataListAction",
      "setSaveCheckoutOrderIDAction",
    ]),

    selectPaymentMethod(method) {
      if (method === "bankak") {
        this.showBankakPayment = true;
        this.showStripePayment = false;
      } else if (method === "stripe") {
        this.showStripePayment = true;
        this.showBankakPayment = false;
      }
    },

    goBackToOptions() {
      this.showBankakPayment = false;
      this.showStripePayment = false;
    },

    calculateDollarAmount() {
      let sum = 0.0;
      for (const item of this.shoppingCartDataList) {
        // Get the course fee in dollars (USD)
        sum += parseFloat(item.course.courseFee || 0);
      }
      return sum.toFixed(2);
    },

    async initiateStripePayment() {
      try {
        this.stripeLoading = true;

        // Check if Stripe is loaded
        if (!this.$Stripe || typeof this.$Stripe !== "function") {
          throw new Error("Stripe not loaded");
        }

        // Extract all courses ids
        const courseIds = this.getOrdersIds();

        // Make the order
        const orderResult = await this.getOrderResult(courseIds);

        // Save the order result to the store for the success checkout
        this.setSaveCheckoutOrderIDAction(orderResult.order.pk);

        // Get the stripe key from the backend
        const stripeKey = await this.getStripeKeyFromTheBackend();

        // Initialize the stripe object with stripe key to make the payment
        const stripe = this.$Stripe(stripeKey);

        // Get the stripe url from the backend
        const stripePaymentUrl = await this.getStripPaymentUrlFromTheBackend(
          orderResult
        );

        // Make the payment
        stripe.redirectToCheckout({
          sessionId: stripePaymentUrl,
        });

        this.stripeLoading = false;
      } catch (error) {
        this.stripeLoading = false;
        console.error("Stripe payment error:", error);

        if (
          error.message === "Stripe not loaded" ||
          error.message === "this.$Stripe is not a function"
        ) {
          this.$q.notify({
            type: "warning",
            progress: true,
            multiLine: true,
            position: "top",
            message:
              "Stripe غير محمل، يرجى إعادة تحميل الصفحة والمحاولة مرة أخرى",
          });
        } else {
          this.$q.notify({
            type: "warning",
            progress: true,
            multiLine: true,
            position: "top",
            message: "حدث خطأ في عملية الدفع، يرجى المحاولة مرة أخرى",
          });
        }
      }
    },

    getOrdersIds() {
      return this.$_.map(this.shoppingCartDataList, "[course][pk]");
    },

    async getOrderResult(courseIds) {
      const result = await this.$apollo.mutate({
        mutation: CreateNewOrderWithBulkOrderDetails,
        variables: {
          courseIds: courseIds,
        },
      });
      const dataObj = result.data.createNewOrderWithBulkOrderDetails;

      if (this.$_.get(dataObj, "[errors]")) {
        this.stripeLoading = false;
        this.errorHandler(dataObj.errors);
      }

      if (this.$_.get(dataObj, "[success]")) {
        return dataObj;
      }
    },

    async getStripeKeyFromTheBackend() {
      const stripeKeyResult = await this.$apollo.query({
        query: StripePublishableKey,
      });

      return JSON.parse(
        this.$_.get(stripeKeyResult, "[data][stripePublishableKey]")
      ).publisableKey;
    },

    async getStripPaymentUrlFromTheBackend(orderResult) {
      const stripPaymentResult = await this.$apollo.mutate({
        mutation: CreateStripeCheckout,
        variables: {
          orderId: orderResult.order.pk,
          currency: "USD", // Force USD for Stripe payments
          successUrl: location.origin + "/#/cart/success",
          cancelUrl: location.origin + "/#/cart/cancel",
        },
      });

      const stripDetails = stripPaymentResult.data.createStripeCheckout;
      if (this.$_.get(stripDetails, "[errors]")) {
        this.stripeLoading = false;
        this.$q.notify({
          type: "warning",
          progress: true,
          multiLine: true,
          position: "top",
          message: "انت غير متصل بالانترنت, قم بالاتصال و اعد تحميل الصفحه",
        });
      }

      if (this.$_.get(stripDetails, "[success]")) {
        return stripDetails.paymentUrl;
      }
    },

    errorHandler(errorsObj) {
      for (const key in errorsObj) {
        for (const val of errorsObj[key]) {
          console.log(val);
          this.$q.notify({
            type: "warning",
            progress: true,
            multiLine: true,
            position: "top",
            message: val.message,
          });
        }
      }
    },

    async CHECK_IF_THE_USER_HASE_THE_REGISTERATION_CODE() {
      try {
        const join_permission_res = await this.$apollo.query({
          query: CheckTheUserPermissionToUsePlatforme,
        });
        const errors = this.$_.get(join_permission_res, "[errors]");

        if (errors) {
          for (let error of errors) {
            if (
              error.message.includes(
                "PyramidAffiliate matching query does not exist."
              )
            ) {
              this.$router.push({ name: "registeration-code" });
            }
          }
        }
      } catch (e) {
        if (
          e.message ==
          "GraphQL error: PyramidAffiliate matching query does not exist."
        ) {
          this.$router.push({ name: "registeration-code" });
        }
      }
    },

    WHEN_THE_BASKET_CONTAIN_COURSE_WITH_ZERO_COST_DELETE_IT() {
      const re = this.shoppingCartDataList.map((item) => {
        if (
          parseInt(item.course.courseFee) == 0 ||
          parseInt(item.course.courseFeeInSdg) == 0
        ) {
          this.removeCourseFromCart(item);
          this.$q.notify({
            type: "warning",
            progress: true,
            multiLine: true,
            position: "top",
            message: "هذا الكورس تحت التحضير",
          });
        }
      });
    },

    removeCourseFromCart(item) {
      const data = this.shoppingCartDataList;
      this.lodash.remove(data, (element) => {
        return element.course.id === item.course.id;
      });
      this.setShoppinCartDataListAction(data);
    },

    FORMAT_COUSRE_PRICE(num, digits) {
      const lookup = [
        { value: 1, symbol: "" },
        { value: 1e3, symbol: "k" },
        { value: 1e6, symbol: "M" },
        { value: 1e9, symbol: "G" },
        { value: 1e12, symbol: "T" },
        { value: 1e15, symbol: "P" },
        { value: 1e18, symbol: "E" },
      ];

      if (num.toString().split(".")[0] == 0 || num == 0) {
        return num;
      }
      const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
      var item = lookup
        .slice()
        .reverse()
        .find(function (item) {
          return num >= item.value;
        });

      return item
        ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol
        : "0";
    },
  },
};
</script>

<style lang="scss" scoped>
.msPayment {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  min-height: 500px;
}

// Payment Options Main View
.payment-options {
  .payment-header {
    text-align: center;
    margin-bottom: 40px;

    .main-title {
      font-size: 28px;
      font-weight: 700;
      color: #1a1a1a;
      margin: 0 0 12px 0;
      line-height: 1.3;
    }

    .subtitle {
      font-size: 16px;
      color: #666;
      margin: 0;
      font-weight: 400;
    }
  }

  .payment-methods-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 24px;
    margin-bottom: 40px;

    .payment-card {
      background: white;
      border-radius: 16px;
      padding: 24px;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      border: 2px solid #f0f0f0;
      position: relative;
      overflow: hidden;

      &::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
        transform: scaleX(0);
        transition: transform 0.3s ease;
      }

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);
        border-color: #667eea;

        &::before {
          transform: scaleX(1);
        }

        .select-button {
          background: #667eea;
          color: white;
        }
      }

      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 20px;

        .payment-icon {
          width: 60px;
          height: 60px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f8f9ff;

          img {
            width: 40px;
            height: 30px;
            object-fit: contain;
          }
        }

        .payment-badge {
          background: #e3f2fd;
          color: #1976d2;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;

          &.instant {
            background: #e8f5e8;
            color: #2e7d32;
          }
        }
      }

      .card-content {
        margin-bottom: 24px;

        .payment-title {
          font-size: 18px;
          font-weight: 600;
          color: #1a1a1a;
          margin: 0 0 12px 0;
          line-height: 1.4;
        }

        .payment-description {
          font-size: 14px;
          color: #666;
          margin: 0 0 16px 0;
          line-height: 1.5;
        }

        .payment-features {
          list-style: none;
          padding: 0;
          margin: 0;

          li {
            font-size: 13px;
            color: #555;
            margin-bottom: 8px;
            padding-left: 20px;
            position: relative;

            &::before {
              content: "✓";
              position: absolute;
              left: 0;
              color: #4caf50;
              font-weight: bold;
            }
          }
        }
      }

      .card-footer {
        .select-button {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: 14px 20px;
          background: #f5f5f5;
          border: none;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          color: #333;
          transition: all 0.3s ease;

          .arrow-icon {
            font-size: 16px;
            transition: transform 0.3s ease;
          }
        }
      }

      // Specific card styling
      &.bankak-card {
        .payment-icon {
          background: #fff5f5;
        }
      }

      &.stripe-card {
        .payment-icon {
          background: #f0f7ff;
        }
      }
    }
  }

  .total-section {
    .total-card {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 16px;
      padding: 28px;
      color: white;
      text-align: center;

      .total-content {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .total-label {
          text-align: left;

          h2 {
            font-size: 20px;
            font-weight: 600;
            margin: 0 0 8px 0;
          }

          p {
            font-size: 14px;
            margin: 0;
            opacity: 0.9;
          }
        }

        .total-amount {
          text-align: right;
          display: flex;
          align-items: baseline;
          gap: 8px;

          h3 {
            font-size: 32px;
            font-weight: 700;
            margin: 0;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          }

          .currency {
            font-size: 16px;
            font-weight: 500;
            opacity: 0.9;
          }
        }
      }
    }
  }
}

// Payment Method Container (Back Navigation)
.payment-method-container {
  .payment-header-nav {
    display: flex;
    align-items: center;
    margin-bottom: 32px;
    padding: 20px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    .back-button {
      color: #667eea;
      margin-right: 16px;
      background: #f8f9ff;

      &:hover {
        background: #667eea;
        color: white;
      }
    }

    .nav-title {
      h3 {
        font-size: 20px;
        font-weight: 600;
        color: #1a1a1a;
        margin: 0 0 4px 0;
      }

      p {
        font-size: 14px;
        color: #666;
        margin: 0;
      }
    }
  }

  .payment-content {
    background: white;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
}

// Stripe Payment Specific Styling
.stripe-payment-container {
  .amount-display-card {
    background: white;
    border-radius: 16px;
    padding: 28px;
    margin-bottom: 24px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    border: 1px solid #e0e0e0;

    .amount-header {
      display: flex;
      align-items: center;
      margin-bottom: 20px;

      .payment-icon-small {
        width: 40px;
        height: 40px;
        border-radius: 8px;
        background: #f0f7ff;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 12px;

        img {
          width: 24px;
          height: 18px;
          object-fit: contain;
        }
      }

      h2 {
        font-size: 18px;
        font-weight: 600;
        color: #1a1a1a;
        margin: 0;
      }
    }

    .amount-details {
      .amount-value {
        text-align: center;
        margin-bottom: 16px;

        h3 {
          font-size: 48px;
          font-weight: 700;
          color: #667eea;
          margin: 0 0 8px 0;
          text-shadow: 0 2px 4px rgba(102, 126, 234, 0.2);
        }

        p {
          font-size: 16px;
          color: #666;
          margin: 0;
          font-weight: 500;
        }
      }

      .conversion-note {
        text-align: center;
        background: #f8f9ff;
        padding: 12px;
        border-radius: 8px;

        p {
          font-size: 13px;
          color: #666;
          margin: 0;
        }
      }
    }
  }

  .payment-action-card {
    background: white;
    border-radius: 16px;
    padding: 28px;
    text-align: center;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    border: 1px solid #e0e0e0;

    .security-badges {
      display: flex;
      justify-content: center;
      gap: 16px;
      margin-bottom: 24px;

      .security-badge {
        display: flex;
        align-items: center;
        gap: 8px;
        background: #f8f9ff;
        padding: 8px 16px;
        border-radius: 20px;
        font-size: 13px;
        color: #555;
        font-weight: 500;

        .security-icon {
          font-size: 16px;
        }
      }
    }

    .pay-button {
      min-width: 280px;
      height: 56px;
      font-size: 16px;
      font-weight: 600;
      border-radius: 12px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      margin-bottom: 16px;
      text-transform: none;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
      }
    }

    .payment-note {
      font-size: 12px;
      color: #888;
      margin: 0;
      line-height: 1.4;
    }
  }
}

// Mobile Responsive Design
@media (max-width: 768px) {
  .msPayment {
    padding: 8px;
  }

  .payment-options {
    .payment-header {
      margin-bottom: 12px;

      .main-title {
        font-size: 22px;
        margin-bottom: 4px;
      }

      .subtitle {
        font-size: 14px;
      }
    }

    .payment-methods-grid {
      grid-template-columns: 1fr;
      gap: 12px;
      margin-bottom: 16px;

      .payment-card {
        padding: 12px;

        .card-header {
          .payment-icon {
            width: 50px;
            height: 50px;

            img {
              width: 32px;
              height: 24px;
            }
          }
        }

        .card-content {
          .payment-title {
            font-size: 16px;
          }

          .payment-description {
            font-size: 13px;
          }
        }
      }
    }

    .total-section .total-card {
      padding: 12px;

      .total-content {
        flex-direction: column;
        text-align: center;
        gap: 8px;

        .total-label {
          text-align: center;
        }

        .total-amount {
          justify-content: center;

          h3 {
            font-size: 28px;
          }
        }
      }
    }
  }

  .payment-method-container {
    .payment-header-nav {
      padding: 12px;
      margin-bottom: 12px;

      .nav-title h3 {
        font-size: 16px;
      }
    }

    .payment-content {
      padding: 12px;
    }
  }

  .stripe-payment-container {
    .amount-display-card {
      padding: 12px;

      .amount-header {
        .payment-icon-small {
          width: 32px;
          height: 32px;
          margin-right: 8px;

          img {
            width: 20px;
            height: 15px;
          }
        }

        h2 {
          font-size: 16px;
        }
      }

      .amount-details .amount-value h3 {
        font-size: 36px;
      }
    }

    .payment-action-card {
      padding: 12px;

      .security-badges {
        flex-direction: column;
        gap: 8px;

        .security-badge {
          padding: 6px 12px;
          font-size: 12px;
        }
      }

      .pay-button {
        width: 100%;
        min-width: auto;
        height: 48px;
        font-size: 15px;
      }

      .payment-note {
        font-size: 11px;
      }
    }
  }
}

@media (max-width: 480px) {
  .payment-options {
    .payment-header {
      .main-title {
        font-size: 20px;
      }

      .subtitle {
        font-size: 13px;
      }
    }

    .payment-methods-grid .payment-card {
      padding: 8px;

      .card-header {
        flex-direction: column;
        align-items: center;
        text-align: center;
        gap: 12px;

        .payment-badge {
          align-self: center;
          font-size: 11px;
          padding: 4px 8px;
        }
      }

      .card-content {
        .payment-title {
          font-size: 15px;
        }

        .payment-description {
          font-size: 12px;
        }

        .payment-features li {
          font-size: 12px;
        }
      }
    }
  }

  .stripe-payment-container {
    .amount-display-card {
      padding: 8px;

      .amount-header {
        margin-bottom: 8px;

        .payment-icon-small {
          width: 28px;
          height: 28px;

          img {
            width: 18px;
            height: 14px;
          }
        }

        h2 {
          font-size: 14px;
        }
      }

      .amount-details .amount-value h3 {
        font-size: 28px;
      }
    }

    .payment-action-card {
      padding: 8px;

      .pay-button {
        height: 44px;
        font-size: 14px;
      }
    }
  }

  .payment-method-container {
    .payment-header-nav {
      padding: 8px;

      .nav-title {
        h3 {
          font-size: 14px;
        }

        p {
          font-size: 12px;
        }
      }
    }
  }
}
</style>
