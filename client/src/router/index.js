import Vue from 'vue'
import VueRouter from 'vue-router'

import routes from './routes'

Vue.use(VueRouter)

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default function (/* { store, ssrContext } */) {
  const Router = new VueRouter({
    scrollBehavior: () => ({ x: 0, y: 0 }),
    routes,

    // Leave these as they are and change in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE
  })
  Router.beforeEach((to, from, next) => {
    const publicPages = ['login', 'pagina-principal', 'splash', 'registro', 'recuperar_clave', 'index', 'foroQuestion', 'foro', 'publicidad', 'courses_client']
    const authPublic = publicPages.includes(to.name)
    const userLog = localStorage.getItem('SESSION_INFO')
    // Si la ruta amerita autenticacion y no estas logueado
    if (authPublic) {
      // ir al login
      next()
      // si no amerita autenticacion //y estas logueado
    } else {
      // ir a la ruta inical del admin
      if (userLog) {
        next()
      } else {
        next('/')
      }
    }
  })
  return Router
}
