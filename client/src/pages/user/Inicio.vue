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
            <div>
              <div class="text-caption text-primary text-bold">Días vigentes del curso</div>
              <div class="text-grey-8">{{licenseTime}} días</div>
            </div>
          </div>
        </q-card>

        <q-scroll-area horizontal class="q-mt-md" :thumb-style="thumbStyle" style="height: 150px; width: 100%;">
          <div class="row items-center no-wrap q-gutter-md q-pr-sm q-py-sm" style="height:100%">
              <q-card class="bordes q-pa-none" style="width: 320px; height:100%">
                <div class="row items-center justify-between q-py-xs q-px-xs" style="height:20%">
                  <div class="text-primary">Mis Exámenes</div>
                  <div class="text-grey-9 text-caption text-italic">Historial de resultados</div>
                </div>
                <div class="bg-primary q-py-sm q-px-xs q-ma-none" style="height:80%">
                  <div v-if="rutinaExamen.length">
                    <div class="row justify-between text-white text-caption q-pb-xs" v-for="(item, index) in rutinaExamen" :key="index">
                      <div class="col-5 text-center ellipsis">{{item.examen_name}}</div>
                      <div class="col-3 text-center">{{item.fecha}}</div>
                      <div class="col-4 text-center">{{item.all_quest}} / {{item.correctas}}</div>
                    </div>
                  </div>
                  <div v-else class="text-white text-caption text-center">Aún no tienes resultados</div>
                </div>
              </q-card>

              <q-card class="bordes q-pa-none" style="width: 320px;height:100%">
                <div class="row items-center justify-between q-py-xs q-px-xs" style="height:20%">
                    <div class="text-primary">Rutinas de Entrenamiento</div>
                    <div class="text-grey-9 text-caption text-italic">Historial de resultados</div>
                </div>
                <div class="bg-primary q-py-sm q-px-xs q-ma-none" style="height:80%">
                  <div v-if="rutinaGym.length">
                    <div class="row justify-between text-white text-caption q-pb-xs" v-for="(item, index) in rutinaGym" :key="index">
                      <div class="col-4 text-center ellipsis">{{item.type_name}}</div>
                      <div class="col-4 text-center">{{item.fecha}}</div>
                      <div class="col-4 text-center">{{item.total_quest}} / {{item.correctas}}</div>
                    </div>
                  </div>
                  <div v-else class="text-white text-caption text-center">Aún no tienes resultados</div>
                </div>
              </q-card>
            </div>
        </q-scroll-area>

        <q-card clickable v-ripple class="bg-grey-5 q-py-lg q-px-md" style="border-radius: 10px" @click="$router.push('/news_user')">
          <div class="text-right text-h5 text-bold">Noticias</div>
        </q-card>

        <q-card clickable v-ripple class="bg-grey-5 q-py-lg q-px-md q-mt-md" style="border-radius: 10px" @click="$router.push('/ver/Temas')">
          <div class="text-right text-h5 text-bold">Tests</div>
        </q-card>

        <q-card clickable v-ripple class="bg-grey-5 q-py-lg q-px-md q-mt-md" style="border-radius: 10px" @click="$router.push('/ver/Gym')">
          <div class="text-right text-h5 text-bold">Gym</div>
        </q-card>

        <q-card clickable v-ripple class="bg-grey-5 q-py-lg q-px-md q-mt-md" style="border-radius: 10px" @click="$router.push('/test/general')">
          <div class="text-right text-h5 text-bold">Test general</div>
        </q-card>

        <q-card clickable v-ripple class="bg-grey-5 q-py-lg q-px-md q-mt-md" style="border-radius: 10px" @click="$router.push('/ver/Examenes')">
          <div class="text-right text-h5 text-bold">Examenes</div>
        </q-card>

        <q-card clickable v-ripple class="bg-grey-5 q-py-lg q-px-md q-mt-md" style="border-radius: 10px" @click="$router.push('/audios')">
          <div class="text-right text-h5 text-bold">Audios</div>
        </q-card>

        <q-card clickable v-ripple class="bg-grey-5 q-py-lg q-px-md q-mt-md" style="border-radius: 10px" @click="$router.push('/forums')">
          <div class="text-right text-h5 text-bold">Foros</div>
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
      licenseTime: 0,
      user: {},
      thumbStyle: {
        right: '5px',
        borderRadius: '8px',
        backgroundColor: '#027be3',
        width: '8px',
        opacity: 0
      },
      rutinaExamen: [],
      rutinaGym: [],
      blogs: []
    }
  },
  mounted () {
    this.courseId = localStorage.getItem('course_id')
    this.baseuPerfil = env.apiUrl + 'perfil_img/'
    this.getUser()
    this.getLicense()
    this.getRutinas()
  },
  methods: {
    getUser () {
      this.$api.get('user_info').then(v => {
        if (v) {
          this.user = v
        }
      })
    },
    getLicense () {
      this.$api.get('get_License_course/' + this.courseId).then(res => {
        if (res) {
          this.licenseTime = res.days
        }
      })
    },
    getRutinas () {
      this.$api.get('mis_examenes/' + this.courseId).then(v => {
        if (v) {
          this.rutinaExamen = v
        }
      })
      this.$api.get('mis_rutinas/' + this.courseId).then(v => {
        if (v) {
          this.rutinaGym = v
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
