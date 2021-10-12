<template>
  <div>
    <q-btn class="absolute-top" round flat color="white" icon="arrow_back" @click="$router.go(-1)" />
    <q-img :src="tema.image ? baseu + tema.image : 'noimg.png'" style="height: 330px; width: 100%; border-bottom-right-radius: 10px; border-bottom-left-radius: 10px">
        <div class="row no-wrap items-center q-mb-xl absolute-bottom bg-transparent">
          <div class="text-h5 text-bold q-pl-sm">{{esGym ? tema.type_name : tema.name}}</div>
        </div>
    </q-img>

    <div class="q-mx-md q-pa-md bg-white" style="position:relative; top: -40px;border-top-left-radius: 20px; border-top-right-radius: 20px">
        <div v-if="esTema" class="row item-start">
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
        <div v-if="esExamen">
          <div class="text-bold text-primary">Convocatoria</div>
          <div class="text-caption text-grey-8">{{tema.convocatoria}}</div>
        </div>

        <q-separator v-if="!esGym" color="primary" class="q-my-md" />

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
                <div class="text-caption text-grey-8">{{esExamen ? 'Preguntas:' : 'Respondidas:'}} {{resultado.total_quest}}</div>
                <div class="text-caption text-grey-8">Correctas: {{resultado.correctas}}</div>
                <div v-if="esExamen" class="text-caption text-grey-8">Incorrectas: {{resultado.incorrectas}}</div>
                <div v-if="esExamen" class="text-caption text-grey-8">Vacias: {{resultado.vacias}}</div>
            </div>
        </div>
        <div class="row justify-center">
          <q-btn no-caps color="primary" label="Iniciar test" style="width:80%"
          @click="esTema ? iniciarTema() : esGym ? iniciarGym() : verifyExam()" />
        </div>
    </div>

    <q-dialog v-model="examTime">
      <q-card class="q-pa-md" style="width:100%; border-radius: 15px">
        <div class="text-primary text-subtitle1 text-bold">¿Deseas presentar el test con tiempo?</div>
        <q-toggle
          :label="tiempo ? 'Si' : 'No'"
          color="primary"
          v-model="tiempo"
        />
        <q-input v-if="tiempo" outlined v-model.number="timeTest" type="number" suffix="minutos" class="q-my-md">
          <template v-slot:before>
            <q-icon name="timer" color="primary" />
          </template>
        </q-input>
        <div class="row justify-center q-py-md">
          <q-btn no-caps color="primary" label="Iniciar test" style="width:80%"
          @click="verifyTime()" />
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import env from '../../env'
export default {
  data () {
    return {
      esTema: false,
      esExamen: false,
      esGym: false,
      examTime: false,
      tiempo: false,
      timeTest: 1,
      user: {},
      tema: {},
      resultado: {},
      subTemas: [],
      selectedSubTemas: [],
      preguntas: [],
      baseu: ''
    }
  },
  mounted () {
    this.baseu = env.apiUrl + 'topics_img/'
    this.getUser()
    if (this.$route.params.idTema) {
      this.esTema = true
      this.getTema()
    } else if (this.$route.params.idExamen) {
      this.esExamen = true
      this.getExamen()
    } else if (this.$route.params.idType) {
      this.esGym = true
      this.getType()
    }
  },
  methods: {
    async getUser () {
      await this.$api.get('user_info').then(res => {
        if (res) {
          this.user = res
        }
      })
    },
    getTema () {
      this.$q.loading.show({
        message: 'Cargando datos...'
      })
      this.$api.get('topic_by_id/' + this.$route.params.idTema).then(res => {
        if (res) {
          this.tema = res
          this.preguntas = res.questions
          this.subTemas = res.subTemas
          this.$api.get('topic_result_by_id/' + this.tema.topic).then(v => {
            if (v) {
              this.resultado = v
            }
          })
          this.$q.loading.hide()
        }
      })
    },
    getType () {
      this.$q.loading.show({
        message: 'Cargando datos...'
      })
      this.$api.get('type_by_id/' + this.$route.params.idType).then(res => {
        if (res) {
          this.tema = res
          this.preguntas = res.questions
          this.$api.get('type_result_by_id/' + this.tema.id).then(v => {
            if (v) {
              this.resultado = v
            }
          })
          this.$q.loading.hide()
        }
      })
    },
    getExamen () {
      this.$q.loading.show({
        message: 'Cargando datos...'
      })
      this.$api.get('ExamById/' + this.$route.params.idExamen).then(res => {
        if (res) {
          this.tema = res
          this.preguntas = res.questions
          this.$api.get('examen_result_by_id/' + this.tema.id).then(v => {
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
    iniciarTema () {
      if (this.preguntas.length) {
        this.$q.loading.show()
        const data = {
          user_id: this.user._id,
          tema_id: this.tema.topic,
          tema_name: this.tema.name,
          subTemas: this.selectedSubTemas
        }
        this.$api.post('topic_test', data).then(res => {
          if (res) {
            this.$router.push('/tema/test/' + res._id)
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
    },
    iniciarGym () {
      if (this.preguntas.length) {
        this.$q.loading.show()
        const data = {
          user_id: this.user._id,
          type_id: this.tema.id,
          type_name: this.tema.type_name
        }
        this.$api.post('type_test', data).then(res => {
          if (res) {
            this.$router.push('/gym/test/' + res._id)
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
    },
    verifyExam () {
      if (this.preguntas.length) {
        this.tiempo = false
        this.timeTest = 1
        this.examTime = true
      } else {
        this.$q.notify({
          message: 'No hay preguntas para iniciar el test',
          color: 'black'
        })
      }
    },
    verifyTime () {
      if (this.tiempo) {
        if (this.timeTest > 0) {
          this.iniciarExamen()
        } else {
          this.$q.notify({
            message: 'No es un tiempo valido',
            color: 'black'
          })
        }
      } else {
        this.iniciarExamen()
      }
    },
    iniciarExamen () {
      this.$q.loading.show()
      const data = {
        user_id: this.user._id,
        examen_id: this.tema.id,
        examen_name: this.tema.name,
        all_quest: this.preguntas.length,
        tiempo: this.tiempo,
        timeTest: this.timeTest
      }
      this.$api.post('examen_test', data).then(res => {
        if (res) {
          this.$router.push('/examen/test/' + res._id)
          this.$q.loading.hide()
        } else {
          this.$q.loading.hide()
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
