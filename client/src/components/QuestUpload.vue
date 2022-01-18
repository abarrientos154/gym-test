<template>
  <div>
    <q-card class="column q-pa-md">
      <div class="text-h6">Cargar desde una hoja de cálculo </div>
      <div class="q-my-sm">
        <q-file
          outlined
          v-model="file"
          label="Introduzca un archivo"
          filled
          hint="(.xls, .xlsx, .xltx, .ods, .ots, .csv)"
          accept=".xls, .xlsx, .xltx, .ods, .ots, .csv/*"
          dense
          :error="$v.file.$error"
          error-message="Este campo es requerido"
          @blur="$v.file.$touch()"
          max-files="1"/>
      </div>
      <q-btn icon="file_upload" color="primary" @click="upload()" label="Cargar"/>
    </q-card>
  </div>
</template>
<script>
import { required } from 'vuelidate/lib/validators'
export default {
  name: 'QuestUpload',
  props: ['test_id'],
  data () {
    return {
      file: null
    }
  },
  validations: {
    file: { required }
  },
  methods: {
    async upload () {
      this.$v.$touch()
      if (!this.$v.file.$error) {
        this.$q.loading.show({
          message: 'Subiendo datos, esto puede tomar un tiempo...'
        })
        const dataId = {}
        dataId.test_id = this.test_id
        const formData = new FormData()
        formData.append('fileExcel', this.file)
        formData.append('data', JSON.stringify(dataId))
        await this.$api.post('uploadExcel', formData, {
          headers: {
            'Content-Type': undefined
          }
        }).then(res => {
          if (res) {
            this.$q.loading.hide()
            this.$q.notify({
              message: 'Preguntas Cargadas Correctamente',
              color: 'positive'
            })
            this.$emit('file', false)
          }
        })
      }
    }
  }
}
</script>
