<template>
  <div>
    <q-btn class="absolute-top-left" round flat color="white" icon="arrow_back" @click="$router.go(-1)" style="z-index:5" />
    <q-img src="fondo.png" style="height: 180px; width: 100%;">
        <div class="bg-transparent q-mt-lg" style="width:100%">
          <q-img src="gymtest 1.png" style="width: 150px"/>
        </div>
    </q-img>

    <div class="q-pa-md bg-white" style="position:relative; top: -40px;border-top-left-radius: 20px; border-top-right-radius: 20px">
      <div class="text-bold text-primary text-center text-italic text-h5">{{title}}</div>
        <q-card v-for="(item, index) in data" :key="index" clickable v-ripple @click="$router.push('/tema/' + item._id)"
          class="q-mt-md" style="width:100%; border-radius: 10px;">
            <q-img :src="item.image ? baseu + item.image : 'noimg.png'" style="height: 150px; width: 100%;border-radius: 10px;" />
            <div class="absolute-top row justify-end q-pl-md" style="width:100%">
              <div class="text-white text-h6 ellipsis bg-primary q-py-xs q-px-lg"
               style="border-bottom-left-radius: 30px; border-top-right-radius: 10px">{{item.name}}</div>
            </div>
            <!-- <div class="q-px-md q-pb-md text-italic">{{item.long_name}}</div> -->
        </q-card>
    </div>
  </div>
</template>

<script>
import env from '../../env'
export default {
  data () {
    return {
      baseu: '',
      title: '',
      courseId: '',
      data: []
    }
  },
  mounted () {
    this.courseId = localStorage.getItem('course_id')
    this.baseu = env.apiUrl + 'topics_img/'
    this.getTemas()
  },
  methods: {
    getTemas () {
      this.$api.get('getTopicsByCourse/' + this.courseId).then(res => {
        if (res) {
          this.data = res
        }
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
