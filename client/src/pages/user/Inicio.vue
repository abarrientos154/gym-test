<template>
  <div class="column items-center">
      <q-img src="fondo.png" style="height: 450px; width: 100%; border-bottom-right-radius: 10px; border-bottom-left-radius: 10px">
        <div class="bg-transparent" style="width:100%">
          <div class="q-pb-sm">
            <q-img src="gymtest 1.png" style="width: 150px"/>
          </div>
          <div class="row justify-between">
            <div>
              <div class="text-subtitle1 text-white">Hola, {{user.name}}</div>
              <div class="text-white text-caption">Vamos a por todas en esta semana!</div>
            </div>
            <q-img :src="user._id && user.perfile ? baseuPerfil + user._id : 'avatar gris 1.png'" class="bg-grey-5" style="width: 50px; height: 50px; border-radius: 100%"/>
          </div>
        </div>
      </q-img>

      <div class="q-pa-md bg-white" style="position:absolute; top: 130px; padding-bottom: 100px; width:93%; border-top-left-radius: 20px; border-top-right-radius: 20px">
        <!-- <q-card style="width: 100%; border-radius: 10px">
          <q-img src="Group.png" style="width: 100%; height: 200px; border-radius: 10px">
            <div class="absolute-full">
              <div class="text-h6">Nuevo módulo</div>
              <div class="text-caption">Prueba nuestro nuevo set de preguntas</div>
            </div>
          </q-img>
        </q-card> -->

        <div class="text-h6 text-bold text-primary q-mt-sm">Últimos resultados</div>
        <q-card class="bordes q-pa-none" style="width: 100%; border-radius: 10px;">
          <div class="row items-center q-py-xs q-pl-xs">
            <div class="q-pl-xs">
              <div class="text-primary">MIS EXAMENES</div>
              <div class="text-grey-8 text-caption">Conoce el historial de tus examenes</div>
            </div>
          </div>
          <div class="bg-primary q-py-md q-px-xs q-ma-none">
            <div v-if="rutinaExamen.length">
              <div class="row justify-between text-white text-caption q-pb-xs" v-for="(item, index) in rutinaExamen" :key="index">
                <div class="col-5 text-center ellipsis">{{item.examen_name}}</div>
                <div class="col-3 text-center">{{item.fecha}}</div>
                <div class="col-4 text-center">{{item.all_quest}} / {{item.correctas}}</div>
              </div>
            </div>
            <div v-else class="text-white text-caption text-center">No hay examenes presentados</div>
          </div>
        </q-card>

        <q-card class="bordes q-pa-none q-mt-md" style="width: 100%; border-radius: 10px;">
          <div class="row items-center q-py-xs q-pl-xs">
            <div class="q-pl-xs">
              <div class="text-primary">MIS RUTINAS DE ENTRENAMIENTO</div>
              <div class="text-grey-8 text-caption">Conoce el historial de tus rutinas</div>
            </div>
          </div>
          <div class="bg-primary q-py-md q-px-xs q-ma-none">
            <div v-if="rutinaGym.length">
              <div class="row justify-between text-white text-caption q-pb-xs" v-for="(item, index) in rutinaGym" :key="index">
                <div class="col-4 text-center ellipsis">{{item.type_name}}</div>
                <div class="col-4 text-center">{{item.fecha}}</div>
                <div class="col-4 text-center">{{item.total_quest}} / {{item.correctas}}</div>
              </div>
            </div>
            <div v-else class="text-white text-caption text-center">No hay entrenamientos realizados</div>
          </div>
        </q-card>

        <div class="text-h6 text-bold text-primary q-mt-sm">Temas</div>
        <q-scroll-area v-if="materias.length" horizontal class="q-mt-md" :thumb-style="thumbStyle" style="height: 140px; width: 100%;">
          <div class="row no-wrap q-gutter-md">
            <q-card flat style="width: 130px; height: 130px" clickable v-ripple v-for="(item, index) in materias" :key="index"
            @click="$router.push('/tema/' + item._id)">
              <q-img src="materia2 2.png" style="height: 100%; width: 100%; border-radius: 10px">
                <div class="absolute-full row items-end">
                  <div class="text-subtitle2 ellipsis-3-lines">{{item.name}}</div>
                </div>
              </q-img>
            </q-card>
          </div>
        </q-scroll-area>
        <div v-else class="text-center text-bold text-grey-9 q-py-lg">Sin materias actualmente</div>

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

        <div class="text-h6 text-bold text-primary q-mt-sm">Examenes</div>
        <q-scroll-area v-if="examenes.length" horizontal class="q-mt-md" :thumb-style="thumbStyle" style="height: 140px; width: 100%;">
          <div class="row no-wrap q-gutter-md">
            <q-card flat style="width: 130px; height: 130px" clickable v-ripple v-for="(item, index) in examenes" :key="index"
            @click="$router.push('/examen/' + item._id)">
              <q-img src="materia1 1.png" style="height: 100%; width: 100%; border-radius: 10px">
                <div class="absolute-full row items-end">
                  <div class="text-subtitle2 ellipsis-2-lines">{{item.name}}</div>
                </div>
              </q-img>
            </q-card>
          </div>
        </q-scroll-area>
        <div v-else class="text-center text-bold text-grey-9 q-py-lg">Sin examenes actualmente</div>

        <div class="text-h6 text-bold text-primary q-mt-sm">Nuestros Audios</div>
        <div class="row justify-between">
          <div class="col text-caption text-grey-8">Escucha nuestros audios para potenciar tu aprendizaje</div>
        </div>
        <div v-if="audios.length > 0">
          <q-card v-for="(item, index) in audios" :key="index" class="bg-grey-2 q-pa-sm q-mb-xs">
            <div class="text-subtitle2">
              <q-btn @click="playAudio(item._id)" no-caps outline color="primary" class="q-my-xs" style="width: 100%;">{{item.title}}</q-btn>
              <div style="max-width: 800px; width: 100%;">
                <q-media-player
                  v-if="item.isActive === true"
                  type="audio"
                  :sources="audio.sources"
                  background-color="primary"
                  dense
                >
                </q-media-player>
              </div>
            </div>
          </q-card>
        </div>
        <q-card class="bg-grey-2 q-pa-sm" v-else>
          <div class="row justify-center text-grey-8">Aun no hay nuevos Audios</div>
        </q-card>

        <div class="text-h6 text-bold text-primary q-mt-sm">Nuestras Noticias</div>
        <div class="row justify-between">
          <div class="col text-caption text-grey-8">Lee nuestras noticias para potenciar tu aprendizaje</div>
        </div>
        <q-card class="bg-grey-2 q-pa-sm" v-if="news.length > 0">
          <div v-for="(item, index) in news" :key="index" class="text-subtitle2 q-ml-sm">
            <li @click="$router.push('/publicidad/' + item._id)">{{item.title}}</li>
          </div>
        </q-card>
        <q-card class="bg-grey-2 q-pa-sm" v-else>
          <div class="row justify-center text-grey-8">Aun no hay nuevas Noticias</div>
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
      materias: [],
      gym: [],
      examenes: [],
      blogs: [1, 2, 3],
      news: [],
      audios: [],
      audio: {
        sources: [
          {
            src: '',
            type: 'audio/mp3'
          }
        ]
      },
      baseu: ''
    }
  },
  mounted () {
    this.courseId = localStorage.getItem('course_id')
    this.baseuPerfil = env.apiUrl + 'perfil_img/'
    this.baseu = env.apiUrl + 'audios/'
    this.getUser()
    this.getRutinas()
    this.getTemas()
    this.getGym()
    this.getExamenes()
    this.getNews()
    this.getAudios()
  },
  methods: {
    getUser () {
      this.$api.get('user_info').then(v => {
        if (v) {
          this.user = v
        }
      })
    },
    getRutinas () {
      this.$api.get('mis_examenes').then(v => {
        if (v) {
          this.rutinaExamen = v
        }
      })
      this.$api.get('mis_rutinas').then(v => {
        if (v) {
          this.rutinaGym = v
        }
      })
    },
    getTemas () {
      this.$api.get('getTopicsByCourse/' + this.courseId).then(res => {
        if (res) {
          this.materias = res
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
    getNews () {
      this.$api.get('newsByCourse/' + this.courseId).then(res => {
        if (res) {
          this.news = res
        }
      })
    },
    getAudios () {
      this.$api.get('audiosByCourse/' + this.courseId).then(res => {
        if (res) {
          this.audios = res
        }
      })
    },
    playAudio (id) {
      this.audio.sources[0].src = this.baseu + id
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
}
</style>
