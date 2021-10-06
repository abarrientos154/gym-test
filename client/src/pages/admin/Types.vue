<template>
  <div>
    <div style="background: linear-gradient(to right, #002938, #004e6d); height: 200px; width: 100%;"></div>
    <div class="column q-pa-lg no-wrap" style="margin-top: -200px">
      <div class="text-h4 text-white text-bold q-mb-xl q-px-xl">Tipos</div>
      <div>
        <div class="text-h5 text-white q-mb-sm q-px-md">Tipos recientes</div>
      </div>
      <q-btn color="primary" dense no-caps size="md">
        <q-file borderless v-model="file" hint="(.xls, .xlsx, .xltx, .ods, .ots, .csv)" accept=".xls, .xlsx, .xltx, .ods, .ots, .csv/*" @input="uploadFile()" style="height: 30px; font-size: 0px"/>
        <div class="absolute-center">Importar archivo</div>
      </q-btn>
    </div>
    <q-btn color="primary" label="Nuevo Tipo" icon="add" dense no-caps size="md" class="q-ml-md" @click="newType()"/>
    <div class="row justify-center" style="height: 70%">
      <listable class="col" :columns="columns" :data="types" title="Tipos" @function="execute"/>
    </div>
    <q-dialog v-model="show" @hide="decartarCamb()">
      <q-card style="border-radius: 20px;">
        <q-card-section>
          <div class="text-h6">{{editType ? 'Editar Tipo' : 'Crear Tipo'}}</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-input dense outlined type="text" v-model="form.type_name" label="Nuevo Tipo" :error="$v.form.type_name.$error" error-message="Este campo es requerido"  @blur="$v.form.type_name.$touch()">
          </q-input>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" v-close-popup @click="decartarCamb()" no-caps/>
          <q-btn flat :label="editType ? 'Actualizar' :  'Crear'" color="primary" v-close-popup @click="editType ? updateType() : setType()" no-caps/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import Listable from '../../components/Listable.vue'
import { required } from 'vuelidate/lib/validators'
export default {
  components: { Listable },
  data () {
    return {
      editType: false,
      form: {},
      types: [],
      file: null,
      columns: [
        { name: 'type_name', label: 'Tipo', align: 'left', field: 'type_name' },
        { name: 'actions', required: true, align: 'left', field: 'actions', style: 'width: 9%' }
      ],
      show: false,
      topic: { required }
    }
  },
  validations: {
    form: {
      type_name: { required }
    }
  },
  mounted () {
    this.courseId = localStorage.getItem('course_id')
    this.getTypes()
  },
  methods: {
    updateType () {
      this.$v.form.$touch()
      if (!this.$v.form.$error) {
        this.$q.loading.show({
          message: 'Actualizando Tipo, Por Favor Espere...'
        })
        this.$api.put('updateType/' + this.form._id, this.form).then((res) => {
          if (res) {
            this.$q.loading.hide()
            this.$q.notify({
              color: 'positive',
              message: 'Tipo Actualizado Correctamente'
            })
            this.getTypes()
          }
        })
      }
    },
    decartarCamb () {
      this.form = {}
      this.edit = false
    },
    setType () {
      this.$v.$touch()
      if (!this.$v.form.$error) {
        this.$q.loading.show({
          message: 'Subiendo tipo, Por Favor Espere...'
        })
        this.form.course_id = this.courseId
        this.$api.post('setType', this.form).then((res) => {
          if (res) {
            this.$q.loading.hide()
            this.$q.notify({
              color: 'positive',
              message: 'Tipo Creado Correctamente'
            })
            this.getTypes()
          }
        })
      }
    },
    deleteType (id) {
      this.$q.dialog({
        title: 'Confirma',
        message: '¿Seguro deseas eliminar este Tipo?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.$api.delete('deleteType/' + id).then(res => {
          if (res) {
            this.$q.notify({
              color: 'positive',
              message: 'Eliminado Correctamente'
            })
            this.getTypes()
          }
        })
      }).onCancel(() => {
        // console.log('>>>> Cancel')
      })
    },
    async getTypes () {
      this.$q.loading.show({
        message: 'Cargando datos...'
      })
      await this.$api.get('getTypesByCourse/' + this.courseId).then(res => {
        if (res) {
          this.types = res
          // console.log(this.types)
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
        formData.append('courseId', this.courseId)
        this.$api.post('excel_type', formData, {
          headers: {
            'Content-Type': undefined
          }
        }).then(res => {
          if (res) {
            this.$q.notify({
              message: 'Tipos Cargados Correctamente',
              color: 'positive'
            })
            this.file = null
            this.getTypes()
          }
          this.$q.loading.hide()
        })
      }
    },
    execute (emit) {
      if (emit.title === 'Eliminar') {
        this.deleteType(emit.id)
      } else if (emit.title === 'Editar') {
        this.getTypeById(emit.id)
        this.editType = true
        this.show = true
      }
    },
    async getTypeById (id) {
      await this.$api.get('getTypeById/' + id).then(res => {
        if (res) {
          this.form = res
        }
      })
    },
    newType () {
      this.editType = false
      this.form = {}
      this.show = true
    }
  }
}
</script>
