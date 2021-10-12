<template>
  <div>
      <q-carousel
            v-model="slide"
            animated
            style="height:100%"
            ref="carousel"
            >
            <q-carousel-slide :name="index + 1" class="q-pa-none" v-for="(item, index) in preguntas" :key="index">
                <div class="row justify-center">
                    <q-img src="fondo.png" style="height: 200px; width: 100%; border-bottom-right-radius: 10px; border-bottom-left-radius: 10px">
                        <div class="row justify-between items-center bg-transparent" style="width:100%; z-index: 3">
                          <div>
                            <q-field v-if="esExamen && test.tiempo" outlined dense stack-label>
                              <template v-slot:control>
                                <div class="row justify-end no-wrap" tabindex="0" style="width:100%">
                                  <div class="text-bold text-white text-subtitle1">{{minutos + ':' + segundos}}</div>
                                </div>
                              </template>
                            </q-field>
                          </div>
                          <q-btn v-if="!esExamen" :loading="loading" rounded no-caps color="primary" label="Terminar test" class="q-px-sm" @click="terminado = true, !listo ? responder(true, item) : ''">
                            <template v-slot:loading>
                              <q-spinner-hourglass class="on-left" />
                              Procesando...
                            </template>
                          </q-btn>
                        </div>
                        <div class="row no-wrap items-center bg-transparent q-mt-xl">
                            <!-- <img src="balance 3.png" style="width: 50px" > -->
                            <div class="text-subtitle1 text-bold q-pl-sm ellipsis-2-lines" style="font-size: 17px">{{esTema ? test.tema_name : esExamen ? test.examen_name : test.type_name}}</div>
                        </div>
                        <div style="width: 100%" class="bg-transparent text-h6 row justify-center">
                          <div v-if="item.examData !== null && item.examData !== undefined" class="ellipsis" style="position:relative; top: 75px;">Examen: {{item.examData.name ? item.examData.name : ''}}</div>
                        </div>
                    </q-img>
                </div>

                <div class="q-mx-md q-px-md q-pt-md bg-white" style="position:relative; top: -70px; border-top-left-radius: 20px; border-top-right-radius: 20px">
                    <q-card class="bordes q-pa-none q-mb-md" style="width: 100%; border-radius: 10px;">
                        <!-- <div class="row no-wrap items-center justify-between q-py-xs q-px-xs">
                            <div class="row no-wrap items-center">
                              <q-icon name="help" color="primary" size="40px" />
                              <div class="text-primary q-pl-xs">Pregunta</div>
                            </div>
                            <div v-if="esExamen && test.tiempo" class="q-pr-sm">
                              <q-field outlined dense stack-label>
                                <template v-slot:control>
                                  <div class="row justify-end no-wrap" tabindex="0" style="width:100%">
                                    <div class="text-bold text-primary">{{minutos + ':' + segundos}}</div>
                                  </div>
                                </template>
                              </q-field>
                            </div>
                        </div> -->
                        <div class="bg-primary q-pa-sm q-ma-none">
                            <div class="text-white text-center text-bold text-h6">{{item.title}}</div>
                        </div>
                    </q-card>

                    <q-card clickable v-ripple class="bordes q-pa-none q-my-sm row items-center" v-for="(option, index2) in item.answers" :key="index2" style="width: 100%; border-radius: 10px;"
                    @click="!listo && !terminado ? answerSelected(option, item, index + 1 === preguntas.length ? true : false) : ''">
                      <q-item class="q-pa-none row" style="width:100%">
                        <q-item-section side class="q-py-sm q-px-md q-ma-none text-h6 bg-primary text-white"
                        style="border-top-left-radius: 10px; border-bottom-left-radius: 10px">{{index2 === 0 ? 'A' : index2 === 1 ? 'B' : index2 === 2 ? 'C' : 'D'}}</q-item-section>
                        <q-item-section :class="!listo ? option.isActive ? 'bg-primary text-white text-bold' : 'bg-white text-primary text-bold' : (option.isActive && item.selected) || option.isCorrect ? 'bg-positive text-white' : option.isActive && !item.selected ? 'bg-negative text-white' : 'bg-white text-primary'" class="q-px-sm q-ma-none"
                        style="border-top-right-radius: 10px; border-bottom-right-radius: 10px; font-size: 17px">{{option.answer_name}}</q-item-section>
                      </q-item>
                    </q-card>

                    <div class="row justify-between">
                      <div>
                        <q-btn v-if="index > 0 && !atras && !listo" flat no-caps color="primary" label="Respuesta anterior"
                        @click="anterior()" />

                        <q-btn v-if="atras" flat no-caps color="primary" label="Siguiente"
                        @click="atras = false, listo = false, $refs.carousel.next()" />
                      </div>
                      <div>
                        <q-btn flat no-caps color="orange" label="Ver ley"
                        @click="infoSelec = item, verLey = true" />
                      </div>
                    </div>
                    <div class="row justify-end">
                      <q-btn flat no-caps color="red" label="Reportar fallo"
                      @click="question_id = item._id, report = true" />
                    </div>
                </div>
            </q-carousel-slide>
        </q-carousel>

        <q-dialog v-model="verLey" v-if="verLey">
          <q-card class="q-pa-md bordes" style="width: 100%; border-radius: 15px">
            <div class="text-bold text-primary">Ley</div>
            <div class="text-caption text-grey-8">{{infoSelec.leyInfo.acronym_law ? '(' + infoSelec.leyInfo.acronym_law + ')' : ''}} {{infoSelec.leyInfo.law_name}}</div>
            <div class="text-bold text-primary q-pt-md">{{infoSelec.article}}</div>
            <div class="text-caption text-grey-8">{{infoSelec.articuloInfo ? infoSelec.articuloInfo.sub_title : ''}}</div>
            <div v-if="infoSelec.parrafoInfo.length">
              <div v-for="(item, index) in infoSelec.parrafoInfo" :key="index"
              class="text-caption text-grey-8" :class="infoSelec.paragraph_id && infoSelec.paragraph_id === item.id ? 'text-bold' : ''">
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
  mounted () {
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
          if (pregunta.isActive) {
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
          vm.$api.put(vm.esTema ? 'topic_test/' + vm.idTest : vm.esExamen ? 'examen_test/' + vm.idTest : 'type_test/' + vm.idTest, pregunta).then(res => {
            if (res) {
              vm.$refs.carousel.next()
              vm.listo = false
            }
          })
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
