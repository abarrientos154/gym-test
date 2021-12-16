<template>
  <div>
    <q-img src="fondo.png" style="height: 150px; width: 100%; border-bottom-right-radius: 10px; border-bottom-left-radius: 10px">
      <div class="q-pa-md absolute-full">
        <q-img src="gymtest 1.png" style="width: 150px; margin-left: -15px;"/>
      </div>
    </q-img>
    <div class="q-mx-md q-pa-md bg-white" style="position:relative; top: -40px;border-top-left-radius: 20px; border-top-right-radius: 20px">
      <div class="text-h6 text-bold text-primary q-mt-sm">{{topic.name}}</div>
      <div class="text-h6 text-bold text-grey q-mt-sm">Audios:</div>
        <div v-if="audios.length > 0">
          <q-card v-for="(item, index) in audios" :key="index" class="bg-grey-2 q-pa-sm q-mb-xs">
            <div class="text-subtitle2">
              <q-btn @click="playAudio(item._id)" no-caps outline color="primary" class="q-my-xs" style="width: 100%;">{{item.title}}</q-btn>
              <div style="max-width: 800px; width: 100%;">
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
