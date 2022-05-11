<template>
  <div>
    <div style="background: linear-gradient(to right, #002938, #004e6d); height: 200px; width: 100%;"></div>
    <div class="column q-pa-lg no-wrap" style="margin-top: -200px">
      <div class="text-h4 text-white text-bold q-mb-xl q-px-xl">Ingresos</div>
      <div>
        <div class="text-h5 text-white q-mb-sm q-px-md q-mb-xl">Ingresos recientes</div>
      </div>
    </div>
    <q-card class="text-white bg-primary q-pa-md q-mx-md" style="height:100%; border-radius: 15px">
      <div class="text-h6">Total de preguntas</div>
      <div class="text-h4 text-bold">{{total}}€</div>
    </q-card>
    <div v-for="(item, index) in topics" :key="index">
        <div>{{item.name}}</div>
        <q-input type="number" dense outlined rounded :hint="'Preguntas Disponibles:' + item.questions.length"
        v-model.number="topics[index].cant" label="Numero de preguntas"
        :error="$v.topics.$each[index].cant.$error"
        error-message="Exede la cantidad disponible de preguntas en el tema"
        @blur="$v.topics.$each[index].cant.$touch()"
        >  <!-- :error="$v.form.name.$error" error-message="Este campo es requerido"  @blur="$v.form.name.$touch()" -->
        </q-input>
    </div>
    <q-btn :label="'Cerrar'" color="primary" @click="verify()" no-caps/>
    <q-dialog v-model="alert" persistent>
      <q-card style="width: 100%">
        <q-card-section>
          <div class="text-h6 text-center text-primary text-italic">{{'No hay suficientes preguntas en el sistema'}}</div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn :label="'Cerrar'" color="primary" @click="$router.push('/administrador')" no-caps/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { numeric } from 'vuelidate/lib/validators'
const priceGreater = (value, vm) => {
  console.log(value, vm)
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
      alert: false,
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
    verify () {
      if (this.total !== 2) {
        this.$q.notify({
          message: 'La cantidad de preguntas no es el requerido (100).',
          color: 'negative'
        })
      } else if (this.$v.topics.$error) {
        this.$q.notify({
          message: 'Existen errores en el formulario.',
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
            message: 'Configuración cargada con exito.',
            color: 'positive'
          })
          this.getTopics()
        } else {
          this.alert = true
          this.$q.loading.hide()
        }
      })
    },
    verifyQuestions () {
      this.$q.loading.show({
        message: 'Verificando datos...'
      })
      this.$api.get('verifyQuestions/' + this.courseId).then(res => {
        if (res) {
          this.$q.loading.hide()
          this.getTopics()
          this.getConfig()
        } else {
          this.alert = true
          this.$q.loading.hide()
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
    }
  }
}
</script>
