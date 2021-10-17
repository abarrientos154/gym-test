<template>
  <div>
    <div style="background: linear-gradient(to right, #002938, #004e6d); height: 200px; width: 100%;"></div>
    <!-- <q-img src="noimg.png" style="border-bottom-left-radius: 10px; border-bottom-right-radius: 10px; height: 265px; width: 100%;"/> -->
    <div class="column q-pa-lg no-wrap" style="margin-top: -200px">
      <div class="text-h4 text-white text-bold q-mb-xl q-px-xl">Examen</div>
      <div>
        <div class="text-h5 text-white q-mb-sm q-px-md">Mis examenes</div>
        <!-- <q-scroll-area horizontal style="height: 175px">
          <div class="full-width row no-wrap">
            <q-card class="q-mr-md column bordes" v-for="(item, index) in exams" :key="index" style="width: 275px;">
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
        </q-scroll-area> -->
      </div>
      <q-btn color="primary" dense no-caps size="md">
        <q-file borderless v-model="file" hint="(.xls, .xlsx, .xltx, .ods, .ots, .csv)" accept=".xls, .xlsx, .xltx, .ods, .ots, .csv/*" @input="changeFile()" style="height: 30px; font-size: 0px"/>
        <div class="absolute-center">Importar archivo</div>
      </q-btn>
    </div>
    <div class="row justify-between">
      <q-btn color="primary" label="Nuevo Examen" icon="add" dense no-caps size="md" class="q-ml-md" @click="newExam()"/>
      <q-btn color="red" label="Eliminar Examenes" icon="delete" dense no-caps size="md" class="q-mr-md" @click="deleteAllExams()"/>
    </div>
    <div class="row justify-center" style="height: 70%">
      <listable class="col" :columns="columns" :data="exams" title="Examenes" @function="execute"/>
    </div>
    <q-dialog v-model="show" @hide="decartarCamb()">
      <q-card style="border-radius: 20px;">
        <q-card-section>
          <div class="text-h6">{{editExam ? 'Editar examen' : 'Crear examen'}}</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-input dense outlined type="text" v-model="form.name" label="Nuevo examen" :error="$v.form.name.$error" error-message="Este campo es requerido"  @blur="$v.form.name.$touch()">
          </q-input>
          <!-- <q-date
            v-model="date"
            default-view="Years"
          /> -->
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" v-close-popup @click="decartarCamb()" no-caps/>
          <q-btn flat :label="editExam ? 'Actualizar' :  'Crear'" color="primary" v-close-popup @click="editExam ? updateExam() : setExam()" no-caps/>
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
      edit: false,
      nuevo: false,
      form: {},
      exams: [],
      file: null,
      columns: [
        { name: 'id', label: 'ID', align: 'left', field: 'id' },
        { name: 'date', label: 'Fecha', align: 'left', field: 'date' },
        { name: 'convocatoria', label: 'Convocatoria', align: 'left', field: 'convocatoria' },
        { name: 'name', align: 'left', label: 'Nombre', field: 'name' },
        { name: 'actions', required: true, align: 'left', field: 'actions', style: 'width: 9%' }
      ],
      show: false,
      editExam: false,
      courseId: ''
    }
  },
  validations: {
    form: {
      name: { required }
    }
  },
  mounted () {
    this.courseId = localStorage.getItem('course_id')
    this.getExam()
  },
  methods: {
    updateExam () {
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
    /* editExam (itm) {
      if (itm) {
        const datos = { ...itm }
        this.form = datos
        this.nuevo = true
        this.edit = true
      } else {
        this.nuevo = true
      }
    }, */
    setExam () {
      this.$v.$touch()
      if (!this.$v.form.$error) {
        this.$q.loading.show({
          message: 'Subiendo Examen, Por Favor Espere...'
        })
        this.form.course_id = this.courseId
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
    deleteExam (id) {
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
    deleteAllExams () {
      this.$q.dialog({
        title: 'Confirma',
        message: '¿Seguro deseas eliminar todos los Examenes?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.$api.delete('deleteAllExams').then(res => {
          if (res) {
            this.$q.notify({
              color: 'positive',
              message: 'Examenes eliminados Correctamente'
            })
            this.$router.go()
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
      this.$api.get('getExamByCourse/' + this.courseId).then(res => {
        if (res) {
          this.exams = res
          this.$q.loading.hide()
        }
      })
    },
    changeFile () {
      if (this.file !== null) {
        this.$q.loading.show({
          message: 'Subiendo datos, esto puede tomar un tiempo...'
        })
        const formData = new FormData()
        formData.append('courseId', this.courseId)
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
            this.$q.loading.hide()
          }
        })
      }
    },
    execute (emit) {
      if (emit.title === 'Eliminar') {
        this.deleteExam(emit.id)
      } else if (emit.title === 'Editar') {
        this.getExamById(emit.id)
        this.editExam = true
        this.show = true
      }
    },
    async getExamById (id) {
      await this.$api.get('getExamById/' + id).then(res => {
        if (res) {
          this.form = res
        }
      })
    },
    newExam () {
      this.editQuestion = false
      this.form = {}
      this.show = true
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
