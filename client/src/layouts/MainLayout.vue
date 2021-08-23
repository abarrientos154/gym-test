<template>
  <div>
    <q-layout view="lHh Lpr lFf">
      <q-header v-if="rol === 1" style="background: linear-gradient(to right, #002938, #004e6d);">
        <q-toolbar>
          <div class="row no-wrap q-px-lg">
            <q-btn flat dense rounded color="white" class="q-px-md" v-for="(item, index) in 5" :key="index">{{menu[index].label}}</q-btn>
            <q-input dense borderless v-model="buscar" style="background: #838383cc; border-radius: 20px; height: 35px;">
              <template v-slot:prepend>
                <q-icon color="grey" name="search"/>
              </template>
            </q-input>
          </div>
        </q-toolbar>
      </q-header>

      <q-drawer v-if="rol === 1" v-model="DrawerOpen" style="width: 175px;">
        <div class="row items-center justify-center" style="background: linear-gradient(to right, #002938, #004e6d); height: 200px; width: 100%;">
          <div>
            <div class="column items-center q-pt-lg q-pb-xs">
              <q-img src="gymtest 1.png" style="width: 200px"/>
            </div>
            <div class="text-center text-bold text-h5 text-white">Admin</div>
          </div>
        </div>
        <q-list class="row q-pa-sm">
          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 q-pa-sm" v-for="(item, index) in menu" :key="index">
            <q-btn flat stack dense :color="selecBtn === item.label ? 'white' : 'primary'" class="q-pa-md text-no-wrap" @click="item.label === 'Salir' ? cerrarSesion() : rutas(item)" :style="`${selecBtn === item.label ? 'background: linear-gradient(to right, #002938, #004e6d);' : ''} width: 100%;`" no-caps>
              <q-img :src="selecBtn === item.label ? item.src2 : item.src" style="width: 70px; height: 70px;"/>
              {{item.label}}
            </q-btn>
          </div>
        </q-list>
      </q-drawer>

      <q-footer elevated v-if="rol === 2" style="border-top-left-radius: 10px; border-top-right-radius: 10px">
        <div class="bg-primary full-width row justify-around q-py-sm" style="border-top-left-radius: 10px; border-top-right-radius: 10px">
          <div class="row items-center" v-for="(item, index) in menu" :key="index">
            <q-btn :icon="item.icon" color="white" flat stack dense no-caps size="lg" @click="item.label === 'Salir' ? cerrarSesion() : $router.push(item.ruta)">
            </q-btn>
          </div>
        </div>
      </q-footer>

      <q-page-container>
        <router-view />
      </q-page-container>
    </q-layout>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  name: 'MainLayout',
  data () {
    return {
      rol: null,
      user: {},
      buscar: '',
      selecBtn: '',
      DrawerOpen: true,
      menu: [],
      menuAdmin: [
        {
          src: 'home 3.png',
          src2: 'home 2.png',
          label: 'Home',
          ruta: '/administrador'
        },
        {
          src: 'temas 1.png',
          src2: '',
          label: 'Temas',
          ruta: '/topics'
        },
        {
          src: 'pregunta 1.png',
          src2: 'pregunta 12.png',
          label: 'Preguntas',
          ruta: '/questions'
        },
        {
          src: 'examen 12.png',
          src2: 'examen 1.png',
          label: 'Examenes',
          ruta: '/exams'
        },
        {
          src: '',
          src2: '',
          label: 'Articulos',
          ruta: '/articles'
        },
        {
          src: '',
          src2: '',
          label: 'Leyes',
          ruta: '/laws'
        },
        {
          src: '',
          src2: '',
          label: 'Respuestas',
          ruta: '/answers'
        },
        {
          src: '',
          src2: '',
          label: 'Sub Temas',
          ruta: '/subTopics'
        },
        {
          src: '',
          src2: '',
          label: 'Tipos',
          ruta: '/types'
        },
        {
          src: 'blog 1.png',
          src2: 'blog 12.png',
          label: 'Blog',
          ruta: '/blog'
        },
        {
          src: 'salir 2.png',
          src2: '',
          label: 'Salir',
          ruta: ''
        }
      ],
      menuUser: [
        {
          icon: 'home',
          label: 'Inicio',
          ruta: '/inicio'
        },
        {
          icon: 'view_list',
          label: 'Temas',
          ruta: '/temas'
        },
        {
          icon: 'apps',
          label: 'Blog',
          ruta: 'blog_user'
        },
        {
          icon: 'person',
          label: 'Perfil',
          ruta: '/perfil'
        },
        {
          icon: 'logout',
          label: 'Salir',
          ruta: ''
        }
      ]
    }
  },
  mounted () {
    this.getUser()
  },
  methods: {
    ...mapMutations('generals', ['logout']),
    getUser () {
      this.$api.get('user_info').then(v => {
        if (v) {
          this.rol = v.roles[0]
          this.user = v
          if (this.rol === 1) {
            this.menu = this.menuAdmin
          } else if (this.rol === 2) {
            this.menu = this.menuUser
          }
        }
      })
    },
    cerrarSesion () {
      this.logout()
      this.$router.push('/login')
    },
    rutas (itm) {
      this.selecBtn = itm.label
      this.$router.push(itm.ruta)
    }
  }
}
</script>
