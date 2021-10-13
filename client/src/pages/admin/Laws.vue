<template>
  <div>
    <div style="background: linear-gradient(to right, #002938, #004e6d); height: 200px; width: 100%;"></div>
    <!-- <q-img src="noimg.png" style="border-bottom-left-radius: 10px; border-bottom-right-radius: 10px; height: 265px; width: 100%;"/> -->
    <div class="column q-pa-lg no-wrap" style="margin-top: -200px">
      <div class="text-h4 text-white text-bold q-mb-xl q-px-xl">Leyes</div>
      <div>
        <div class="text-h5 text-white q-mb-sm q-px-md">Leyes recientes</div>
        <!-- <q-scroll-area horizontal style="height: 230px">
          <div class="full-width row no-wrap">
            <q-card class="q-mr-md column bordes" v-for="(item, index) in laws" :key="index" style="width: 260px; border-radius: 20px;">
              <q-img src="noimg.png" style="height: 130px"/>
              <q-card-section class="items-center" horizontal>
                <q-card-section class="ellipsis" style="width: 150px">
                  <div class="text-subtitle1 text-bold text-primary ellipsis">{{item.law_name}}</div>
                  <div class="text-subtitle2 text-grey">Gestion</div>
                </q-card-section>
                <q-card-section>
                  <div class="row no-wrap items-center">
                    <q-btn flat dense @click="editLaw(item)">
                      <q-img src="edit.png" style="height: 35px; width: 35px;"/>
                    </q-btn>
                    <q-btn flat dense @click="deleteLaw(item._id)">
                      <q-img src="delete.png" style="height: 35px; width: 35px;"/>
                    </q-btn>
                  </div>
                </q-card-section>
              </q-card-section>
            </q-card>
          </div>
        </q-scroll-area> -->
      </div>
      <q-btn color="primary" dense no-caps size="md">
        <q-file borderless v-model="file" hint="(.xls, .xlsx, .xltx, .ods, .ots, .csv)" accept=".xls, .xlsx, .xltx, .ods, .ots, .csv/*" @input="uploadFile()" style="height: 30px; font-size: 0px"/>
        <div class="absolute-center">Importar archivo</div>
      </q-btn>
    </div>
    <q-btn color="primary" label="Nueva Ley" icon="add" dense no-caps size="md" class="q-ml-md" @click="newLaw()"/>
    <div class="row justify-center" style="height: 70%">
      <listable class="col" :columns="columns" :data="laws" title="Leyes" @function="execute"/>
    </div>
    <q-dialog v-model="show" @hide="decartarCamb()">
      <q-card style="border-radius: 20px;">
        <q-card-section>
          <div class="text-h6">{{editLaw ? 'Editar Ley' : 'Crear Ley'}}</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-input dense outlined type="text" v-model="form.law_name" label="Nueva Ley" :error="$v.form.law_name.$error" error-message="Este campo es requerido"  @blur="$v.form.law_name.$touch()">
          </q-input>
          <q-input dense outlined type="text" v-model="form.acronym_law" label="Siglas" :error="$v.form.acronym_law.$error" error-message="Este campo es requerido"  @blur="$v.form.acronym_law.$touch()">
          </q-input>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" v-close-popup @click="decartarCamb()" no-caps/>
          <q-btn flat :label="editLaw ? 'Actualizar' :  'Crear'" color="primary" v-close-popup @click="editLaw ? updateLaw() : setLaw()" no-caps/>
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
      editLaw: false,
      form: {},
      laws: [],
      file: null,
      columns: [
        { name: 'id', label: 'ID', align: 'left', field: 'id' },
        { name: 'law_name', label: 'Nombre', align: 'left', field: 'law_name' },
        { name: 'acronym_law', label: 'Siglas', align: 'left', field: 'acronym_law' },
        { name: 'actions', required: true, align: 'left', field: 'actions', style: 'width: 9%' }
      ],
      show: false,
      courseId: ''
    }
  },
  validations: {
    form: {
      law_name: { required },
      acronym_law: { required }
    }
  },
  mounted () {
    this.courseId = localStorage.getItem('course_id')
    this.getLaws()
  },
  methods: {
    updateLaw () {
      this.$v.form.$touch()
      if (!this.$v.form.$error) {
        this.$q.loading.show({
          message: 'Actualizando Ley, Por Favor Espere...'
        })
        this.$api.put('updateLaw/' + this.form._id, this.form).then((res) => {
          if (res) {
            this.$q.loading.hide()
            this.$q.notify({
              color: 'positive',
              message: 'Ley Actualizada Correctamente'
            })
            this.getLaws()
          }
        })
      }
    },
    decartarCamb () {
      this.form = {}
      this.show = false
    },
    /* editLaw (itm) {
      if (itm) {
        const datos = { ...itm }
        this.form = datos
        this.nuevo = true
        this.edit = true
      } else {
        this.nuevo = true
      }
    }, */
    setLaw () {
      this.$v.$touch()
      if (!this.$v.form.$error) {
        this.$q.loading.show({
          message: 'Subiendo ley, Por Favor Espere...'
        })
        this.form.course_id = this.courseId
        this.$api.post('setLaw', this.form).then((res) => {
          if (res) {
            this.$q.loading.hide()
            this.$q.notify({
              color: 'positive',
              message: 'Ley Creada Correctamente'
            })
            this.getLaws()
          }
        })
      }
    },
    deleteLaw (id) {
      this.$q.dialog({
        title: 'Confirma',
        message: '¿Seguro deseas eliminar esta Ley?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.$api.delete('deleteLaw/' + id).then(res => {
          if (res) {
            this.$q.notify({
              color: 'positive',
              message: 'Eliminado Correctamente'
            })
            this.getLaws()
          }
        })
      }).onCancel(() => {
        // console.log('>>>> Cancel')
      })
    },
    async getLaws () {
      this.$q.loading.show({
        message: 'Cargando datos...'
      })
      await this.$api.get('getLawsByCourse/' + this.courseId).then(res => {
        if (res) {
          this.laws = res
          // console.log(this.laws)
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
        this.$api.post('excel_law', formData, {
          headers: {
            'Content-Type': undefined
          }
        }).then(res => {
          if (res) {
            this.$q.notify({
              message: 'Leyes Cargadas Correctamente',
              color: 'positive'
            })
            this.file = null
            this.getLaws()
          }
          this.$q.loading.hide()
        })
      }
    },
    execute (emit) {
      if (emit.title === 'Eliminar') {
        this.deleteLaw(emit.id)
      } else if (emit.title === 'Editar') {
        this.getLawById(emit.id)
        this.editLaw = true
        this.show = true
      }
    },
    async getLawById (id) {
      await this.$api.get('getLawById/' + id).then(res => {
        if (res) {
          this.form = res
        }
      })
    },
    newLaw () {
      this.editLaw = false
      this.form = {}
      this.show = true
    }
  }
}
</script>
