<template>
  <div>
    <div style="background: linear-gradient(to right, #002938, #004e6d); height: 200px; width: 100%;"></div>
    <!-- <q-img src="noimg.png" style="border-bottom-left-radius: 10px; border-bottom-right-radius: 10px; height: 265px; width: 100%;"/> -->
    <div class="column q-pa-lg no-wrap" style="margin-top: -200px">
      <div class="text-h4 text-white text-bold q-mb-xl q-px-xl">Articulos</div>
      <div>
        <div class="text-h5 text-white q-mb-sm q-px-md">Articulos recientes</div>
        <!-- <q-scroll-area horizontal style="height: 230px">
          <div class="full-width row no-wrap">
            <q-card class="q-mr-md column bordes" v-for="(item, index) in articles" :key="index" style="width: 260px; border-radius: 20px;">
              <q-img src="noimg.png" style="height: 130px"/>
              <q-card-section class="items-center" horizontal>
                <q-card-section class="ellipsis" style="width: 150px">
                  <div class="text-subtitle1 text-bold text-primary ellipsis">{{item.article_name}}</div>
                  <div class="text-subtitle2 text-grey">Gestion</div>
                </q-card-section>
                <q-card-section>
                  <div class="row no-wrap items-center">
                    <q-btn flat dense @click="editArticle(item)">
                      <q-img src="edit.png" style="height: 35px; width: 35px;"/>
                    </q-btn>
                    <q-btn flat dense @click="deleteArticle(item._id)">
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
      <q-btn color="primary" label="Nuevo Artículo" icon="add" dense no-caps size="md" class="q-ml-md" @click="newArticle()"/>
      <q-btn color="red" label="Eliminar Artículos" icon="delete" dense no-caps size="md" class="q-mr-md" @click="deleteAllArticles()"/>
    </div>
    <div class="row q-my-sm q-mx-md">
      <q-select style="min-width: 220px" class="q-mr-md" outlined v-model="law" label="Escoga una ley" dense :options="laws" map-options emit-value option-value="id" options-selected-class="text-primary" option-label="law_name" @input="getArticles(true)" clearable></q-select>
    </div>
    <div class="row justify-center" style="height: 70%">
      <listable class="col" :columns="columns" :data="articles" title="Artículos" @function="execute"/>
    </div>
    <q-dialog v-model="show" @hide="decartarCamb()">
      <q-card style="border-radius: 20px;">
        <q-card-section>
          <div class="text-h6">{{editArticle ? 'Editar Artículo' : 'Crear Artículo'}}</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-input dense outlined type="text" v-model="form.article_name" label="Nuevo Artículo" :error="$v.form.article_name.$error" error-message="Este campo es requerido"  @blur="$v.form.article_name.$touch()">
          </q-input>
          <q-select style="min-width: 220px" class="q-mr-md" outlined v-model="form.law" label="Escoga una ley" dense :options="laws" :error="$v.form.law.$error" error-message="Este campo es requerido"  @blur="$v.form.law.$touch()" map-options emit-value option-value="id" options-selected-class="text-primary" option-label="law_name" clearable></q-select>
          <q-input dense outlined type="text" v-model="form.sub_title" label="Sub Título" :error="$v.form.sub_title.$error" error-message="Este campo es requerido"  @blur="$v.form.sub_title.$touch()">
          </q-input>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" v-close-popup @click="decartarCamb()" no-caps/>
          <q-btn flat :label="editArticle ? 'Actualizar' :  'Crear'" color="primary" v-close-popup @click="editArticle ? updateArticle() : setArticle()" no-caps/>
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
      editArticle: false,
      form: {},
      articles: [],
      file: null,
      laws: [],
      columns: [
        { name: 'law', label: 'Ley', align: 'left', field: 'law' },
        { name: 'article_name', label: 'Nombre del Artículo', align: 'left', field: 'article_name' },
        { name: 'sub_title', align: 'left', label: 'Sub Título', field: 'sub_title' },
        { name: 'actions', required: true, align: 'left', field: 'actions', style: 'width: 9%' }
      ],
      show: false,
      filter: {},
      law: '',
      courseId: ''
    }
  },
  validations: {
    form: {
      article_name: { required },
      law: { required },
      sub_title: { required }
    }
  },
  mounted () {
    // this.getArticles()
    this.courseId = localStorage.getItem('course_id')
    this.getLaws()
  },
  methods: {
    async getLaws () {
      await this.$api.get('getLaws').then(res => {
        if (res) {
          this.laws = res
        }
      })
    },
    updateArticle () {
      this.$v.form.$touch()
      if (!this.$v.form.$error) {
        this.$q.loading.show({
          message: 'Actualizando Articulo, Por Favor Espere...'
        })
        this.$api.put('updateArticle/' + this.form._id, this.form).then((res) => {
          if (res) {
            this.$q.loading.hide()
            this.$q.notify({
              color: 'positive',
              message: 'Articulo Actualizada Correctamente'
            })
            this.getArticles()
          }
        })
      }
    },
    decartarCamb () {
      this.form = {}
      this.edit = false
    },
    setArticle () {
      this.$v.$touch()
      if (!this.$v.form.$error) {
        this.$q.loading.show({
          message: 'Subiendo Articulo, Por Favor Espere...'
        })
        this.form.course_id = this.courseId
        this.$api.post('setArticle', this.form).then((res) => {
          if (res) {
            this.$q.loading.hide()
            this.$q.notify({
              color: 'positive',
              message: 'Articulo Creado Correctamente'
            })
            this.getArticles()
          }
        })
      }
    },
    deleteArticle (id) {
      this.$q.dialog({
        title: 'Confirma',
        message: '¿Seguro deseas eliminar este articulo?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.$api.delete('deleteArticle/' + id).then(res => {
          if (res) {
            this.$q.notify({
              color: 'positive',
              message: 'Eliminado Correctamente'
            })
            this.getArticles()
          }
        })
      }).onCancel(() => {
        // console.log('>>>> Cancel')
      })
    },
    deleteAllArticles () {
      this.$q.dialog({
        title: 'Confirma',
        message: '¿Seguro deseas eliminar todos los Artículos con sus Párrafos?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.$api.delete('deleteAllArticles').then(res => {
          if (res) {
            this.$q.notify({
              color: 'positive',
              message: 'Artículos eliminados Correctamente'
            })
            this.getArticles()
          }
        })
      }).onCancel(() => {
        // console.log('>>>> Cancel')
      })
    },
    async getArticles (isFilter) {
      if (isFilter === true) {
        this.filter.law = this.law
      }
      this.$q.loading.show({
        message: 'Cargando datos...'
      })
      await this.$api.post('getArticlesByFilter/' + this.courseId, this.filter).then(res => {
        if (res) {
          this.articles = res
          // console.log(this.articles)
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
        this.$api.post('excel_article', formData, {
          headers: {
            'Content-Type': undefined
          }
        }).then(res => {
          if (res) {
            this.$q.notify({
              message: 'Articulos Cargados Correctamente',
              color: 'positive'
            })
            this.file = null
            this.getArticles()
          }
          this.$q.loading.hide()
        })
      }
    },
    execute (emit) {
      if (emit.title === 'Eliminar') {
        this.deleteArticle(emit.id)
      } else if (emit.title === 'Editar') {
        this.getArticleById(emit.id)
        this.editArticle = true
        this.show = true
      }
    },
    async getArticleById (id) {
      await this.$api.get('getArticleById/' + id).then(res => {
        if (res) {
          this.form = res
        }
      })
    },
    newArticle () {
      this.editArticle = false
      this.form = {}
      this.show = true
    }
  }
}
</script>
