<template>
  <div>
    <div style="background: linear-gradient(to right, #002938, #004e6d); height: 200px; width: 100%;"></div>
    <div class="column q-pa-lg no-wrap" style="margin-top: -200px">
      <div class="text-h4 text-white text-bold q-mb-xl q-px-xl">Test General</div>
      <div>
        <div class="text-h5 text-white q-mb-sm q-px-md q-mb-xl">Mi test general</div>
      </div>
    </div>

    <q-card class="text-white bg-primary q-pa-md q-mx-md" style="height:100%; border-radius: 15px">
      <div class="text-h6">Total de preguntas</div>
      <div class="text-caption">El test general debe tener un total de 100 preguntas</div>
      <div class="text-h4 text-bold">{{total}} <b class="text-subtitle1">Preguntas</b></div>
    </q-card>

    <div class=" q-pa-md q-mt-md row justify-between items-start">
      <div>
        <div class="text-primary text-h5 text-bold">Temas del curso</div>
        <div class="text-italic text-grey-8">Ingresa la cantidad de preguntas que tomará de cada tema</div>
      </div>
      <q-btn :label="'Guardar configuración'" color="primary" @click="verify()" no-caps/>
    </div>

    <div class="row q-pa-md">
      <div v-for="(item, index) in topics" :key="index" class="q-px-md q-pb-md col-6">
        <div>{{item.name}}</div>
        <q-input type="number" dense outlined :hint="'Preguntas Disponibles:' + item.questions.length"
        v-model.number="topics[index].cant" label="Número de preguntas"
        :error="$v.topics.$each[index].cant.$error"
        error-message="Exede la cantidad disponible de preguntas en el tema"
        @blur="$v.topics.$each[index].cant.$touch()"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { numeric } from 'vuelidate/lib/validators'
const priceGreater = (value, vm) => {
  let val
  if (value > vm.questions.length) {
    val = false
  } else {
    val = true
  }
  return val
}
export default {
  data () {
    return {
      topics: [],
      am: 5
    }
  },
  validations () {
    return {
      topics: {
        $each: {
          cant: { priceGreater, numeric }
        }
      }
    }
  },
  computed: {
    total () {
      let val = 0
      for (let x = 0; x < this.topics.length; x++) {
        const element = this.topics[x]
        if (element.cant) {
          val += element.cant
        }
      }
      return val
    }
  },
  mounted () {
    this.courseId = localStorage.getItem('course_id')
    this.verifyQuestions()
  },
  methods: {
    verifyQuestions () {
      this.$q.loading.show({
        message: 'Verificando datos...'
      })
      this.$api.get('verifyQuestions/' + this.courseId).then(res => {
        if (res) {
          this.$q.loading.hide()
          this.getTopics()
        } else {
          this.$q.loading.hide()
          this.$q.dialog({
            title: '¡Atención!',
            message: 'No hay suficientes preguntas en el sistema.',
            persistent: true
          }).onOk(() => {
            this.$router.push('/administrador')
          })
        }
      })
    },
    getTopics () {
      this.$q.loading.show({
        message: 'Cargando datos...'
      })
      this.$api.get('topicsWithQuestions/' + this.courseId).then(res => {
        if (res) {
          this.topics = res
          this.$q.loading.hide()
        } else {
          this.$q.loading.hide()
        }
      })
    },
    verify () {
      if (this.$v.topics.$error) {
        this.$q.notify({
          message: 'Existen errores en el formulario.',
          color: 'negative'
        })
      } else if (this.total !== 100) {
        this.$q.notify({
          message: 'La cantidad de preguntas no es el requerido (100).',
          color: 'negative'
        })
      } else {
        this.setConfig()
      }
    },
    setConfig () {
      this.$q.loading.show({
        message: 'Guardando datos...'
      })
      this.$api.post('setConfig', { data: this.topics, course_id: this.courseId }).then(res => {
        if (res) {
          this.$q.loading.hide()
          this.$q.notify({
            message: 'Configuración cargada con éxito.',
            color: 'positive'
          })
          this.getTopics()
        } else {
          this.$q.loading.hide()
          this.$q.dialog({
            title: '¡Atención!',
            message: 'No hay suficientes preguntas en el sistema.',
            persistent: true
          }).onOk(() => {
            this.$router.push('/administrador')
          })
        }
      })
    }
  }
}
</script>
