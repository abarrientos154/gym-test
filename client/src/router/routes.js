import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/index',
    name: 'index',
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
      { path: '/forum', component: () => import('pages/admin/Forum.vue') },
      { path: '/faults', component: () => import('pages/admin/Faults.vue') },
      { path: '/audio', component: () => import('pages/admin/Audio.vue') },
      { path: '/users', component: () => import('pages/admin/Users.vue') },
      { path: '/incomes', component: () => import('pages/admin/Incomes.vue') },
      { path: '/subscripciones', component: () => import('pages/admin/License.vue') },
      { path: '/configTest', component: () => import('pages/admin/ConfigTest.vue') },
      /* onent: () => import('pages/admin/Examenes.vue') },
      { path: '/tests_exam/:id', component: () => import('pages/admin/TestsExam.vue') },
      { path: '/exam/:id', component: () => import('pages/admin/Exam.vue') },
      { path: '/date_exams', component: () => import('pages/admin/DateExams.vue') }, */
      // User
      { path: '/inicio', component: () => import('pages/user/Inicio.vue') },
      { path: '/perfil', component: () => import('pages/user/Perfil.vue') },
      { path: '/ver/:title', component: () => import('pages/user/Temas.vue') },
      { path: '/news_user', component: () => import('pages/user/News.vue') },
      { path: '/publicidad/:id', name: 'publicidad', component: () => import('pages/user/PublicidadBlog.vue') },
      { path: '/forum/:id', name: 'foro', component: () => import('pages/user/Forum.vue') },
      { path: '/question/:id', name: 'foroQuestion', component: () => import('pages/user/Question.vue') },
      { path: '/forums', component: () => import('pages/user/Forums.vue') },
      { path: '/tema/:idTema', component: () => import('pages/user/TestData.vue') },
      { path: '/examen/:idExamen', component: () => import('pages/user/TestData.vue') },
      { path: '/test/:general', component: () => import('pages/user/TestData.vue') },
      { path: '/test_por/:tema', component: () => import('pages/user/TestData.vue') },
      { path: '/gym/:idType', component: () => import('pages/user/TestData.vue') },
      { path: '/tema/test/:idTema', component: () => import('pages/user/TestStar.vue') },
      { path: '/por_tema/test/:idByTema', component: () => import('pages/user/TestStar.vue') },
      { path: '/examen/test/:idExamen', component: () => import('pages/user/TestStar.vue') },
      { path: '/gym/test/:idType', component: () => import('pages/user/TestStar.vue') },
      { path: '/general/:test', component: () => import('pages/user/TestStar.vue') },
      { path: '/audios_por_tema/:id', component: () => import('pages/user/AudiosByTopic.vue') },
      { path: '/audios', component: () => import('pages/user/Audios.vue') }
    ]
  },

  { path: '/license/:lic', component: () => import('pages/user/License.vue') },
  { path: '/license/:est/:lic/:dias', component: () => import('pages/user/License.vue') },
  { path: '/courses', component: () => import('pages/Courses.vue') },
  { path: '/courses_client', name: 'courses_client', component: () => import('pages/CoursesClient.vue') },

  { path: '/splash', name: 'splash', component: () => import('pages/Splash.vue') },
  { path: '/pagina-principal', name: 'pagina-principal', component: () => import('pages/Home.vue') },
  { path: '/login', name: 'login', component: () => import('pages/Login.vue') },
  { path: '/registro', name: 'registro', component: () => import('pages/Registro.vue') },
  { path: '/check', name: 'check', component: () => import('pages/Check.vue') },
  { path: '/recuperar_clave/:code', name: 'recuperar_clave', component: () => import('pages/NewPassword.vue') },
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
