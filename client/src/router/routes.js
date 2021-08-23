
const routes = [
  {
    path: '/index',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      // Admin
      { path: '/administrador', component: () => import('pages/admin/Inicio.vue') },
      { path: '/topics', component: () => import('pages/admin/Topics.vue') },
      { path: '/questions', component: () => import('pages/admin/Question.vue') },
      { path: '/articles', component: () => import('pages/admin/Articles.vue') },
      { path: '/laws', component: () => import('pages/admin/Laws.vue') },
      { path: '/subTopics', component: () => import('pages/admin/SubTopics.vue') },
      { path: '/answers', component: () => import('pages/admin/Answers.vue') },
      { path: '/types', component: () => import('pages/admin/Types.vue') },
      { path: '/exams', component: () => import('pages/admin/Examenes.vue') },
      { path: '/blog', component: () => import('pages/admin/Blog.vue') },
      /* onent: () => import('pages/admin/Examenes.vue') },
      { path: '/tests_exam/:id', component: () => import('pages/admin/TestsExam.vue') },
      { path: '/exam/:id', component: () => import('pages/admin/Exam.vue') },
      { path: '/date_exams', component: () => import('pages/admin/DateExams.vue') }, */
      // User
      { path: '/inicio', component: () => import('pages/user/Inicio.vue') },
      { path: '/perfil', component: () => import('pages/user/Perfil.vue') },
      { path: '/blog_user', component: () => import('pages/user/Blog.vue') },
      { path: '/blog/:id', component: () => import('pages/user/PublicidadBlog.vue') },
      { path: '/examen/:id', component: () => import('pages/user/Examen.vue') },
      { path: '/temas', component: () => import('pages/user/Temas.vue') },
      { path: '/tema/:id', component: () => import('pages/user/TestStar.vue') }
      /* { path: '/tienda', component: () => import('pages/user/Tienda.vue') },
      { path: '/carro_de_compra/:compra', component: () => import('pages/user/CarroCompra.vue') } */
    ]
  },

  { path: '/splash', component: () => import('pages/Splash.vue') },
  { path: '/login', component: () => import('pages/Login.vue') },
  { path: '/registro', component: () => import('pages/Registro.vue') },
  { path: '/recuperar_clave', component: () => import('pages/NewPassword.vue') },
  {
    path: '/',
    redirect: '/splash'
  },
  {
    path: '*',
    redirect: '/splash'
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
