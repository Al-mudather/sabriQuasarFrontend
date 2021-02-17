
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
      { path: 'course/:pk&:id', name: 'course-details', component: () => import('pages/CourseDetails.vue') },
      { path: 'courses', name: 'courses', component: () => import('pages/Courses.vue') }
    ]
  },
  {
    path: '/class/:pk&:id',
    name: 'course-class',
    component: () => import('pages/CourseClass.vue')
  },
  {
    path: '/verify/email/:token',
    name: 'verify-email',
    component: () => import('pages/VerifyEmail.vue')
  },
  {
    path: '/reset/password/:token',
    name: 'reset-password-form',
    component: () => import('pages/PasswordResetForm.vue')
  },
  { path: '/account/confirm', name: 'password-confirm', component: () => import('components/Account/Confirm') },
  // {
  //   path: '/account/',
  //   component: () => import('pages/Account.vue'),
  //   children: [
  //     { path: 'login', name: 'login', component: () => import('components/Account/Login') },
  //     // { path: 'signUp', name: 'signUp', component: () => import('components/Account/SignUp') },
  //     { path: 'passwordReset', name: 'password-reset', component: () => import('components/Account/ResetPassword') },
  //     { path: 'confirm', name: 'password-confirm', component: () => import('components/Account/Confirm') }
  //   ]
  // },
  {
    path: '/cart/',
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
