<template>
  <div>
    <q-btn class="absolute-top" round flat color="white" icon="arrow_back" @click="$router.go(-1)" />
    <q-img src="image 5.png" style="height: 330px; width: 100%; border-bottom-right-radius: 10px; border-bottom-left-radius: 10px">
        <div class="row no-wrap items-center q-mb-xl absolute-bottom bg-transparent">
          <img src="balance 3.png" style="width: 50px" >
          <div class="text-h5 text-bold q-pl-sm">{{tema.name}}</div>
        </div>
    </q-img>

    <div class="q-mx-md q-pa-md bg-white" style="position:relative; top: -40px;border-top-left-radius: 20px; border-top-right-radius: 20px">
        <div class="row item-start">
            <div class="col-6">
                <div class="text-bold text-primary">Tema</div>
                <div class="text-caption text-grey-8">Tema seleccionado</div>
                <div class="q-pt-sm q-pr-xs text-italic text-grey-9 text-caption">{{tema.long_name}}</div>
            </div>
            <div class="col-6">
                <div class="text-bold text-primary">Sub temas</div>
                <div class="text-caption text-grey-8">Sub temas incluidos</div>
                <div v-if="subTemas.length">
                  <q-card clickable v-ripple v-for="(item, index) in subTemas" :key="index" style="border-radius: 5px"
                    :class="selectedSubTemas.find(v => v._id === item._id) ? 'bg-primary text-white' : 'bg-white text-primary'" class="bordes q-px-xs q-mb-sm"
                    @click="selecSub(item)">
                    <div class="text-caption text-center">{{item.process}}</div>
                </q-card>
                </div>
                <div v-else class="text-center text-grey-8 q-pt-md">Sin sub temas</div>
            </div>
        </div>

        <q-separator color="primary" class="q-my-md" />

        <div class="text-bold text-primary">Detalles del examen</div>
        <div class="text-caption text-grey-8">Indicaciones al realizar el examen</div>

        <div class="row item-start q-my-md">
            <div class="col-6">
                <div class="text-caption text-bold text-primary">Preguntas</div>
                <div class="text-caption text-grey-8">Cantidad {{preguntas.length}} preguntas</div>
                <div class="text-caption text-bold text-primary q-mt-md">Fecha de realización</div>
                <div class="text-caption text-grey-8">{{resultado.fecha ? resultado.fecha : 'Nunca'}}</div>
            </div>
            <div class="col-6">
                <div class="text-caption text-bold text-primary">Resultados del test</div>
                <div class="text-caption text-grey-8">Respondidas: {{resultado.total_quest}}</div>
                <div class="text-caption text-grey-8">Correctas: {{resultado.correctas}}</div>
            </div>
        </div>
        <div class="row justify-center">
          <q-btn no-caps color="primary" label="Iniciar test" style="width:80%"
          @click="iniciarTest()" />
        </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      tema: {},
      resultado: {},
      subTemas: [],
      selectedSubTemas: [],
      preguntas: []
    }
  },
  mounted () {
    this.getTema()
  },
  methods: {
    getTema () {
      this.$q.loading.show({
        message: 'Cargando datos...'
      })
      this.$api.get('topic_by_id/' + this.$route.params.id).then(res => {
        if (res) {
          this.tema = res
          this.preguntas = res.questions
          this.subTemas = res.subTemas
          this.$api.get('topic_result_by_id/' + this.tema.tema).then(v => {
            if (v) {
              this.resultado = v
            }
          })
          this.$q.loading.hide()
        }
      })
    },
    selecSub (item) {
      if (this.selectedSubTemas.find(v => v._id === item._id)) {
        this.selectedSubTemas = this.selectedSubTemas.filter(v => v._id !== item._id)
      } else {
        this.selectedSubTemas.push(item)
      }
      if (this.selectedSubTemas.length) {
        this.preguntas = this.tema.questions.filter(v => {
          if (this.selectedSubTemas.find(x => x.process === v.process)) {
            return v
          } else {
            return false
          }
        })
      } else {
        this.preguntas = this.tema.questions
      }
    },
    iniciarTest () {
      if (this.preguntas.length) {
        this.$q.loading.show()
        const data = {
          tema_id: this.tema.tema,
          tema_name: this.tema.name,
          subTemas: this.selectedSubTemas
        }
        this.$api.post('topic_test', data).then(res => {
          if (res) {
            this.$router.push('/tema/' + res._id)
            this.$q.loading.hide()
          } else {
            this.$q.loading.hide()
          }
        })
      } else {
        this.$q.notify({
          message: 'No hay preguntas para iniciar el test',
          color: 'black'
        })
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
