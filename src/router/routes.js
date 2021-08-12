import { Notify, LocalStorage } from 'quasar'

const requireAuthentication = (to, from, next) => {
  // ...
  const authorized = LocalStorage.getItem('userAccessToken')

  if (authorized) {
    next()
  } else {
    // TODO: show error notification
    Notify.create({
      color: 'negative',
      message: 'Ooops! You need to login first to access the page',
      icon: 'report_problem'
    })
    next({
      name: 'login',
      query: { redirect: to.path }
    })
  }
}


const routes = [
  {
    path: '/',
    component: () => import('layouts/HomeLayout.vue'),
    children: [
      { path: 'home', name: 'Home', alias:'', component: () => import('pages/Home.vue') }
    ]
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: 'course/:pk/:id', name: 'course-details', component: () => import('pages/course_management/CourseDetails.vue') },
      { path: '/course/:link/:pk/:id', name: 'course-affilliate-details', component: () => import('pages/course_management/CourseDetails.vue') },
      { path: '/courses', name: 'courses', component: () => import('pages/course_management/Courses.vue') }
    ]
  },
  {
    path: '/user',
    component: () => import('src/layouts/UserLayout'),
    children: [
      { path: '/myOrders', name: 'my-orders', beforeEnter: requireAuthentication, component: () => import('pages/order_management/MyOrdersPage.vue') },
      { path: '/myCustomersPayment', name: 'my-customers-payment', beforeEnter: requireAuthentication, component: () => import('pages/pyramid_marketing_management/MyCustomersPaymentPage.vue') },
      { path: '/myMarketingPage', name: 'my-marketing-page', beforeEnter: requireAuthentication, component: () => import('pages/pyramid_marketing_management/MyMarketingPage.vue') },
      { path: '/notification', name: 'notification', beforeEnter: requireAuthentication, component: () => import('pages/notifivation_management/Notification.vue') },
      { path: '/profile', name: 'user-profile', beforeEnter: requireAuthentication, component: () => import('pages/account_management/Profile') },
      { path: '/myCourses', name: 'my-courses', beforeEnter: requireAuthentication, component: () => import('pages/course_management/MyCourses.vue') },
      { path: '/class/:pk/:id', name: 'course-class', beforeEnter: requireAuthentication, component: () => import('pages/course_management/CourseClass.vue') }
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
  { path: '/account/confirm', name: 'account-confirm', component: () => import('components/Account/Confirm') },
  {
    path: '/account',
    component: () => import('pages/account_management/Account'),
    children: [
      { path: 'registerationCode', name: 'registeration-code', alias:'', component: () => import('pages/account_management/RegisterationCode.vue') },
      { path: 'login', name: 'login', component: () => import('components/Account/Login') },
      { path: 'signUp', name: 'signUp', component: () => import('components/Account/SignUp') },
      { path: 'passwordReset', name: 'password-reset', component: () => import('components/Account/ResetPassword') },
      { path: 'confirm', name: 'password-confirm', component: () => import('components/Account/Confirm') }
    ]
  },
  {
    path: '/cart/',
    component: () => import('pages/ShoppingCart.vue'),
    children: [
      { path: '', name: 'cart', component: () => import('components/ShoppingCard/cartCourses') },
      { path: 'loginCart', name: 'login-cart', component: () => import('components/ShoppingCard/loginCart') },
      { path: 'payment', name: 'payment', beforeEnter: requireAuthentication, component: () => import('components/ShoppingCard/payment') },
      { path: 'success', name: 'cart-success', beforeEnter: requireAuthentication, component: () => import('components/ShoppingCard/successMessage') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
