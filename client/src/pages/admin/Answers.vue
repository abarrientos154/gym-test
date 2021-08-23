<template>
  <div>
    <div style="background: linear-gradient(to right, #002938, #004e6d); height: 200px; width: 100%;"></div>
    <!-- <q-img src="noimg.png" style="border-bottom-left-radius: 10px; border-bottom-right-radius: 10px; height: 265px; width: 100%;"/> -->
    <div class="column q-pa-lg no-wrap" style="margin-top: -200px">
      <div class="text-h4 text-white text-bold q-mb-xl q-px-xl">Respuestas</div>
      <div>
        <div class="text-h5 text-white q-mb-sm q-px-md">Respuestas recientes</div>
        <q-scroll-area horizontal style="height: 230px">
          <div class="full-width row no-wrap">
            <q-card class="q-mr-md column bordes" v-for="(item, index) in answers" :key="index" style="width: 260px; border-radius: 20px;">
              <q-img src="noimg.png" style="height: 130px"/>
              <q-card-section class="items-center" horizontal>
                <q-card-section class="ellipsis" style="width: 150px">
                  <div class="text-subtitle1 text-bold text-primary ellipsis">{{item.answer_name}}</div>
                  <div class="text-subtitle2 text-grey">Gestion</div>
                </q-card-section>
                <q-card-section>
                  <div class="row no-wrap items-center">
                    <q-btn flat dense @click="editAnswer(item)">
                      <q-img src="edit.png" style="height: 35px; width: 35px;"/>
                    </q-btn>
                    <q-btn flat dense @click="deleteAnswer(item._id)">
                      <q-img src="delete.png" style="height: 35px; width: 35px;"/>
                    </q-btn>
                  </div>
                </q-card-section>
              </q-card-section>
            </q-card>
          </div>
        </q-scroll-area>
      </div>
      <q-btn color="primary" dense no-caps size="md">
        <q-file borderless v-model="file" hint="(.xls, .xlsx, .xltx, .ods, .ots, .csv)" accept=".xls, .xlsx, .xltx, .ods, .ots, .csv/*" @input="uploadFile()" style="height: 30px; font-size: 0px"/>
        <div class="absolute-center">Importar archivo</div>
      </q-btn>
    </div>
    <q-dialog v-model="nuevo" @hide="decartarCamb()">
      <q-card style="border-radius: 20px;">
        <q-card-section>
          <div class="text-h6">{{edit ? 'Editar Examen' : 'Crear Examen'}}</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-input rounded dense outlined type="text" v-model="form.name" label="Nuevo nombre" :error="$v.form.name.$error" error-message="Este campo es requerido"  @blur="$v.form.name.$touch()">
            <template v-slot:prepend>
              <q-icon name="edit" color="primary"/>
            </template>
          </q-input>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" v-close-popup @click="decartarCamb()" no-caps/>
          <q-btn flat :label="edit ? 'Actualizar' :  'Crear'" color="primary" v-close-popup @click="edit ? updateAnswers() : nuevo ? setAnswer() : ''" no-caps/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { required, minLength, maxLength } from 'vuelidate/lib/validators'
export default {
  data () {
    return {
      edit: false,
      nuevo: false,
      form: {},
      answers: [],
      file: null
    }
  },
  validations: {
    form: {
      name: { required, minLength: minLength(3), maxLength: maxLength(20) }
    }
  },
  mounted () {
    this.getAnswers()
  },
  methods: {
    updateAnswers () {
      this.$v.form.$touch()
      if (!this.$v.form.$error) {
        this.$q.loading.show({
          message: 'Actualizando Respuesta, Por Favor Espere...'
        })
        this.$api.put('/' + this.form._id, this.form).then((res) => {
          if (res) {
            this.$q.loading.hide()
            this.$q.notify({
              color: 'positive',
              message: 'Respuesta Actualizada Correctamente'
            })
            this.getAnswers()
          }
        })
      }
    },
    decartarCamb () {
      this.form = {}
      this.edit = false
    },
    editAnswer (itm) {
      if (itm) {
        const datos = { ...itm }
        this.form = datos
        this.nuevo = true
        this.edit = true
      } else {
        this.nuevo = true
      }
    },
    setAnswer () {
      this.$v.$touch()
      if (!this.$v.form.$error) {
        this.$q.loading.show({
          message: 'Subiendo ley, Por Favor Espere...'
        })
        this.$api.post('', this.form).then((res) => {
          if (res) {
            this.$q.loading.hide()
            this.$q.notify({
              color: 'positive',
              message: 'Respuesta Creada Correctamente'
            })
            this.getAnswers()
          }
        })
      }
    },
    deleteAnswer (id) {
      this.$q.dialog({
        title: 'Confirma',
        message: '¿Seguro deseas eliminar esta Respuesta?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.$api.delete('/' + id).then(res => {
          if (res) {
            this.$q.notify({
              color: 'positive',
              message: 'Eliminado Correctamente'
            })
            this.getAnswers()
          }
        })
      }).onCancel(() => {
        // console.log('>>>> Cancel')
      })
    },
    async getAnswers () {
      this.$q.loading.show({
        message: 'Cargando datos...'
      })
      await this.$api.get('answers').then(res => {
        if (res) {
          this.answers = res.slice(0, 10)
          // console.log(this.answers)
        }
        this.$q.loading.hide()
      })
    },
    uploadFile () {
      if (this.file !== null) {
        this.$q.loading.show({
          message: 'Subiendo datos, esto puede tomar un tiempo...'
        })
        const formData = new FormData()
        formData.append('fileExcel', this.file)
        this.$api.post('excel_answer', formData, {
          headers: {
            'Content-Type': undefined
          }
        }).then(res => {
          if (res) {
            this.$q.notify({
              message: 'Respuestas Cargadas Correctamente',
              color: 'positive'
            })
            this.file = null
            this.getAnswers()
          }
          this.$q.loading.hide()
        })
      }
    }
  }
}
</script>
