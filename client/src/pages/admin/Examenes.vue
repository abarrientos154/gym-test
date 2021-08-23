<template>
  <div>
    <div style="background: linear-gradient(to right, #002938, #004e6d); height: 200px; width: 100%;"></div>
    <!-- <q-img src="noimg.png" style="border-bottom-left-radius: 10px; border-bottom-right-radius: 10px; height: 265px; width: 100%;"/> -->
    <div class="column q-pa-lg no-wrap" style="margin-top: -200px">
      <div class="text-h4 text-white text-bold q-mb-xl q-px-xl">Examen</div>
      <div>
        <div class="text-h5 text-white q-mb-sm q-px-md">Mis examenes</div>
        <q-scroll-area horizontal style="height: 175px">
          <div class="full-width row no-wrap">
            <q-card class="q-mr-md column bordes" v-for="(item, index) in examenes" :key="index" style="width: 275px;">
              <q-card-section class="col" horizontal>
                <q-card-section class="col column justify-between">
                  <div class="text-subtitle1 text-bold text-primary">{{item.name}}</div>
                  <div class="column justify-between">
                    <div class="row items-center text-grey">
                      <q-icon size="20px" name="date_range" class="q-mr-xs"/>
                      <div>{{item.convocatoria}}</div>
                    </div>
                    <div class="row items-center text-grey">
                      <q-icon size="20px" name="account_tree" class="q-mr-xs"/>
                      <div>Gestion</div>
                    </div>
                    <div class="row items-center text-grey">
                      <q-icon size="20px" name="schedule" class="q-mr-xs"/>
                      <div>10 minutos</div>
                    </div>
                  </div>
                </q-card-section>
                <q-separator color="primary" vertical/>
                <q-card-section class="column">
                  <div class="col column items-center justify-between">
                    <q-btn flat dense>
                      <q-img src="visibility.png" style="height: 25px; width: 35px;"/>
                    </q-btn>
                    <q-btn flat dense @click="editExam(item)">
                      <q-img src="edit.png" style="height: 30px; width: 30px;"/>
                    </q-btn>
                    <q-btn flat dense @click="eiminarExam(item._id)">
                      <q-img src="delete.png" style="height: 30px; width: 30px;"/>
                    </q-btn>
                  </div>
                </q-card-section>
              </q-card-section>
            </q-card>
          </div>
        </q-scroll-area>
      </div>
      <q-btn color="primary" dense no-caps size="md">
        <q-file borderless v-model="file" hint="(.xls, .xlsx, .xltx, .ods, .ots, .csv)" accept=".xls, .xlsx, .xltx, .ods, .ots, .csv/*" @input="changeFile()" style="height: 30px; font-size: 0px"/>
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
          <q-btn flat :label="edit ? 'Actualizar' :  'Crear'" color="primary" v-close-popup @click="edit ? actualizarExam() : nuevo ? crearExam() : ''" no-caps/>
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
      examenes: [],
      file: null
    }
  },
  validations: {
    form: {
      name: { required, minLength: minLength(3), maxLength: maxLength(20) }
    }
  },
  mounted () {
    this.getExam()
  },
  methods: {
    actualizarExam () {
      this.$v.form.$touch()
      if (!this.$v.form.$error) {
        this.$q.loading.show({
          message: 'Actualizando Examen, Por Favor Espere...'
        })
        this.$api.put('examen/' + this.form._id, this.form).then((res) => {
          if (res) {
            this.$q.loading.hide()
            this.$q.notify({
              color: 'positive',
              message: 'Examen Actualizado Correctamente'
            })
            this.getExam()
          }
        })
      }
    },
    decartarCamb () {
      this.form = {}
      this.edit = false
    },
    editExam (itm) {
      if (itm) {
        const datos = { ...itm }
        this.form = datos
        this.nuevo = true
        this.edit = true
      } else {
        this.nuevo = true
      }
    },
    crearExam () {
      this.$v.$touch()
      if (!this.$v.form.$error) {
        this.$q.loading.show({
          message: 'Subiendo Examen, Por Favor Espere...'
        })
        this.$api.post('examen', this.form).then((res) => {
          if (res) {
            this.$q.loading.hide()
            this.$q.notify({
              color: 'positive',
              message: 'Examen Creado Correctamente'
            })
            this.getExam()
          }
        })
      }
    },
    eiminarExam (id) {
      this.$q.dialog({
        title: 'Confirma',
        message: '¿Seguro deseas eliminar este examen?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.$api.delete('examen/' + id).then(res => {
          if (res) {
            this.$q.notify({
              color: 'positive',
              message: 'Eliminado Correctamente'
            })
            this.getExam()
          }
        })
      }).onCancel(() => {
        // console.log('>>>> Cancel')
      })
    },
    getExam () {
      this.$q.loading.show({
        message: 'Cargando datos...'
      })
      this.$api.get('examen').then(res => {
        if (res) {
          this.examenes = res
          // console.log(this.examenes)
        }
        this.$q.loading.hide()
      })
    },
    changeFile () {
      if (this.file !== null) {
        this.$q.loading.show({
          message: 'Subiendo datos, esto puede tomar un tiempo...'
        })
        const formData = new FormData()
        formData.append('fileExcel', this.file)
        this.$api.post('excel_exam', formData, {
          headers: {
            'Content-Type': undefined
          }
        }).then(res => {
          if (res) {
            this.$q.notify({
              message: 'Examenes Cargados Correctamente',
              color: 'positive'
            })
            this.file = null
            this.getExam()
          }
          this.$q.loading.hide()
        })
      }
    }
  }
}
</script>

<style scoped lang="scss">
.bordes {
  border-right: 10px solid $primary;
  border-radius: 20px;
}
</style>
