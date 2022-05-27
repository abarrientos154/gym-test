<template>
  <div>
    <q-btn class="absolute-top-left" round flat color="white" icon="arrow_back" @click="$router.go(-1)" style="z-index: 10" />
    <q-img v-if="esTema" :src="tema.image ? baseu + tema.image : 'fondo.png'" style="height: 240px; width: 100%;" />
    <q-img v-if="esGym" :src="tema.image ? baseuTy + tema.image : 'fondo.png'" style="height: 240px; width: 100%;" />
    <q-img v-if="esExamen" :src="tema.image ? baseuEx + tema.image : 'fondo.png'" style="height: 240px; width: 100%;" />
    <q-img v-if="esGeneral || esByTema" src="fondo.png" style="height: 240px; width: 100%;">
        <div class="bg-transparent q-mt-xl" style="width:100%">
          <q-img src="gymtest 1.png" style="width: 150px"/>
        </div>
    </q-img>

    <div class="q-pa-md bg-white" style="position:relative; top: -40px;border-top-left-radius: 20px; border-top-right-radius: 20px">
      <div class="text-bold text-primary text-center text-italic text-h5">{{esGeneral ? 'Test General' : esByTema ? 'Test por Tema' : esGym ? tema.type_name : tema.name}}</div>
      <div v-if="esTema" class="q-pa-md text-italic text-grey-9">{{tema.long_name}}</div>

      <div v-if="esGeneral" class="q-pa-md q-mt-md text-italic text-grey-9 text-center">Aquí vas a realizar un test general donde hacemos una recopilación aleatoria de 100 preguntas de todos los temas para prepararte como puede ser la realización de un examen oficial</div>

      <div v-if="esTema">
        <div class="text-primary text-bold text-italic">Selecciona los subtemas para realizar el test</div>
        <div v-if="subTemas.length" class="row q-py-sm">
          <div v-for="(item, index) in subTemas" :key="index">
            <q-chip clickable color="primary" :outline="selectedSubTemas.find(v => v._id === item._id) ? false : true"
                :text-color="selectedSubTemas.find(v => v._id === item._id) ? 'white' : 'primary'" @click="selecSub(item)">
              {{item.process}}
            </q-chip>
          </div>
        </div>
        <div v-else class="text-center text-grey-8 q-py-md">Sin Subtemas</div>
      </div>

      <div v-if="esByTema" class="q-py-md">
        <div class="text-primary text-bold text-italic">Selecciona la cantidad de preguntas del test</div>
        <q-option-group
          v-model="optionQues"
          :options="options"
          color="primary"
          inline
        />
        <div class="text-primary text-bold text-italic q-pt-md">Selecciona los temas para realizar el test</div>
        <div v-if="temas.length" class="row q-py-sm">
          <div v-for="(item, index) in temas" :key="index">
            <q-chip clickable color="primary" :outline="selectedTemas.find(v => v._id === item._id) ? false : true"
                :text-color="selectedTemas.find(v => v._id === item._id) ? 'white' : 'primary'" @click="selecTema(item)">
              {{item.name}}
            </q-chip>
          </div>
        </div>
        <div v-else class="text-center text-grey-8 q-py-md">Sin temas</div>
      </div>

      <div v-if="!esGeneral && !esByTema" class="q-pt-md">
        <div v-if="esExamen" class="row items-center">
          <div class="text-primary text-bold">Convocatoria</div>
          <div class="q-pl-md">{{tema.convocatoria}}</div>
        </div>
        <div class="row items-center">
          <div class="text-primary text-bold">Cantidad de preguntas</div>
          <div class="q-pl-md">{{preguntas.length}} preguntas</div>
        </div>
        <div class="row items-center">
          <div class="text-primary text-bold">Fecha de realización</div>
          <div class="q-pl-md">{{resultado.fecha ? resultado.fecha : 'Nunca'}}</div>
        </div>
      </div>

      <div v-if="!esGeneral && !esByTema">
        <div class="text-primary text-center text-h6 q-pt-md">Último resultado</div>
        <div class="text-primary text-center"><b>{{esExamen ? 'Preguntas:' : 'Respondidas:'}}</b> {{resultado.total_quest}}</div>
        <div class="row justify-between q-pt-md">
          <div class="text-primary text-center"><b>Correctas</b><br>{{resultado.correctas}}</div>
          <div v-if="esExamen" class="text-primary text-center"><b>Incorrectas</b><br>{{resultado.incorrectas}}</div>
          <div v-if="esExamen" class="text-primary text-center"><b>Omitidas</b><br>{{resultado.vacias}}</div>
        </div>
      </div>

        <div class="row justify-center q-py-xl">
          <q-btn no-caps color="primary" label="Iniciar" size="lg" style="width:100%;border-radius:10px"
          @click="esGeneral ? verifyGeneral() : esByTema ? verifyByTema() : esTema ? iniciarTema() : esGym ? iniciarGym() : verifyExam()" />
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
      esGeneral: false,
      esByTema: false,
      tiempo: false,
      timeTest: 1,
      optionQues: 10,
      user: {},
      tema: {},
      resultado: {},
      temas: [],
      selectedTemas: [],
      subTemas: [],
      selectedSubTemas: [],
      preguntas: [],
      options: [
        {
          label: '10 preguntas',
          value: 10
        },
        {
          label: '25 preguntas',
          value: 25
        },
        {
          label: '50 preguntas',
          value: 50
        }
      ],
      baseu: '',
      baseuTy: '',
      baseuEx: '',
      courseId: ''
    }
  },
  created () {
    this.courseId = localStorage.getItem('course_id')
    this.baseu = env.apiUrl + 'topics_img/'
    this.baseuTy = env.apiUrl + 'types_img/'
    this.baseuEx = env.apiUrl + 'exams_img/'
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
    } else if (this.$route.params.general) {
      this.esGeneral = true
    } else if (this.$route.params.tema) {
      this.esByTema = true
      this.getDataTemas()
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
    getDataTemas () {
      this.$q.loading.show({
        message: 'Cargando datos...'
      })
      this.$api.get('getTopicsByCourse/' + this.courseId).then(res => {
        if (res) {
          this.temas = res
          this.$q.loading.hide()
        } else {
          this.$q.loading.hide()
          this.$q.notify({
            color: 'negative',
            message: 'Error al consultar datos'
          })
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
      this.$api.get('ExamById/' + this.$route.params.idExamen + '/' + this.courseId).then(res => {
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
    selecTema (item) {
      if (this.selectedTemas.find(v => v._id === item._id)) {
        this.selectedTemas = this.selectedTemas.filter(v => v._id !== item._id)
      } else if (this.selectedTemas.length < this.optionQues) {
        this.selectedTemas.push(item)
      } else {
        this.$q.notify({
          color: 'black',
          message: 'No puedes seleccionar más temas que preguntas'
        })
      }
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
    async iniciarTema () {
      this.$q.loading.show({
        message: 'Preparando Datos...'
      })
      if (this.preguntas.length) {
        const data = {
          user_id: this.user._id,
          tema_id: this.tema.topic,
          tema_name: this.tema.name,
          subTemas: this.selectedSubTemas
        }
        await this.$api.post('topic_test', data).then(async res => {
          if (res) {
            this.$router.push('/tema/test/' + res._id)
            this.$q.loading.hide()
          } else {
            this.$q.loading.hide()
          }
        })
      } else {
        this.$q.loading.hide()
        this.$q.notify({
          message: 'No hay preguntas para iniciar el test',
          color: 'black'
        })
      }
    },
    async iniciarGym () {
      this.$q.loading.show({
        message: 'Preparando Datos...'
      })
      if (this.preguntas.length) {
        const data = {
          user_id: this.user._id,
          type_id: this.tema.id,
          type_name: this.tema.type_name
        }
        await this.$api.post('type_test', data).then(async res => {
          if (res) {
            this.$router.push('/gym/test/' + res._id)
            this.$q.loading.hide()
          } else {
            this.$q.loading.hide()
          }
        })
      } else {
        this.$q.loading.hide()
        this.$q.notify({
          message: 'No hay preguntas para iniciar el test',
          color: 'black'
        })
      }
    },
    async verifyGeneral () {
      this.$q.loading.show({
        message: 'Verificando Datos...'
      })
      await this.$api.get('test_general/' + this.courseId).then(res => {
        if (res) {
          this.$router.push('/general/test')
          this.$q.loading.hide()
        } else {
          this.$q.loading.hide()
          this.$q.notify({
            color: 'black',
            message: 'No hay preguntas suficientes para este test'
          })
        }
      })
    },
    async verifyByTema () {
      if (this.selectedTemas.length) {
        this.$q.loading.show({
          message: 'Verificando Datos...'
        })
        await this.$api.post('test_by_tema/' + this.courseId, { cant_questions: this.optionQues, temas: this.selectedTemas }).then(res => {
          if (res) {
            this.$router.push('/por_tema/test/' + res._id)
            this.$q.loading.hide()
          } else {
            this.$q.loading.hide()
            this.$q.notify({
              color: 'black',
              message: 'No hay preguntas suficientes para este test'
            })
          }
        })
      } else {
        this.$q.notify({
          color: 'black',
          message: 'Debes seleccionar temas para hacer el test'
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
    async iniciarExamen () {
      this.$q.loading.show({
        message: 'Preparando Datos...'
      })
      const data = {
        user_id: this.user._id,
        examen_id: this.tema.id,
        examen_name: this.tema.name,
        all_quest: this.preguntas.length,
        tiempo: this.tiempo,
        timeTest: this.timeTest
      }
      await this.$api.post('examen_test', data).then(async res => {
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
