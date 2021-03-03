
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
      { path: 'course/:link/:pk/:id', name: 'course-affilliate-details', component: () => import('pages/course_management/CourseDetails.vue') },
      { path: 'courses', name: 'courses', component: () => import('pages/course_management/Courses.vue') }
    ]
  },
  {
    path: '/class/:pk/:id',
    name: 'course-class',
    component: () => import('pages/course_management/CourseClass.vue')
    // children: [
    //   {
    //     path: 'questions',
    //     name: 'class-questions',
    //     props: {
    //       header: true,
    //       content: true
    //    },
    //     component: () => import('pages/course_management/classQuestions.vue')
    //   },
    //   {
    //     path: 'answers',
    //     name: 'class-answers',
    //     props: {
    //       header: true,
    //       content: true
    //    },
    //     component: () => import('pages/course_management/classAnswers.vue')
    //   }
    // ]
  },
  {
    path: '/myCourses/',
    name: 'my-courses',
    component: () => import('pages/course_management/MyCourses.vue')
  },
  {
    path: '/verify/email/:token',
    name: 'verify-email',
    component: () => import('pages/account_management/VerifyEmail.vue')
  },
  {
    path: '/reset/password/:token',
    name: 'reset-password-form',
    component: () => import('pages/account_management/PasswordResetForm.vue')
  },
  { path: '/notification', name: 'notification', component: () => import('pages/notifivation_management/Notification.vue') },
  { path: '/account/confirm', name: 'account-confirm', component: () => import('components/Account/Confirm') },
  { path: '/user/profile', name: 'user-profile', component: () => import('pages/account_management/Profile') },
  {
    path: '/account/',
    component: () => import('pages/account_management/Account'),
    children: [
      { path: 'login', name: 'login', component: () => import('components/Account/Login') },
      { path: 'signUp', name: 'signUp', component: () => import('components/Account/SignUp') },
      { path: 'passwordReset', name: 'password-reset', component: () => import('components/Account/ResetPassword') },
      { path: 'confirm', name: 'password-confirm', component: () => import('components/Account/Confirm') }
    ]
  },
  {
    path: '/cart',
    component: () => import('pages/ShoppingCart.vue'),
    children: [
      { path: '', name: 'cart', component: () => import('components/ShoppingCard/cartCourses') },
      { path: 'loginCart', name: 'login-cart', component: () => import('components/ShoppingCard/loginCart') },
      { path: 'payment', name: 'payment', component: () => import('components/ShoppingCard/payment') },
      { path: 'success', name: 'cart-success', component: () => import('components/ShoppingCard/successMessage') }
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
