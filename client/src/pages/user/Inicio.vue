<template>
  <div class="column items-center">
      <q-img src="fondo.png" style="height: 180px; width: 100%;">
        <div class="bg-transparent" style="width:100%">
          <div class="q-pb-sm">
            <q-img src="gymtest 1.png" style="width: 150px"/>
          </div>
          <div class="row justify-between">
            <div>
              <div class="text-subtitle1 text-white">Bienvenido</div>
              <div class="text-white text-caption">Vamos a por todas en esta semana!</div>
            </div>
          </div>
        </div>
      </q-img>

      <div class="q-pa-md bg-white" style="position:absolute; top: 140px; padding-bottom: 100px; width:100%; border-top-left-radius: 20px; border-top-right-radius: 20px">
        <q-card class="bordes row">
          <div>
            <div class="bg-primary q-pa-sm" style="border-top-left-radius: 10px;border-bottom-left-radius: 10px;">
            <q-avatar size="100px" color="grey">
              <q-img :src="user._id && user.perfile ? baseuPerfil + user._id : 'avatar gris 1.png'" style="height:100%"/>
            </q-avatar>
          </div>
          </div>
          <div class="column justify-between q-pa-sm">
            <div>
              <div class="text-grey-8">Hola...</div>
              <div class="text-primary text-h6">{{user.name}}</div>
            </div>
            <div v-if="!freeCourse">
              <div class="text-caption text-primary text-bold">Días vigentes del curso</div>
              <div class="text-grey-8">{{licenseTime}} días</div>
            </div>
          </div>
        </q-card>

        <q-card clickable v-ripple class="bg-grey-5 q-py-lg q-px-md q-mt-md" style="border-radius: 10px" @click="$router.push('/estadisticas')">
          <div class="text-center text-h5 text-bold">Estadísticas</div>
        </q-card>

        <q-card clickable v-ripple class="bg-grey-5 q-py-lg q-px-md q-mt-md" style="border-radius: 10px" @click="$router.push('/news_user')">
          <div class="text-center text-h5 text-bold">Noticias</div>
        </q-card>

        <q-card clickable v-ripple class="bg-grey-5 q-py-lg q-px-md q-mt-md" style="border-radius: 10px" @click="$router.push('/ver/Temas')">
          <div class="text-center text-h5 text-bold">Tests</div>
        </q-card>

        <q-card clickable v-ripple class="bg-grey-5 q-py-lg q-px-md q-mt-md" style="border-radius: 10px" @click="$router.push('/ver/Gym')">
          <div class="text-center text-h5 text-bold">Gym</div>
        </q-card>

        <q-card clickable v-ripple class="bg-grey-5 q-py-lg q-px-md q-mt-md" style="border-radius: 10px" @click="$router.push('/test_por/tema')">
          <div class="text-center text-h5 text-bold">Test por tema</div>
        </q-card>

        <q-card clickable v-ripple class="bg-grey-5 q-py-lg q-px-md q-mt-md" style="border-radius: 10px" @click="$router.push('/test/general')">
          <div class="text-center text-h5 text-bold">Test general</div>
        </q-card>

        <q-card clickable v-ripple class="bg-grey-5 q-py-lg q-px-md q-mt-md" style="border-radius: 10px" @click="$router.push('/ver/Examenes')">
          <div class="text-center text-h5 text-bold">Exámenes</div>
        </q-card>

        <q-card clickable v-ripple class="bg-grey-5 q-py-lg q-px-md q-mt-md" style="border-radius: 10px" @click="$router.push('/audios')">
          <div class="text-center text-h5 text-bold">Audios</div>
        </q-card>

        <q-card clickable v-ripple class="bg-grey-5 q-py-lg q-px-md q-mt-md" style="border-radius: 10px" @click="$router.push('/forums')">
          <div class="text-center text-h5 text-bold">Foros</div>
        </q-card>
      </div>
  </div>
</template>

<script>
import env from '../../env'
export default {
  name: 'MainLayout',
  data () {
    return {
      baseuPerfil: '',
      courseId: '',
      freeCourse: false,
      licenseTime: 0,
      user: {},
      thumbStyle: {
        right: '5px',
        borderRadius: '8px',
        backgroundColor: '#027be3',
        width: '8px',
        opacity: 0
      }
    }
  },
  mounted () {
    this.courseId = localStorage.getItem('course_id')
    this.baseuPerfil = env.apiUrl + 'perfil_img/'
    this.getUser()
    this.getCourse()
  },
  methods: {
    getUser () {
      this.$api.get('user_info').then(v => {
        if (v) {
          this.user = v
        }
      })
    },
    getCourse () {
      this.$api.get('course_by_id/' + this.courseId).then(v => {
        if (v) {
          this.freeCourse = v.free
          if (!v.free) {
            this.getLicense()
          }
        }
      })
    },
    getLicense () {
      this.$api.get('get_License_course/' + this.courseId).then(res => {
        if (res) {
          this.licenseTime = res.days
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.bordes {
  border: 1px solid $primary;
  border-radius: 10px;
}
</style>
