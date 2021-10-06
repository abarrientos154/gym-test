<template>
  <div>
    <div style="background: linear-gradient(to right, #002938, #004e6d); height: 200px; width: 100%;"></div>
    <!-- <q-img src="noimg.png" style="border-bottom-left-radius: 10px; border-bottom-right-radius: 10px; height: 265px; width: 100%;"/> -->
    <div class="column q-pa-lg no-wrap" style="margin-top: -200px">
      <div class="text-h4 text-white text-bold q-mb-xl q-px-xl">Noticias</div>
      <div>
        <div class="text-h5 text-white q-mb-sm q-px-md">Noticias recientes</div>
      </div>
      <q-btn color="primary" label="Nueva Noticia" icon="add" dense no-caps size="md" class="q-ml-md" @click="newNews()"/>
    </div>
    <q-card class="row q-pa-sm q-ma-sm bg-grey-2" style="width: 90%" v-for="(item, index) in news" :key="index">
      <q-avatar square size="100px" >
        <img style="width: 100%" :src="item.image ? baseu + item.image : 'noimg.png'" spinner-color="white">
      </q-avatar>
      <div class="q-ml-md q-mt-sm" style="width: 80%">
        <div>{{item.title}}</div>
        <div v-html="item.text" class="ellipsis-3-lines"></div>
      </div>
      <div class="q-mt-sm row absolute-top-right">
        <q-btn color="primary" flat icon="edit" @click="setEditNews(item)"/>
        <q-btn color="primary" flat icon="delete" @click="deleteNews(item._id)"/>
      </div>
    </q-card>
    <q-dialog v-model="show" @hide="decartarCamb()">
      <q-card style="border-radius: 20px; width: 80%">
        <q-card-section>
          <div class="text-h6">{{edit ? 'Editar Noticia' : 'Crear Noticia'}}</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-avatar square size="200px" style="width: 100%" class="bg-grey row justify-center">
            <q-img :src="file ? imgFile : edit ? baseu + form.image : ''" style="height: 100%">
              <q-file borderless v-model="file" @input="test()" accept=".jpg, image/*" style="width: 100%; height: 100%; font-size: 0px" @blur="$v.file.$touch()">
                <q-icon name="image" size="50px" color="white" />
              </q-file>
            </q-img>
          </q-avatar>
          <div :class="$v.file.$error ? 'text-negative' : ''" class="q-my-sm">Sube la portada de la noticia</div>
          <q-input dense outlined type="text" v-model="form.title" label="Titulo de la Noticia" :error="$v.form.title.$error" error-message="Este campo es requerido"  @blur="$v.form.title.$touch()">
            <template v-slot:prepend>
              <q-icon name="edit" color="primary"/>
            </template>
          </q-input>
          <div :class="isWrittren === false ? 'text-negative' : ''">Debes redactar la Noticia</div>
          <div class="">
            <q-editor v-model="textEdit" style="width: 100%" min-height="5rem"/>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" v-close-popup @click="decartarCamb()" no-caps/>
          <q-btn flat :label="edit ? 'Actualizar' :  'Crear'" color="primary" @click="edit ? updateNews() : setNews()" no-caps/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { required } from 'vuelidate/lib/validators'
import env from '../../env'
export default {
  data () {
    return {
      edit: false,
      form: {},
      news: [],
      file: null,
      show: false,
      textEdit: '',
      courseId: '',
      imgFile: '',
      baseu: '',
      isWrittren: null
    }
  },
  validations: {
    form: {
      title: { required }
    },
    file: { required }
  },
  mounted () {
    this.baseu = env.apiUrl + 'news_img/'
    this.courseId = localStorage.getItem('course_id')
    this.getNews()
  },
  methods: {
    updateNews () {
      if (this.textEdit !== '') {
        this.$v.form.$touch()
        if (!this.$v.form.$error) {
          this.$q.loading.show({
            message: 'Actualizando Noticia, Por Favor Espere...'
          })
          this.form.text = this.textEdit
          const formData = new FormData()
          formData.append('image', this.file)
          formData.append('data', JSON.stringify(this.form))
          this.$api.put('updateNews/' + this.form._id, formData, {
            headers: {
              'Content-Type': undefined
            }
          }).then((res) => {
            if (res) {
              this.$q.loading.hide()
              this.$q.notify({
                color: 'positive',
                message: 'Noticia Actualizada Correctamente'
              })
              this.getNews()
            }
          })
        }
      } else {
        this.isWrittren = false
      }
    },
    decartarCamb () {
      this.form = {}
      this.file = null
      this.edit = false
      this.$v.reset()
    },
    setNews () {
      if (this.textEdit !== '') {
        this.$v.$touch()
        if (!this.$v.form.$error && !this.$v.file.$error) {
          this.$q.loading.show({
            message: 'Subiendo Noticia, Por Favor Espere...'
          })
          this.form.text = this.textEdit
          this.form.course_id = this.courseId
          const formData = new FormData()
          formData.append('image', this.file)
          formData.append('data', JSON.stringify(this.form))
          this.$api.post('/setNews', formData, {
            headers: {
              'Content-Type': undefined
            }
          }).then((res) => {
            if (res) {
              this.$q.loading.hide()
              this.$q.notify({
                color: 'positive',
                message: 'Noticia Creada Correctamente'
              })
              this.form = {}
              this.file = null
              this.textEdit = ''
              this.show = false
              this.getNews()
            }
          })
        }
      } else {
        this.isWrittren = false
      }
    },
    deleteNews (id) {
      this.$q.dialog({
        title: 'Confirma',
        message: '¿Seguro deseas eliminar esta noticia?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.$api.delete('deleteNews/' + id).then(res => {
          if (res) {
            this.$q.notify({
              color: 'positive',
              message: 'Eliminado Correctamente'
            })
            this.getNews()
          }
        })
      }).onCancel(() => {
        // console.log('>>>> Cancel')
      })
    },
    getNews () {
      this.$q.loading.show({
        message: 'Cargando datos...'
      })
      this.$api.get('newsByCourse/' + this.courseId).then(res => {
        if (res) {
          this.news = res
          // console.log(this.News)
        }
        this.$q.loading.hide()
      })
    },
    newNews () {
      this.editType = false
      this.form = {}
      this.show = true
    },
    setEditNews (item) {
      this.form = item
      this.textEdit = item.text
      this.edit = true
      this.show = true
    },
    test () {
      if (this.file) { this.imgFile = URL.createObjectURL(this.file) }
    }
  }
}
</script>
