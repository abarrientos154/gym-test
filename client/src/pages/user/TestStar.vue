<template>
  <div>
      <q-carousel
            v-model="slide"
            animated
            style="height:100%"
            ref="carousel"
            >
            <q-carousel-slide :name="index + 1" class="q-pa-none" v-for="(item, index) in preguntas" :key="index">
                <div class="row justify-center q-pa-md">
                  <q-card class="bordes" style="width:100%; border-radius:10px">
                    <div class="text-center text-primary text-h6">{{esGeneral ? 'Test General' : esTema ? test.tema_name : esExamen ? test.examen_name : test.type_name}}</div>
                    <div class="bg-primary text-white row justify-between items-center q-pa-md">
                      <div>
                        <div v-if="esExamen && test.tiempo">
                          <div class="text-subtitle2">Duración del test</div>
                          <div>{{minutos + ':' + segundos}}</div>
                        </div>
                        <div v-if="!esGeneral && item.examData !== null && item.examData !== undefined" style="width: 50%; border-radius: 20px" class="bg-green text-h6 row q-py-xs q-px-sm">
                          <div class="ellipsis">{{item.examData.name ? item.examData.name : ''}}</div>
                        </div>
                      </div>
                      <q-btn v-if="!esExamen" :loading="loading" rounded no-caps color="white" text-color="primary" label="Terminar test" class="q-px-sm" @click="terminado = true, !listo ? responder(true, item) : ''">
                            <template v-slot:loading>
                              <q-spinner-hourglass class="on-left" />
                              Procesando...
                            </template>
                          </q-btn>
                    </div>
                  </q-card>
                </div>

                <div class="q-pa-md">
                  <q-card class="text-center text-white bg-primary q-pa-sm" style="width: 100%; border-radius: 10px;">{{item.title}}</q-card>
                  <div class="text-primary text-center text-h6 text-italic q-py-sm">Selecciona tu respuesta</div>

                    <q-card clickable v-ripple class="bordes q-pa-none q-my-md row items-center" v-for="(option, index2) in item.answers" :key="index2" style="width: 100%; border-radius: 10px;"
                    @click="!listo && !terminado ? answerSelected(option, item, index + 1 === preguntas.length ? true : false) : ''">
                      <q-item class="q-pa-none row" style="width:100%">
                        <q-item-section side class="q-py-sm q-px-md q-ma-none text-h6 bg-primary text-white"
                        style="border-top-left-radius: 10px; border-bottom-left-radius: 10px">{{index2 === 0 ? 'A' : index2 === 1 ? 'B' : index2 === 2 ? 'C' : 'D'}}</q-item-section>
                        <q-item-section :class="!listo ? option.isActive ? 'bg-primary text-white' : 'bg-white text-grey-8' : (option.isActive && item.selected) || option.isCorrect ? 'bg-positive text-white' : option.isActive && !item.selected ? 'bg-negative text-white' : 'bg-white text-grey-8'" class="q-px-sm q-ma-none"
                        style="border-top-right-radius: 10px; border-bottom-right-radius: 10px; font-size: 17px">{{option.answer_name}}</q-item-section>
                      </q-item>
                    </q-card>

                    <div class="row justify-between q-py-sm">
                      <div>
                        <q-btn v-if="index > 0 && !atras && !listo" rounded dense class="q-px-sm" no-caps color="primary" label="Respuesta anterior"
                        @click="anterior()" />

                        <q-btn v-if="atras" rounded dense class="q-px-sm" no-caps color="primary" label="Siguiente"
                        @click="atras = false, listo = false, $refs.carousel.next()" />
                      </div>
                      <div>
                        <q-btn flat no-caps color="orange" label="Ver ley"
                        @click="infoSelec = item, verLey = true" />
                      </div>
                    </div>
                    <div class="row justify-end q-mt-sm">
                      <q-btn no-caps color="red" label="Reportar fallo"
                      @click="question_id = item._id, report = true" />
                    </div>
                </div>
            </q-carousel-slide>
        </q-carousel>

        <q-dialog v-model="verLey" v-if="verLey">
          <q-card class="q-pa-md bordes" style="width: 100%; border-radius: 15px">
            <div class="text-bold text-primary">Ley</div>
            <div class="text-caption text-grey-8" style="font-size: 17px">{{infoSelec.leyInfo.acronym_law ? '(' + infoSelec.leyInfo.acronym_law + ')' : ''}} {{infoSelec.leyInfo.law_name}}</div>
            <div class="text-bold text-primary q-pt-md">{{infoSelec.article}}</div>
            <div class="text-caption text-grey-8">{{infoSelec.articuloInfo ? infoSelec.articuloInfo.sub_title : ''}}</div>
            <div v-if="infoSelec.parrafoInfo.length">
              <div v-for="(item, index) in infoSelec.parrafoInfo" :key="index"
              class="text-caption text-grey-8 q-mb-xs" :class="infoSelec.paragraph_id && infoSelec.paragraph_id === item.id ? 'text-bold' : ''" style="font-size: 17px">
                {{item.paragraph_text}}
              </div>
            </div>
          </q-card>
        </q-dialog>

        <q-dialog v-model="report" v-if="report">
          <q-card class="q-pa-md bordes" style="width: 100%; border-radius: 15px">
            <div class="text-bold text-primary">Reportar Fallo</div>
            <q-input dense outlined type="textarea" v-model="form.message" label="Mensaje" :error="$v.form.message.$error" error-message="Este campo es requerido"  @blur="$v.form.message.$touch()"></q-input>
            <q-card-actions align="right">
              <q-btn flat label="Cancelar" color="primary" v-close-popup @click="discardChanges()" no-caps/>
              <q-btn flat label="Enviar" color="primary" v-close-popup @click="setFault()" no-caps/>
            </q-card-actions>
          </q-card>
        </q-dialog>
  </div>
</template>

<script>
import { required } from 'vuelidate/lib/validators'
export default {
  data () {
    return {
      timeCounter: null,
      timeCounter1: null,
      timeCounter2: null,
      listo: false,
      terminado: false,
      atras: false,
      loading: false,
      verLey: false,
      esTema: false,
      esExamen: false,
      esGeneral: false,
      idTest: '',
      slide: 1,
      minutos: 0,
      segundos: 0,
      timeTest: 0,
      user: {},
      test: {},
      infoSelec: {},
      preguntas: [],
      report: false,
      form: {},
      courseId: '',
      question_id: ''
    }
  },
  validations: {
    form: {
      message: { required }
    }
  },
  created () {
    this.courseId = localStorage.getItem('course_id')
    this.getUser()
    if (this.$route.params.idTema) {
      this.idTest = this.$route.params.idTema
      this.esTema = true
      this.getTestById('topic_test_by_id/', this.idTest)
    } else if (this.$route.params.idType) {
      this.idTest = this.$route.params.idType
      this.getTestById('type_test_by_id/', this.idTest)
    } else if (this.$route.params.idExamen) {
      this.idTest = this.$route.params.idExamen
      this.esExamen = true
      this.getTestById('examen_test_by_id/', this.idTest)
    } else if (this.$route.params.test) {
      this.esGeneral = true
      this.getGeneralTest()
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
    async getTestById (ruta, id) {
      this.$q.loading.show({
        message: 'Cargando Datos...'
      })
      await this.$api.get(ruta + id).then(res => {
        if (res) {
          this.test = res
          this.preguntas = this.test.questions.sort(() => Math.random() - 0.5)
          if (this.esExamen && res.tiempo) {
            this.valueTiempo()
          }
          this.$q.loading.hide()
        } else {
          this.$q.loading.hide()
          this.$q.notify({
            color: 'negative',
            message: 'Aun no hay datos'
          })
        }
      })
    },
    async getGeneralTest () {
      this.$q.loading.show({
        message: 'Verificando Datos...'
      })
      await this.$api.get('test_general/' + this.courseId).then(res => {
        if (res) {
          this.preguntas = res
          this.$q.loading.hide()
        } else {
          this.$q.loading.hide()
          this.$q.notify({
            color: 'negative',
            message: 'Aún no hay datos'
          })
        }
      })
    },
    valueTiempo () {
      this.minutos = this.test.timeTest - 1
      this.segundos = 60
      this.timeCounter = setInterval(timer, 1000)
      const vm = this

      function timer () {
        if (vm.segundos > 0) {
          if (vm.minutos > 0) {
            vm.segundos = vm.segundos - 1
          } else {
            vm.segundos = vm.segundos - 1
            if (vm.segundos < 6) {
              vm.terminado = true
            }
          }
        } else {
          if (vm.minutos > 0) {
            vm.minutos = vm.minutos - 1
            vm.segundos = 60
          } else {
            clearInterval(vm.timeCounter)
            vm.terminado = true
            vm.responder(true, { isActive: false })
          }
        }
        return vm.minutos
      }
    },
    answerSelected (opcion, pregunta, bool) {
      for (let i = 0; i < pregunta.answers.length; i++) {
        pregunta.answers[i].isActive = false
      }
      pregunta.isActive = true
      opcion.isActive = true
      if (opcion.isCorrect) {
        pregunta.selected = true
      } else {
        pregunta.selected = false
      }
      this.responder(bool, pregunta)
    },
    responder (bool, pregunta) {
      this.$q.loading.show()
      if (bool) {
        this.loading = true
      }
      this.timeCounter1 = setInterval(ver, 2000)
      const vm = this

      function ver () {
        if (bool) {
          if (pregunta.isActive) {
            vm.listo = true
          }
        } else {
          vm.listo = true
        }
        clearInterval(vm.timeCounter1)
        vm.$q.loading.hide()
        vm.timeCounter2 = setInterval(timer, 3000)
        return true
      }

      function timer () {
        if (bool) {
          clearInterval(vm.timeCounter2)
          clearInterval(vm.timeCounter)
          if (!vm.esGeneral && pregunta.isActive) {
            vm.$api.put(vm.esTema ? 'topic_test/' + vm.idTest : vm.esExamen ? 'examen_test/' + vm.idTest : 'type_test/' + vm.idTest, pregunta).then(res => {
              if (res) {
                vm.$router.go(-1)
              }
            })
          } else {
            vm.$router.go(-1)
          }
        } else {
          clearInterval(vm.timeCounter2)
          if (!vm.esGeneral) {
            vm.$api.put(vm.esTema ? 'topic_test/' + vm.idTest : vm.esExamen ? 'examen_test/' + vm.idTest : 'type_test/' + vm.idTest, pregunta).then(res => {
              if (res) {
                vm.$refs.carousel.next()
                vm.listo = false
              }
            })
          } else {
            vm.$refs.carousel.next()
            vm.listo = false
          }
        }
        vm.loading = false
        return true
      }
    },
    anterior () {
      this.$refs.carousel.previous()
      this.listo = true
      this.atras = true
    },
    setFault () {
      this.$v.form.$touch()
      if (!this.$v.form.$error) {
        this.$q.loading.show({
          message: 'Cargando Datos...'
        })
        this.form.course_id = this.courseId
        this.form.question_id = this.question_id
        this.form.user_id = this.user._id
        this.$api.post('setFault', this.form).then(res => {
          if (res) {
            this.$q.loading.hide()
            this.form = {}
            this.$q.notify({
              color: 'positive',
              message: 'Reporte de fallo creado correctamente'
            })
          }
        })
      }
    },
    discardChanges () {
      this.form = {}
      this.$v.$reset()
    }
  }
}
</script>

<style scoped lang="scss">
.bordes {
  border: 1px solid $primary;
}
</style>
