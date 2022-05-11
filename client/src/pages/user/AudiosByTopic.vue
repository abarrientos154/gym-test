<template>
  <div>
    <q-btn class="absolute-top-left" round flat color="white" icon="arrow_back" @click="$router.go(-1)" style="z-index:5" />
    <q-img src="fondo.png" style="height: 180px; width: 100%;">
        <div class="bg-transparent q-mt-lg" style="width:100%">
          <q-img src="gymtest 1.png" style="width: 150px"/>
        </div>
    </q-img>

    <div class="q-pa-md bg-white" style="position:relative; top: -40px;border-top-left-radius: 20px; border-top-right-radius: 20px">
      <div class="text-bold text-primary text-center text-italic text-h5">{{topic.name}}</div>
      <div class="text-h6 text-grey-8 q-py-sm">Audios:</div>
        <div v-if="audios.length">
          <q-card v-for="(item, index) in audios" :key="index" class="shadow-3 q-pa-sm q-mb-md">
            <div class="text-subtitle2">
              <q-btn @click="playAudio(item._id)" no-caps outline color="primary" class="q-my-xs" style="width: 100%;">{{item.title}}</q-btn>
              <div class="q-pt-sm" style="max-width: 800px; width: 100%;">
                <audio v-if="item.isActive === true" controls style="width: 100%;">
                  <source :src="audio" type="audio/mpeg">
                </audio>
              </div>
            </div>
          </q-card>
        </div>
      </div>
  </div>
</template>

<script>
import env from '../../env'
export default {
  data () {
    return {
      audios: [],
      audio: '',
      baseu: '',
      topic: {}
    }
  },
  mounted () {
    this.getAudios()
    this.getTopicById()
    this.baseu = env.apiUrl + 'audios/'
  },
  methods: {
    getAudios () {
      this.$api.get('audiosByTopic/' + this.$route.params.id).then(res => {
        if (res) {
          this.audios = res
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
    },
    async getTopicById () {
      await this.$api.get('getTopicByNum/' + this.$route.params.id).then(res => {
        if (res) {
          this.topic = { ...res }
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
