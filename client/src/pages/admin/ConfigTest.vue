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
        <q-input dense outlined rounded :hint="'Preguntas Disponibles:' + item.questions.length"  v-model.number="topics[index].cant" label="Numero de preguntas">  <!-- :error="$v.form.name.$error" error-message="Este campo es requerido"  @blur="$v.form.name.$touch()" -->
        </q-input>
    </div>
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
export default {
  data () {
    return {
      topics: [],
      alert: false
    }
  },
  computed: {
    total () {
      var val = 0
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
