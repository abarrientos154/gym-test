<template>
  <div>
      <q-carousel
            v-model="slide"
            animated
            style="height:100%"
            ref="carousel"
            >
            <q-carousel-slide :name="index + 1" class="q-pa-none" v-for="(item, index) in preguntas" :key="index">
                <q-btn v-if="slide > 1" class="absolute-top" round flat color="white" icon="arrow_back" @click="$refs.carousel.previous()" />
                <div class="row justify-center">
                    <q-img src="image 5.png" style="height: 350px; width: 100%; border-bottom-right-radius: 10px; border-bottom-left-radius: 10px">
                        <div class="row items-center q-mb-xl absolute-bottom bg-transparent">
                            <img src="balance 3.png" style="width: 50px" >
                            <div class="text-h5 text-bold q-pl-sm">Nombre del examen</div>
                        </div>
                    </q-img>
                </div>

                <div class="q-mx-md q-px-md q-pt-md bg-white" style="position:relative; top: -40px; border-top-left-radius: 20px; border-top-right-radius: 20px">
                    <q-card class="bordes q-pa-none q-mb-md" style="width: 100%; border-radius: 10px;">
                        <div class="row items-center q-py-xs q-pl-xs">
                            <q-icon name="help" color="primary" size="40px" />
                            <div class="q-pl-xs">
                            <div class="text-primary">Pregunta</div>
                            <div class="text-grey-8 text-caption">{{item.pregunta}}</div>
                            </div>
                        </div>
                        <div class="bg-primary q-py-md q-px-md q-ma-none">
                            <div class="text-white text-center text-caption">{{item.pregunta}}</div>
                        </div>
                    </q-card>

                    <q-card clickable v-ripple class="bordes q-pa-none q-my-sm row items-center" v-for="(option, index2) in item.respuestas" :key="index2" style="width: 100%; border-radius: 10px;"
                    @click="!listo ? answerSelected(option, item) : ''">
                      <q-item class="q-pa-none row" style="width:100%">
                        <q-item-section side class="q-py-sm q-px-md q-ma-none text-h6 bg-primary text-white"
                        style="border-top-left-radius: 10px; border-bottom-left-radius: 10px">{{index2 + 1}}</q-item-section>
                        <q-item-section :class="!listo ? option.isActive ? 'bg-primary text-white' : 'bg-white text-primary' : (option.isActive && item.selected) || (option.value === item.result) ? 'bg-positive text-white' : option.isActive && !item.selected ? 'bg-negative text-white' : 'bg-white text-primary'" class="q-px-sm q-ma-none"
                        style="border-top-right-radius: 10px; border-bottom-right-radius: 10px">{{option.title}}</q-item-section>
                      </q-item>
                    </q-card>

                    <div class="column items-center q-pt-md" style="width:100%;">
                        <q-btn :loading="loading" no-caps color="primary" :label="index + 1 === preguntas.length ? 'Terminar' : 'Responder'" style="width:90%" size="md"
                        :disable="index + 1 === preguntas.length ? false : item.isActive ? false : true"
                        @click="!listo ? responder(index + 1 === preguntas.length ? true : false) : ''" >
                          <template v-slot:loading>
                            <q-spinner-hourglass class="on-left" />
                            Procesando...
                          </template>
                        </q-btn>
                    </div>
                </div>
            </q-carousel-slide>
        </q-carousel>
  </div>
</template>

<script>
export default {
  data () {
    return {
      timeCounter1: null,
      timeCounter2: null,
      listo: false,
      loading: false,
      slide: 1,
      preguntas: [
        {
          pregunta: 'Esta es una pregunta 1',
          isActive: false,
          selected: false,
          result: '1',
          respuestas: [
            { title: 'Esta es una opcion', value: '1', isActive: false },
            { title: 'Esta es una opcion', value: '2', isActive: false },
            { title: 'Esta es una opcion', value: '3', isActive: false },
            { title: 'Esta es una opcion', value: '4', isActive: false }
          ]
        },
        {
          pregunta: 'Esta es una pregunta 2',
          isActive: false,
          selected: false,
          result: '2',
          respuestas: [
            { title: 'Esta es una opcion', value: '1', isActive: false },
            { title: 'Esta es una opcion', value: '2', isActive: false },
            { title: 'Esta es una opcion', value: '3', isActive: false },
            { title: 'Esta es una opcion', value: '4', isActive: false }
          ]
        }
      ]
    }
  },
  mounted () {
  },
  methods: {
    answerSelected (opcion, pregunta) {
      for (let i = 0; i < pregunta.respuestas.length; i++) {
        pregunta.respuestas[i].isActive = false
      }
      pregunta.isActive = true
      opcion.isActive = true
      if (pregunta.result === opcion.value) {
        pregunta.selected = true
      } else {
        pregunta.selected = false
      }
    },
    responder (bool) {
      this.$q.loading.show()
      this.loading = true
      this.timeCounter1 = setInterval(ver, 2000)
      const vm = this

      function ver () {
        vm.listo = true
        clearInterval(vm.timeCounter1)
        vm.$q.loading.hide()
        vm.timeCounter2 = setInterval(timer, 3000)
        return true
      }

      function timer () {
        if (bool) {
          clearInterval(vm.timeCounter2)
          vm.$router.go(-1)
        } else {
          vm.$refs.carousel.next()
          vm.listo = false
          clearInterval(vm.timeCounter2)
        }
        vm.loading = false
        return true
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
