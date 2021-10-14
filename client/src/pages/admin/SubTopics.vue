<template>
  <div>
    <div style="background: linear-gradient(to right, #002938, #004e6d); height: 200px; width: 100%;"></div>
    <!-- <q-img src="noimg.png" style="border-bottom-left-radius: 10px; border-bottom-right-radius: 10px; height: 265px; width: 100%;"/> -->
    <div class="column q-pa-lg no-wrap" style="margin-top: -200px">
      <div class="text-h4 text-white text-bold q-mb-xl q-px-xl">Sub Temas</div>
      <div>
        <div class="text-h5 text-white q-mb-sm q-px-md">Sub Temas recientes</div>
        <!-- <q-scroll-area horizontal style="height: 230px">
          <div class="full-width row no-wrap">
            <q-card class="q-mr-md column bordes" v-for="(item, index) in subTopics" :key="index" style="width: 260px; border-radius: 20px;">
              <q-img src="noimg.png" style="height: 130px"/>
              <q-card-section class="items-center" horizontal>
                <q-card-section class="ellipsis" style="width: 150px">
                  <div class="text-subtitle1 text-bold text-primary ellipsis">{{item.process}}</div>
                  <div class="text-subtitle2 text-grey">Gestion</div>
                </q-card-section>
                <q-card-section>
                  <div class="row no-wrap items-center">
                    <q-btn flat dense @click="editSubTopic(item)">
                      <q-img src="edit.png" style="height: 35px; width: 35px;"/>
                    </q-btn>
                    <q-btn flat dense @click="deleteSubTopic(item._id)">
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
    <div class="row justify-between">
      <q-btn color="primary" label="Nuevo Sub Tema" icon="add" dense no-caps size="md" class="q-ml-md" @click="newSubTopic()"/>
      <q-btn color="red" label="Eliminar Sub-Temas" icon="delete" dense no-caps size="md" class="q-mr-md" @click="deleteAllSubTopics()"/>
    </div>
    <div class="row justify-center" style="height: 70%">
      <listable class="col" :columns="columns" :data="subTopics" title="Sub Temas" @function="execute"/>
    </div>
    <q-dialog v-model="show" @hide="decartarCamb()">
      <q-card style="border-radius: 20px;">
        <q-card-section>
          <div class="text-h6">{{editSubTopic ? 'Editar Tema' : 'Crear Tema'}}</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-select style="min-width: 220px" class="q-mr-md" outlined v-model="form.topic_id" label="Escoga un tema" dense :options="topics" :error="$v.form.topic_id.$error" error-message="Este campo es requerido"  @blur="$v.form.topic_id.$touch()" map-options emit-value option-value="topic" options-selected-class="text-primary" option-label="topic" clearable></q-select>
          <q-input dense outlined type="text" v-model="form.process" label="Nuevo Proceso" :error="$v.form.process.$error" error-message="Este campo es requerido"  @blur="$v.form.process.$touch()">
          </q-input>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" v-close-popup @click="decartarCamb()" no-caps/>
          <q-btn flat :label="editSubTopic ? 'Actualizar' :  'Crear'" color="primary" v-close-popup @click="editSubTopic ? updateSubTopic() : setSubTopic()" no-caps/>
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
      editSubTopic: false,
      form: {},
      subTopics: [],
      topics: [],
      file: null,
      columns: [
        { name: 'id', label: 'ID', align: 'left', field: 'id' },
        { name: 'topic_id', label: 'Tema', align: 'left', field: 'topic_id' },
        { name: 'process', label: 'Nombre Completo', align: 'left', field: 'process' },
        { name: 'actions', required: true, align: 'left', field: 'actions', style: 'width: 9%' }
      ],
      show: false,
      courseId: ''
    }
  },
  validations: {
    form: {
      topic_id: { required },
      process: { required }
    }
  },
  mounted () {
    this.courseId = localStorage.getItem('course_id')
    this.getSubTopics()
  },
  methods: {
    async getTopics () {
      await this.$api.get('getTopics').then(res => {
        if (res) {
          this.topics = res
        }
      })
    },
    updateSubTopic () {
      this.$v.form.$touch()
      if (!this.$v.form.$error) {
        this.$q.loading.show({
          message: 'Actualizando Sub Tema, Por Favor Espere...'
        })
        this.$api.put('updateSubTopic/' + this.form._id, this.form).then((res) => {
          if (res) {
            this.$q.loading.hide()
            this.$q.notify({
              color: 'positive',
              message: 'Sub Tema Actualizado Correctamente'
            })
            this.getSubTopics()
          }
        })
      }
    },
    decartarCamb () {
      this.form = {}
      this.edit = false
    },
    setSubTopic () {
      this.$v.$touch()
      if (!this.$v.form.$error) {
        this.$q.loading.show({
          message: 'Subiendo Sub Tema, Por Favor Espere...'
        })
        this.form.course_id = this.courseId
        this.$api.post('setSubTopic', this.form).then((res) => {
          if (res) {
            this.$q.loading.hide()
            this.$q.notify({
              color: 'positive',
              message: 'Sub Tema Creado Correctamente'
            })
            this.getSubTopics()
          }
        })
      }
    },
    deleteSubTopic (id) {
      this.$q.dialog({
        title: 'Confirma',
        message: '¿Seguro deseas eliminar este Sub Tema?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.$api.delete('deleteSubTopic/' + id).then(res => {
          if (res) {
            this.$q.notify({
              color: 'positive',
              message: 'Eliminado Correctamente'
            })
            this.getSubTopics()
          }
        })
      }).onCancel(() => {
        // console.log('>>>> Cancel')
      })
    },
    deleteAllSubTopics () {
      this.$q.dialog({
        title: 'Confirma',
        message: '¿Seguro deseas eliminar todos los Sub-Temas?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.$api.delete('deleteAllSubTopics').then(res => {
          if (res) {
            this.$q.notify({
              color: 'positive',
              message: 'Sub-Temas eliminados Correctamente'
            })
            this.getSubTopics()
          }
        })
      }).onCancel(() => {
        // console.log('>>>> Cancel')
      })
    },
    async getSubTopics () {
      this.$q.loading.show({
        message: 'Cargando datos...'
      })
      await this.$api.get('getSubTopicsByCourse/' + this.courseId).then(res => {
        if (res) {
          this.subTopics = res
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
        this.$api.post('excel_subTopic', formData, {
          headers: {
            'Content-Type': undefined
          }
        }).then(res => {
          if (res) {
            this.$q.notify({
              message: 'Sub Temas Cargados Correctamente',
              color: 'positive'
            })
            this.file = null
            this.getSubTopics()
          }
          this.$q.loading.hide()
        })
      }
    },
    execute (emit) {
      if (emit.title === 'Eliminar') {
        this.deleteSubTopic(emit.id)
      } else if (emit.title === 'Editar') {
        this.getTopics()
        this.getSubTopicById(emit.id)
        this.editSubTopic = true
        this.show = true
      }
    },
    async getSubTopicById (id) {
      await this.$api.get('getSubTopicById/' + id).then(res => {
        if (res) {
          this.form = res
        }
      })
    },
    newSubTopic () {
      this.getTopics()
      this.editSubTopic = false
      this.form = {}
      this.show = true
    }
  }
}
</script>
