<template>
  <div>
    <q-btn class="absolute-top" round flat color="white" icon="arrow_back" style="z-index: 5"
    @click="$router.go(-1)" />
    <q-img src="fondo.png" style="height: 300px; width: 100%; border-bottom-right-radius: 10px; border-bottom-left-radius: 10px">
        <div class="absolute-full column justify-end">
            <div class="row no-wrap items-center" style="padding-bottom: 60px">
                <div class="text-h5 text-bold q-pl-sm">{{data.title}}</div>
            </div>
        </div>
    </q-img>

    <div class="q-mx-md q-pa-md bg-grey-2" style="position:relative; top: -60px; border-radius: 20px; height: 100%">
        <div class="text-grey-8 q-mb-lg q-mt-sm" v-html="data.text">
        </div>
    </div>
  </div>
</template>

<script>
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
    this.getNews()
  },
  methods: {
    getNews () {
      this.$api.get('forumById/' + this.$route.params.id).then(res => {
        if (res) {
          this.data = res
        }
      })
    }
  }
}
</script>
