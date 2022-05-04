<template>
  <div>
    <div style="background: linear-gradient(to right, #002938, #004e6d); height: 200px; width: 100%;"></div>
    <!-- <q-img src="noimg.png" style="border-bottom-left-radius: 10px; border-bottom-right-radius: 10px; height: 265px; width: 100%;"/> -->
    <div class="column q-pa-lg no-wrap" style="margin-top: -200px">
      <div class="text-h4 text-white text-bold q-mb-xl q-px-xl">Foro</div>
      <div>
        <div class="text-h5 text-white q-mb-sm q-px-md">Listado de Foros creados</div>
      </div>
      <q-btn color="primary" label="Nuevo Foro" icon="add" dense no-caps size="md" class="q-ml-md" @click="newForum()"/>
    </div>
    <q-card class="row q-pa-sm q-ma-sm bg-grey-2" style="width: 90%" v-for="(item, index) in forums" :key="index">
      <q-avatar square size="100px" >
        <img style="width: 100%" :src="'noimg.png'" spinner-color="white">
      </q-avatar>
      <div class="q-ml-md q-mt-sm" style="width: 80%">
        <div>{{item.title}}</div>
        <div v-html="item.text" class="ellipsis-3-lines"></div>
      </div>
      <div class="q-mt-sm row absolute-top-right">
        <q-btn color="primary" flat icon="edit" @click="setEditForum(item)"/>
        <q-btn color="primary" flat icon="delete" @click="deleteForum(item._id)"/>
      </div>
    </q-card>
    <q-dialog v-model="show" @hide="decartarCamb()">
      <q-card style="border-radius: 20px; width: 80%">
        <q-card-section>
          <div class="text-h6">{{edit ? 'Editar Foro' : 'Crear Foro'}}</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-input dense outlined type="text" v-model="form.title" label="Titulo del Foro" :error="$v.form.title.$error" error-message="Este campo es requerido"  @blur="$v.form.title.$touch()">
            <template v-slot:prepend>
              <q-icon name="edit" color="primary"/>
            </template>
          </q-input>
          <div :class="isWrittren === false ? 'text-negative' : ''">Debes redactar el Foro</div>
          <div class="">
            <q-editor v-model="textEdit" style="width: 100%" min-height="5rem"/>
          </div>
           <q-checkbox
            left-label
            v-model="form.question"
            label="Permitir Preguntas"
            checked-icon="task_alt"
            unchecked-icon="highlight_off"
            />
            <q-checkbox
            v-if="form.question"
            left-label
            v-model="form.response"
            label="Permitir Respuestas"
            checked-icon="task_alt"
            unchecked-icon="highlight_off"
            />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" v-close-popup @click="decartarCamb()" no-caps/>
          <q-btn flat :label="edit ? 'Actualizar' :  'Crear'" color="primary" @click="edit ? updateForum() : setForum()" no-caps/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { required } from 'vuelidate/lib/validators'
export default {
  data () {
    return {
      edit: false,
      form: {},
      forums: [],
      show: false,
      textEdit: '',
      courseId: '',
      isWrittren: null
    }
  },
  validations: {
    form: {
      title: { required }
    }
  },
  mounted () {
    this.courseId = localStorage.getItem('course_id')
    this.getForum()
  },
  methods: {
    updateForum () {
      if (this.textEdit !== '') {
        this.$v.form.$touch()
        if (!this.$v.form.$error) {
          this.$q.loading.show({
            message: 'Actualizando Noticia, Por Favor Espere...'
          })
          this.form.text = this.textEdit
          this.$api.put('updateForum/' + this.form._id, this.form).then((res) => {
            if (res) {
              this.$q.loading.hide()
              this.$q.notify({
                color: 'positive',
                message: 'Foro Actualizado Correctamente'
              })
              this.form = {}
              this.textEdit = ''
              this.getForum()
              this.show = false
            }
          })
        }
      } else {
        this.isWrittren = false
      }
    },
    decartarCamb () {
      this.form = {}
      this.textEdit = ''
      this.edit = false
      this.$v.$reset()
    },
    setForum () {
      if (this.textEdit !== '') {
        this.$v.$touch()
        if (!this.$v.form.$error) {
          this.$q.loading.show({
            message: 'Subiendo Foro, Por Favor Espere...'
          })
          this.form.text = this.textEdit
          this.form.course_id = this.courseId
          this.$api.post('/setForum', this.form).then((res) => {
            if (res) {
              this.$q.loading.hide()
              this.$q.notify({
                color: 'positive',
                message: 'Foro Creado Correctamente'
              })
              this.form = {}
              this.textEdit = ''
              this.show = false
              this.getForum()
            }
          })
        }
      } else {
        this.isWrittren = false
      }
    },
    deleteForum (id) {
      this.$q.dialog({
        title: 'Confirmar',
        message: '¿Seguro deseas eliminar este foro?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.$api.delete('deleteForum/' + id).then(res => {
          if (res) {
            this.$q.notify({
              color: 'positive',
              message: 'Eliminado Correctamente'
            })
            this.getForum()
          }
        })
      }).onCancel(() => {
        // console.log('>>>> Cancel')
      })
    },
    async getForum () {
      this.$q.loading.show({
        message: 'Cargando datos...'
      })
      await this.$api.get('forumByCourse/' + this.courseId).then(res => {
        if (res) {
          this.forums = res
          this.$q.loading.hide()
        } else {
          this.$q.loading.hide()
          this.$q.notify({
            color: 'negative',
            message: 'Error al consultar datos'
          })
        }
      })
    },
    newForum () {
      this.editType = false
      this.form = {
        question: false,
        response: false
      }
      this.show = true
    },
    setEditForum (item) {
      this.form = item
      this.textEdit = item.text
      this.edit = true
      this.show = true
    }
  }
}
</script>
