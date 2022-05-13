<template>
  <q-layout class="window-height">
      <q-img src="fondo.png" style="height: 350px; width: 100%; border-bottom-right-radius: 10px; border-bottom-left-radius: 10px">
        <div class="bg-transparent" style="width:100%">
          <div class="q-pb-sm">
            <q-img src="gymtest 1.png" style="width: 150px"/>
          </div>
          <div>
            <div class="text-subtitle1 text-white">Hola, querido usuario</div>
            <div class="text-white text-caption">Bienvenido!</div>
          </div>
          <div class="absolute-top-right q-pa-sm">
              <q-btn no-caps label="Iniciar sesión" to="/login" />
          </div>
        </div>
      </q-img>

      <div class="q-mx-md q-px-md q-pt-lg bg-white" style="position:relative; top: -200px; padding-bottom: 100px; border-top-left-radius: 20px; border-top-right-radius: 20px">
        <q-card class="bordes q-pa-md" v-ripple @click="$router.push('/courses_client')">
          <div class="text-center text-h6">Oposiciones</div>
        </q-card>

        <div class="text-h6 text-bold text-primary q-mt-sm">Noticias</div>
        <div class="text-grey-8 text-caption">Disfruta de contenido informativo exclusivo para nuestros usuarios.</div>
        <q-scroll-area v-if="news.length" horizontal class="q-mt-md" :thumb-style="thumbStyle" style="height: 140px; width: 100%;">
          <div class="row no-wrap q-gutter-md">
            <q-card flat style="width: 130px; height: 130px" clickable v-ripple v-for="(item, index) in news" :key="index"
            @click="$router.push('/publicidad/' + item._id)">
              <q-img :src="baseuNews + item.image" style="height: 100%; width: 100%; border-radius: 10px">
                <div class="absolute-full row items-end">
                  <div class="text-subtitle2 ellipsis-3-lines">{{item.title}}</div>
                </div>
              </q-img>
            </q-card>
          </div>
        </q-scroll-area>
        <div v-else class="text-center text-bold text-grey-9 q-py-lg">Aún no hay nuevas Noticias</div>

        <div class="text-h6 text-bold text-primary q-mt-sm">Foros</div>
        <div class="text-grey-8 text-caption">Un espacio de información para nuestros usuarios de diferentes temáticas.</div>
        <q-scroll-area v-if="forums.length" horizontal class="q-mt-md" :thumb-style="thumbStyle" style="height: 140px; width: 100%;">
          <div class="row no-wrap q-gutter-md">
            <q-card flat style="width: 130px; height: 130px" clickable v-ripple v-for="(item, index) in forums" :key="index"
            @click="$router.push('/forum/' + item._id)">
              <q-img src="materia1 1.png" style="height: 100%; width: 100%; border-radius: 10px">
                <div class="absolute-full row items-end">
                  <div class="text-subtitle2 ellipsis-3-lines">{{item.title}}</div>
                </div>
              </q-img>
            </q-card>
          </div>
        </q-scroll-area>
        <div v-else class="text-center text-bold text-grey-9 q-py-lg">Aún no hay nuevos foros</div>

        <div class="row justify-center q-px-md">
          <q-img src="gymtest 1.png" style="width: 100%; margin-top: 30px" />
        </div>
        <q-page-sticky position="bottom-right" :offset="[18, 18]">
            <q-btn no-caps rounded label="¡Regístrate ahora!" color="primary" @click="$router.push('/registro')" />
          </q-page-sticky>
      </div>
  </q-layout>
</template>

<script>
import env from '../env'
export default {
  name: 'MainLayout',
  data () {
    return {
      baseuNews: '',
      user: {},
      thumbStyle: {
        right: '5px',
        borderRadius: '8px',
        backgroundColor: '#027be3',
        width: '8px',
        opacity: 0
      },
      news: [],
      forums: [],
      planes: [],
      modal: false,
      da: {}
    }
  },
  mounted () {
    this.baseuNews = env.apiUrl + 'news_img/'
    this.getNews()
    this.getForum()
  },
  methods: {
    getNews () {
      this.$api.get('news').then(res => {
        if (res) {
          this.news = res
        }
      })
    },
    getForum () {
      this.$api.get('forums').then(res => {
        if (res) {
          this.forums = res
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
  cursor: pointer;
}
</style>
