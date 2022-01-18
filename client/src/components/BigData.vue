<template>
  <div>
    <q-card class="column q-pa-md">
      <div class="text-h6">Cargar Base de datos desde una hoja de cálculo</div>
      <div class="text-subtitle1">Subir Test</div>
      <div class="q-my-sm">
        <q-file
          outlined
          v-model="testFile"
          label="Introduzca un archivo"
          filled
          hint="(test.xlsx)"
          accept=".xls, .xlsx, .xltx, .ods, .ots, .csv/*"
          dense
          error-message="Este campo es requerido"
          max-files="1"/>
      </div>
      <div class="text-subtitle1">Subir Preguntas</div>
      <div class="q-my-sm">
        <q-file
          outlined
          v-model="questionsFile"
          label="Introduzca un archivo"
          filled
          hint="(questions.xlsx)"
          accept=".xls, .xlsx, .xltx, .ods, .ots, .csv/*"
          dense
          error-message="Este campo es requerido"
          max-files="1"/>
      </div>
      <div class="text-subtitle1">Subir Respuestas</div>
      <div class="q-my-sm">
        <q-file
          outlined
          v-model="answersFile"
          label="Introduzca un archivo"
          filled
          hint="(answers.xlsx)"
          accept=".xls, .xlsx, .xltx, .ods, .ots, .csv/*"
          dense
          error-message="Este campo es requerido"
          max-files="1"/>
      </div>
      <q-btn icon="file_upload" color="primary" @click="upload()" label="Cargar"/>
    </q-card>
  </div>
</template>
<script>
export default {
  name: 'BigData',
  data () {
    return {
      testFile: null,
      questionsFile: null,
      answersFile: null
    }
  },
  methods: {
    async upload () {
      this.$q.loading.show({
        message: 'Subiendo datos, esto puede tomar un tiempo...'
      })
      const formData = new FormData()
      if (this.testFile !== null) {
        formData.append('testFile', this.testFile)
      }
      if (this.questionsFile !== null) {
        formData.append('questionsFile', this.questionsFile)
      }
      if (this.answersFile !== null) {
        formData.append('answersFile', this.answersFile)
      }
      await this.$api.post('bigData', formData, {
        headers: {
          'Content-Type': undefined
        }
      }).then(res => {
        if (res) {
          this.$q.loading.hide()
          this.$q.notify({
            message: 'Datos Cargados Correctamente',
            color: 'positive'
          })
          this.$emit('file', false)
        }
      })
    }
  }
}
</script>
