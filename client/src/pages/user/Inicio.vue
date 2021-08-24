<template>
  <div>
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
            <q-img :src="user._id ? baseuPerfil + user._id : ''" style="width: 50px; height: 50px; border-radius: 100%"/>
          </div>
        </div>
      </q-img>

      <div class="q-mx-md q-pa-md bg-white" style="position:absolute; top: 130px; padding-bottom: 100px; border-top-left-radius: 20px; border-top-right-radius: 20px">
        <q-card style="width: 100%; border-radius: 10px">
          <q-img src="Group.png" style="width: 100%; height: 200px; border-radius: 10px">
            <div class="absolute-full">
              <div class="text-h6">Nuevo módulo</div>
              <div class="text-caption">Prueba nuestro nuevo set de preguntas</div>
            </div>
          </q-img>
        </q-card>

        <div class="text-h6 text-bold text-primary q-mt-sm">Tu ranking</div>
        <div class="text-caption text-grey-8 q-mb-sm">Conoce tus últimos resultados</div>
        <q-card class="bordes q-pa-none" style="width: 100%; border-radius: 10px;">
          <div class="row items-center q-py-xs q-pl-xs">
            <q-icon name="language" color="primary" size="40px" />
            <div class="q-pl-xs">
              <div class="text-primary">MIS EXAMENES</div>
              <div class="text-grey-8 text-caption">Conoce el historial de tus examenes</div>
            </div>
          </div>
          <div class="bg-primary q-py-md q-px-xs q-ma-none">
            <div class="row justify-between text-white text-caption q-pb-xs" v-for="(item, index) in 4" :key="index">
              <div>Nombre de rutina</div>
              <div>10/10/2021</div>
              <div>10pts/100pts</div>
            </div>
          </div>
        </q-card>

        <q-card class="bordes q-pa-none q-mt-md" style="width: 100%; border-radius: 10px;">
          <div class="row items-center q-py-xs q-pl-xs">
            <q-icon name="language" color="primary" size="40px" />
            <div class="q-pl-xs">
              <div class="text-primary">MIS RUTINAS DE ENTRENAMIENTO</div>
              <div class="text-grey-8 text-caption">Conoce el historial de tus rutinas</div>
            </div>
          </div>
          <div class="bg-primary q-py-md q-px-xs q-ma-none">
            <div class="row justify-between text-white text-caption q-pb-xs" v-for="(item, index) in 4" :key="index">
              <div>Nombre de rutina</div>
              <div>10/10/2021</div>
              <div>10pts/100pts</div>
            </div>
          </div>
        </q-card>

        <div class="text-h6 text-bold text-primary q-mt-sm">Materias</div>
        <div class="text-caption text-grey-8">Todas nuestras materias</div>
        <q-scroll-area v-if="materias.length" horizontal class="q-mt-md" :thumb-style="thumbStyle" style="height: 140px; width: 100%;">
          <div class="row no-wrap q-gutter-md">
            <q-card flat style="width: 130px; height: 130px" clickable v-ripple v-for="(item, index) in materias" :key="index"
            @click="$router.push('/examen/' + item._id)">
              <q-img src="materia1 1.png" style="height: 100%; width: 100%; border-radius: 10px">
                <div class="absolute-full column justify-end items-center q-pa-none">
                  <!-- <q-icon name="image" color="white" size="50px" /> -->
                  <div class="text-subtitle1 ellipsis-2-lines">{{item.name}}</div>
                </div>
              </q-img>
            </q-card>
          </div>
        </q-scroll-area>
        <div v-else class="text-center text-bold text-grey-9 q-py-lg">Sin materias actualmente</div>

        <div class="text-h6 text-bold text-primary q-mt-sm">Nuestro Blog</div>
        <div class="row justify-between">
          <div class="col text-caption text-grey-8">Lee nuestro blog para potenciar tu aprendizaje</div>
          <div class="col-2 text-caption text-primary cursor-pointer"
          @click="$router.push('/blog_user')">Ver todo</div>
        </div>
        <q-scroll-area v-if="blogs.length" horizontal class="q-mt-md" :thumb-style="thumbStyle" style="height: 270px; width: 100%;">
          <div class="row no-wrap q-gutter-md">
            <q-card flat style="width: 200px; height: 200px" clickable v-ripple v-for="(item, index) in blogs" :key="index"
            @click="$router.push('/blog/' + item)">
              <q-img src="materia1 1.png" style="height: 100%; width: 100%; border-radius: 10px">
                <div class="absolute-full column justify-end">
                  <div class="text-h6 text-center">Nombre del blog</div>
                </div>
              </q-img>
              <div class="text-caption text-grey-7 q-pt-sm q-px-xs ellipsis-3-lines">Descripción del blog</div>
            </q-card>
          </div>
        </q-scroll-area>
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
      materias: [1, 2, 3],
      blogs: [1, 2, 3]
    }
  },
  mounted () {
    this.baseuPerfil = env.apiUrl + 'perfil_img/'
    this.getUser()
    this.getTemas()
  },
  methods: {
    getUser () {
      this.$api.get('user_info').then(v => {
        if (v) {
          this.user = v
        }
      })
    },
    getTemas () {
      this.$q.loading.show({
        message: 'Cargando datos...'
      })
      this.$api.get('topics').then(res => {
        if (res) {
          this.materias = res
        }
        this.$q.loading.hide()
      })
    }
  }
}
</script>

<style scoped lang="scss">
.bordes {
  border: 1px solid $primary;
}
</style>
