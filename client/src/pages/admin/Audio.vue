<template>
  <div>
    <div style="background: linear-gradient(to right, #002938, #004e6d); height: 200px; width: 100%;"></div>
    <div class="column q-pa-lg no-wrap" style="margin-top: -200px">
      <div class="text-h4 text-white text-bold q-mb-xl q-px-xl">Audio</div>
      <div>
        <div class="text-h5 text-white q-mb-sm q-px-md">Audio recientes</div>
      </div>
      <q-btn color="primary" label="Nuevo Audio" icon="add" dense no-caps size="md" class="q-ml-md" @click="newAudio()"/>
    </div>
    <div class="row justify-center" style="height: 70%">
      <listable class="col" :columns="columns" :data="audios" title="Audios" @function="execute"/>
    </div>
    <q-dialog v-model="show" @hide="decartarCamb()">
      <q-card style="border-radius: 20px; width: 80%">
        <q-card-section>
          <div class="text-h6">{{editAudio ? 'Editar Audio' : 'Crear Audio'}}</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-file dense outlined label="Sube el archivo" v-model="file" accept="audio/*" style="width: 100%; height: 100%;" @blur="$v.file.$touch()" :error="$v.file.$error">
            <template v-slot:prepend>
              <q-icon name="headphones" color="primary"/>
            </template>
          </q-file>
          <q-input dense outlined type="text" v-model="form.title" label="Titulo del audio" :error="$v.form.title.$error" error-message="Este campo es requerido"  @blur="$v.form.title.$touch()">
            <template v-slot:prepend>
              <q-icon name="edit" color="primary"/>
            </template>
          </q-input>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" v-close-popup @click="decartarCamb()" no-caps/>
          <q-btn flat :label="editAudio ? 'Actualizar' :  'Crear'" color="primary" @click="editAudio ? updateAudio() : setAudio()" no-caps/>
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
      editAudio: false,
      form: {},
      audios: [],
      file: null,
      columns: [
        { name: 'title', label: 'Título', align: 'left', field: 'title' },
        { name: 'actions', required: true, align: 'left', field: 'actions', style: 'width: 9%' }
      ],
      show: false,
      topic: { required }
    }
  },
  validations: {
    form: {
      title: { required }
    },
    file: { required }
  },
  mounted () {
    this.courseId = localStorage.getItem('course_id')
    this.getAudios()
  },
  methods: {
    updateAudio () {
      this.$v.form.$touch()
      if (!this.$v.form.$error) {
        this.$q.loading.show({
          message: 'Actualizando Audio, Por Favor Espere...'
        })
        const formData = new FormData()
        formData.append('audio', this.file)
        formData.append('data', JSON.stringify(this.form))
        this.$api.put('updateAudio/' + this.form._id, formData, {
          headers: {
            'Content-Type': undefined
          }
        }).then((res) => {
          if (res) {
            this.$q.loading.hide()
            this.$q.notify({
              color: 'positive',
              message: 'Audio Actualizada Correctamente'
            })
            this.form = {}
            this.file = null
            this.textEdit = ''
            this.getAudios()
            this.show = false
          }
        })
      }
    },
    decartarCamb () {
      this.form = {}
      this.file = null
      this.edit = false
      this.$v.$reset()
    },
    setAudio () {
      this.$v.$touch()
      if (!this.$v.form.$error && !this.$v.file.$error) {
        this.$q.loading.show({
          message: 'Subiendo Audio, Por Favor Espere...'
        })
        this.form.course_id = this.courseId
        const formData = new FormData()
        formData.append('audio', this.file)
        formData.append('data', JSON.stringify(this.form))
        this.$api.post('/setAudio', formData, {
          headers: {
            'Content-Type': undefined
          }
        }).then((res) => {
          if (res) {
            this.$q.loading.hide()
            this.$q.notify({
              color: 'positive',
              message: 'Audio Creado Correctamente'
            })
            this.form = {}
            this.file = null
            this.textEdit = ''
            this.show = false
            this.getAudios()
          }
        })
      }
    },
    deleteAudio (id) {
      this.$q.dialog({
        title: 'Confirma',
        message: '¿Seguro deseas eliminar este Audio?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.$api.delete('deleteAudio/' + id).then(res => {
          if (res) {
            this.$q.notify({
              color: 'positive',
              message: 'Eliminado Correctamente'
            })
            this.getAudios()
          }
        })
      }).onCancel(() => {
        // console.log('>>>> Cancel')
      })
    },
    async getAudios () {
      this.$q.loading.show({
        message: 'Cargando datos...'
      })
      await this.$api.get('audiosByCourse/' + this.courseId).then(res => {
        if (res) {
          this.audios = res
          // console.log(this.audios)
        }
        this.$q.loading.hide()
      })
    },
    execute (emit) {
      if (emit.title === 'Eliminar') {
        this.deleteAudio(emit.id)
      } else if (emit.title === 'Editar') {
        this.getAudioById(emit.id)
        this.editAudio = true
        this.show = true
      }
    },
    async getAudioById (id) {
      await this.$api.get('audioById/' + id).then(res => {
        if (res) {
          this.form = res
        }
      })
    },
    newAudio () {
      this.editAudio = false
      this.form = {}
      this.show = true
    }
  }
}
</script>
