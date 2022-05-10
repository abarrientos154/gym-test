<template>
  <div>
    <q-btn class="absolute-top-left" round flat color="white" icon="arrow_back" @click="$router.go(-1)" style="z-index:5" />
    <q-img src="fondo.png" style="height: 250px; width: 100%;">
      <div class="q-pa-md absolute-full bg-transparent">
        <q-card class="row justify-center q-py-lg q-mt-lg bg-white" style="width: 100%; border-radius: 10px;">
          <q-img src="gymtest 1.png" style="width: 150px"/>
        </q-card>
      </div>
    </q-img>

    <div class="q-pa-md bg-white" style="position:relative; top: -70px;border-top-left-radius: 20px; border-top-right-radius: 20px">
        <div class="text-bold text-primary text-center text-italic text-h5">Últimas noticias</div>
        <div v-if="publicidades.length" class="q-pt-md">
          <q-card v-for="(item, index) in publicidades" :key="index" clickable v-ripple @click="$router.push('/publicidad/' + item._id)"
            class="q-mb-md" style="width:100%; border-radius: 10px;">
            <div class="text-center text-white text-h6 ellipsis-2-lines bg-primary q-pa-sm">{{item.title}}</div>
            <q-img :src="baseu + item.image" style="height: 110px; width: 100%; border-bottom-left-radius: 10px; border-bottom-right-radius: 10px" />
          </q-card>
        </div>
        <div v-else class="q-py-xl text-center text-grey-8">Aún no hay noticias</div>
    </div>
  </div>
</template>

<script>
import env from '../../env'
export default {
  data () {
    return {
      baseu: '',
      thumbStyle: {
        right: '5px',
        borderRadius: '8px',
        backgroundColor: '#027be3',
        width: '8px',
        opacity: 0
      },
      publicidades: []
    }
  },
  mounted () {
    this.courseId = localStorage.getItem('course_id')
    this.baseu = env.apiUrl + 'news_img/'
    this.getNews()
  },
  methods: {
    getNews () {
      this.$api.get('newsByCourse/' + this.courseId).then(res => {
        if (res) {
          this.publicidades = res
        }
      })
    }
  }
}
</script>
