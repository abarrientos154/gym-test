<template>
  <div>
    <q-btn class="absolute-top-left" round flat color="white" icon="arrow_back" style="z-index: 5"
    @click="$router.go(-1)" />
    <q-img :src="data.image ? baseu + data.image : ''" style="height: 280px; width: 100%;" />

    <div class="q-pa-md bg-white" style="position:relative; top: -60px; border-radius: 20px; height: 100%">
      <div class="text-bold text-primary text-center text-italic text-h6">{{data.title}}</div>
      <div class="text-grey-8 q-mb-lg q-mt-sm" v-html="data.text"></div>
    </div>
  </div>
</template>

<script>
import env from '../../env'
export default {
  data () {
    return {
      thumbStyle: {
        right: '5px',
        borderRadius: '8px',
        backgroundColor: '#027be3',
        width: '8px',
        opacity: 0
      },
      publicidades: [1, 2, 3],
      data: {},
      baseu: ''
    }
  },
  mounted () {
    this.baseu = env.apiUrl + 'news_img/'
    this.getNews()
  },
  methods: {
    getNews () {
      this.$api.get('newsById/' + this.$route.params.id).then(res => {
        if (res) {
          this.data = res
        }
      })
    }
  }
}
</script>
