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
                        <div v-if="!esExamen" class="row justify-end bg-transparent" style="width:100%; z-index: 3">
                          <q-btn :loading="loading" rounded no-caps color="primary" label="Terminar test" class="q-px-sm"
                          @click="terminado = true, !listo ? responder(true, item) : ''" >
                            <template v-slot:loading>
                              <q-spinner-hourglass class="on-left" />
                              Procesando...
                            </template>
                          </q-btn>
                        </div>
                        <div class="row no-wrap items-center q-mb-xl absolute-bottom bg-transparent">
                            <!-- <img src="balance 3.png" style="width: 50px" > -->
                            <div class="text-h5 text-bold q-pl-sm ellipsis-2-lines">{{esTema ? test.tema_name : esExamen ? test.examen_name : test.type_name}}</div>
                        </div>
                    </q-img>
                </div>

                <div class="q-mx-md q-px-md q-pt-md bg-white" style="position:relative; top: -40px; border-top-left-radius: 20px; border-top-right-radius: 20px">
                    <q-card class="bordes q-pa-none q-mb-md" style="width: 100%; border-radius: 10px;">
                        <div class="row no-wrap items-center justify-between q-py-xs q-px-xs">
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
                        </div>
                        <div class="bg-primary q-py-md q-px-md q-ma-none">
                            <div class="text-white text-center text-caption">{{item.title}}</div>
                        </div>
                    </q-card>

                    <q-card clickable v-ripple class="bordes q-pa-none q-my-sm row items-center" v-for="(option, index2) in item.answers" :key="index2" style="width: 100%; border-radius: 10px;"
                    @click="!listo && !terminado ? answerSelected(option, item, index + 1 === preguntas.length ? true : false) : ''">
                      <q-item class="q-pa-none row" style="width:100%">
                        <q-item-section side class="q-py-sm q-px-md q-ma-none text-h6 bg-primary text-white"
                        style="border-top-left-radius: 10px; border-bottom-left-radius: 10px">{{index2 === 0 ? 'A' : index2 === 1 ? 'B' : index2 === 2 ? 'C' : 'D'}}</q-item-section>
                        <q-item-section :class="!listo ? option.isActive ? 'bg-primary text-white' : 'bg-white text-primary' : (option.isActive && item.selected) || option.isCorrect ? 'bg-positive text-white' : option.isActive && !item.selected ? 'bg-negative text-white' : 'bg-white text-primary'" class="q-px-sm q-ma-none"
                        style="border-top-right-radius: 10px; border-bottom-right-radius: 10px">{{option.answer_name}}</q-item-section>
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
                </div>
            </q-carousel-slide>
        </q-carousel>

        <q-dialog v-model="verLey" v-if="verLey">
          <q-card class="q-pa-md bordes" style="width: 100%; border-radius: 15px">
            <div class="text-bold text-primary">Ley</div>
            <div class="text-caption text-grey-8">{{infoSelec.leyInfo.acronym_law ? '(' + infoSelec.leyInfo.acronym_law + ')' : ''}} {{infoSelec.leyInfo.law_name}}</div>
            <div class="text-bold text-primary q-pt-md">{{infoSelec.articuloInfo.article_name}}</div>
            <div class="text-caption text-grey-8">{{infoSelec.articuloInfo.sub_title}}</div>
          </q-card>
        </q-dialog>
  </div>
</template>

<script>
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
      preguntas: []
    }
  },
  mounted () {
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
          console.log(this.preguntas)
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
    }
  }
}
</script>

<style scoped lang="scss">
.bordes {
  border: 1px solid $primary;
}
</style>
