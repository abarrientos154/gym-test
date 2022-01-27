
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
      { path: '/paragraphs', component: () => import('pages/admin/Paragraphs.vue') },
      { path: '/laws', component: () => import('pages/admin/Laws.vue') },
      { path: '/subTopics', component: () => import('pages/admin/SubTopics.vue') },
      { path: '/answers', component: () => import('pages/admin/Answers.vue') },
      { path: '/types', component: () => import('pages/admin/Types.vue') },
      { path: '/exams', component: () => import('pages/admin/Examenes.vue') },
      { path: '/news', component: () => import('pages/admin/News.vue') },
      { path: '/faults', component: () => import('pages/admin/Faults.vue') },
      { path: '/audio', component: () => import('pages/admin/Audio.vue') },
      { path: '/users', component: () => import('pages/admin/Users.vue') },
      { path: '/incomes', component: () => import('pages/admin/Incomes.vue') },
      /* onent: () => import('pages/admin/Examenes.vue') },
      { path: '/tests_exam/:id', component: () => import('pages/admin/TestsExam.vue') },
      { path: '/exam/:id', component: () => import('pages/admin/Exam.vue') },
      { path: '/date_exams', component: () => import('pages/admin/DateExams.vue') }, */
      // User
      { path: '/inicio', component: () => import('pages/user/Inicio.vue') },
      { path: '/perfil', component: () => import('pages/user/Perfil.vue') },
      { path: '/temas', component: () => import('pages/user/Temas.vue') },
      { path: '/news_user', component: () => import('pages/user/News.vue') },
      { path: '/publicidad/:id', component: () => import('pages/user/PublicidadBlog.vue') },
      { path: '/tema/:idTema', component: () => import('pages/user/Examen.vue') },
      { path: '/examen/:idExamen', component: () => import('pages/user/Examen.vue') },
      { path: '/gym/:idType', component: () => import('pages/user/Examen.vue') },
      { path: '/tema/test/:idTema', component: () => import('pages/user/TestStar.vue') },
      { path: '/examen/test/:idExamen', component: () => import('pages/user/TestStar.vue') },
      { path: '/license', component: () => import('pages/user/License.vue') },
      { path: '/license/:est/:lic', component: () => import('pages/user/License.vue') },
      { path: '/gym/test/:idType', component: () => import('pages/user/TestStar.vue') },
      { path: '/audios/:id', component: () => import('pages/user/Audios.vue') }
      /* { path: '/tienda', component: () => import('pages/user/Tienda.vue') },
      { path: '/carro_de_compra/:compra', component: () => import('pages/user/CarroCompra.vue') } */
    ]
  },

  { path: '/splash', component: () => import('pages/Splash.vue') },
  { path: '/pagina-principal', component: () => import('pages/Home.vue') },
  { path: '/courses', component: () => import('pages/Courses.vue') },
  { path: '/courses_client', component: () => import('pages/CoursesClient.vue') },
  { path: '/login', component: () => import('pages/Login.vue') },
  { path: '/registro', component: () => import('pages/Registro.vue') },
  { path: '/recuperar_clave/:code', component: () => import('pages/NewPassword.vue') },
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
