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
                <div class="bg-primary q-py-md q-px-xs q-ma-none" style="height:80%">
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
                <div class="bg-primary q-py-md q-px-xs q-ma-none" style="height:80%">
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

        <q-card clickable v-ripple class="bg-grey-5 q-py-lg q-px-md q-mt-md" style="border-radius: 10px" @click="$router.push('/temas')">
          <div class="text-right text-h5 text-bold">Test por temas</div>
        </q-card>

        <div class="text-h6 text-bold text-primary q-mt-sm">Gym</div>
        <q-scroll-area v-if="gym.length" horizontal class="q-mt-md" :thumb-style="thumbStyle" style="height: 140px; width: 100%;">
          <div class="row no-wrap q-gutter-md">
            <q-card flat style="width: 130px; height: 130px" clickable v-ripple v-for="(item, index) in gym" :key="index"
            @click="$router.push('/gym/' + item._id)">
              <q-img src="materia3 1.png" style="height: 100%; width: 100%; border-radius: 10px">
                <div class="absolute-full row items-end justify-center">
                  <div class="text-subtitle1 text-bold ellipsis-2-lines">{{item.type_name}}</div>
                </div>
              </q-img>
            </q-card>
          </div>
        </q-scroll-area>
        <div v-else class="text-center text-bold text-grey-9 q-py-lg">Sin entrenamiento actualmente</div>

        <div class="text-h6 text-bold text-primary q-mt-sm">Exámenes</div>
        <q-scroll-area v-if="examenes.length" horizontal class="q-mt-md" :thumb-style="thumbStyle" style="height: 140px; width: 100%;">
          <div class="row no-wrap q-gutter-md">
            <q-card flat style="width: 130px; height: 130px" clickable v-ripple v-for="(item, index) in examenes" :key="index"
            @click="$router.push('/examen/' + item._id)">
              <q-img src="materia1 1.png" style="height: 100%; width: 100%; border-radius: 10px">
                <div class="absolute-full row items-end">
                  <div class="text-subtitle2 ellipsis-3-lines">{{item.name}}</div>
                </div>
              </q-img>
            </q-card>
          </div>
        </q-scroll-area>
        <div v-else class="text-center text-bold text-grey-9 q-py-lg">Sin exámenes actualmente</div>

        <div class="text-h6 text-bold text-primary q-mt-sm">Audios</div>
        <q-scroll-area v-if="topicsWithAudios.length" horizontal class="q-mt-md" :thumb-style="thumbStyle" style="height: 140px; width: 100%;">
          <div class="row no-wrap q-gutter-md">
            <q-card flat style="width: 130px; height: 130px" clickable v-ripple v-for="(item, index) in topicsWithAudios" :key="index"
            @click="$router.push('/audios/' + item.topic)">
              <q-img src="audio.jpg" style="height: 100%; width: 100%; border-radius: 10px">
                <div class="absolute-full row items-end">
                  <div class="text-subtitle2 ellipsis-2-lines">{{item.name}}</div>
                </div>
              </q-img>
            </q-card>
          </div>
        </q-scroll-area>
        <div v-else class="text-center text-bold text-grey-9 q-py-lg">Sin audios actualmente</div>

        <div class="text-h6 text-bold text-primary q-mt-sm">Foro</div>
        <q-card class="bg-grey-2 q-pa-sm" v-if="forum.length > 0">
          <div v-for="(item, index) in forum" :key="index" class="text-subtitle2 q-ml-sm">
            <li @click="$router.push('/forum/' + item._id)">{{item.title}}</li>
          </div>
        </q-card>
        <div v-else class="text-center text-bold text-grey-9 q-py-lg">Aún no hay Foros</div>
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
      gym: [],
      examenes: [],
      blogs: [1, 2, 3],
      forum: [],
      topicsWithAudios: []
    }
  },
  mounted () {
    this.courseId = localStorage.getItem('course_id')
    this.baseuPerfil = env.apiUrl + 'perfil_img/'
    this.getUser()
    this.getLicense()
    this.getRutinas()
    this.getGym()
    this.getExamenes()
    this.getForum()
    this.getTopicsWithAudio()
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
    },
    getGym () {
      this.$api.get('gettypesByCourse/' + this.courseId).then(res => {
        if (res) {
          this.gym = res
        }
      })
    },
    getExamenes () {
      this.$api.get('getExamByCourse/' + this.courseId).then(res => {
        if (res) {
          this.examenes = res
        }
      })
    },
    getForum () {
      this.$api.get('forumByCourse/' + this.courseId).then(res => {
        if (res) {
          this.forum = res
        }
      })
    },
    getTopicsWithAudio () {
      this.$api.get('getTopicWithAudio/' + this.courseId).then(res => {
        if (res) {
          this.topicsWithAudios = res
        }
      })
    },
    playAudio (id) {
      this.audio = this.baseu + id
      for (const i in this.audios) {
        this.audios[i].isActive = false
        if (this.audios[i]._id === id) {
          this.audios[i].isActive = true
        }
      }
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
