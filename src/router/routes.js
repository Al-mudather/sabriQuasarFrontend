import { Notify } from 'quasar'

// Route guard: redirect unauthenticated visitors to /account/login while
// preserving the intended destination as a ?redirect= query param so
// login can restore them afterwards.
const requireAuthentication = (to, from, next) => {
  if (sessionStorage.getItem('userAccessToken')) {
    next()
  } else {
    Notify.create({
      color: 'negative',
      message: 'Ooops! You need to login first to access the page',
      icon: 'report_problem'
    })
    next({ name: 'login', query: { redirect: to.path } })
  }
}

// Every route is lazy-loaded so the initial SPA bundle stays small;
// Webpack spins up a chunk per import() call.
const routes = [
  {
    path: '/',
    component: () => import('layouts/HomeLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('src/pages/homeIndex.vue'),
        children: [
          { path: '', name: 'Home', component: () => import('src/pages/Home.vue') }
        ]
      }
    ]
  },
  {
    // The course detail + catalog routes sit under MainLayout with no
    // path prefix, shared with Home by Vue Router's multi-match on path '/'.
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('src/pages/course_management/courseIndex.vue'),
        children: [
          { path: 'course/:name/:pk/:id',       name: 'course-details',            component: () => import('pages/course_management/CourseDetails.vue') },
          { path: 'course/:name/:code/:pk/:id', name: 'course-affilliate-details', component: () => import('pages/course_management/CourseDetails.vue') },
          { path: 'courses',                    name: 'courses',                   component: () => import('pages/course_management/Courses.vue') }
        ]
      }
    ]
  },
  {
    path: '/termsandConditions',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'terms-and-conditions', component: () => import('src/pages/TermsandConditions.vue') }
    ]
  },
  {
    path: '/privacyPolicy',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'privacy-policy', component: () => import('src/pages/PrivacyPolicy.vue') }
    ]
  },
  {
    path: '/user',
    component: () => import('src/layouts/UserLayout.vue'),
    children: [
      { path: '/myOrders',        name: 'my-orders',         beforeEnter: requireAuthentication, component: () => import('pages/order_management/MyOrdersPage.vue') },
      { path: '/myMarketingPage', name: 'my-marketing-page', beforeEnter: requireAuthentication, component: () => import('pages/pyramid_marketing_management/MyMarketingPage.vue') },
      { path: '/notification',    name: 'notification',      beforeEnter: requireAuthentication, component: () => import('pages/notification_management/Notification.vue') },
      { path: '/profile',         name: 'user-profile',      beforeEnter: requireAuthentication, component: () => import('pages/account_management/Profile.vue') },
      { path: '/myCourses',       name: 'my-courses',        beforeEnter: requireAuthentication, component: () => import('pages/course_management/MyCourses.vue') },
      { path: '/Certificates',    name: 'my-certificate',    beforeEnter: requireAuthentication, component: () => import('src/pages/certificate_management/CertificatePage.vue') }
    ]
  },
  {
    path: '/verify/email/:token',
    name: 'verify-email',
    beforeEnter: requireAuthentication,
    component: () => import('pages/account_management/VerifyEmail.vue')
  },
  {
    path: '/reset/password/:token',
    name: 'reset-password-form',
    component: () => import('pages/account_management/PasswordResetForm.vue')
  },
  { path: '/account/confirm', name: 'account-confirm', component: () => import('components/Account/Confirm.vue') },
  {
    path: '/account',
    component: () => import('pages/account_management/Account.vue'),
    children: [
      { path: 'registerationCode', name: 'registeration-code', component: () => import('pages/account_management/RegisterationCode.vue') },
      { path: 'login',             name: 'login',              component: () => import('components/Account/Login.vue') },
      { path: 'signUp',            name: 'signUp',             component: () => import('components/Account/SignUp.vue') },
      { path: 'passwordReset',     name: 'password-reset',     component: () => import('components/Account/ResetPassword.vue') },
      { path: 'confirm',           name: 'password-confirm',   component: () => import('components/Account/Confirm.vue') }
    ]
  },
  {
    path: '/cart/',
    component: () => import('pages/ShoppingCart.vue'),
    children: [
      { path: '',          name: 'cart',         component: () => import('components/ShoppingCard/cartCourses.vue') },
      { path: 'loginCart', name: 'login-cart',   component: () => import('components/ShoppingCard/loginCart.vue') },
      { path: 'userInfo',  name: 'user-info',    component: () => import('components/ShoppingCard/userInformation.vue') },
      { path: 'payment',   name: 'payment',      beforeEnter: requireAuthentication, component: () => import('components/ShoppingCard/payment.vue') },
      { path: 'success',   name: 'cart-success', beforeEnter: requireAuthentication, component: () => import('components/ShoppingCard/successMessage.vue') }
    ]
  },

  // Dev-only design system showcase. Only compiled into the bundle in
  // development builds.
  ...(process.env.NODE_ENV === 'development'
    ? [{ path: '/design-system', name: 'design-system', component: () => import('src/pages/DesignSystem.vue') }]
    : []),

  // 404 fallback — must stay last.
  { path: '*', name: 'not-found', component: () => import('pages/Error404.vue') }
]

export default routes
