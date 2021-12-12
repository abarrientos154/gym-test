<template>
  <div>
    <div style="background: linear-gradient(to right, #002938, #004e6d); height: 200px; width: 100%;"></div>
    <div class="column q-pa-lg no-wrap" style="margin-top: -200px">
      <div class="text-h4 text-white text-bold q-mb-xl q-px-xl">Párrafos</div>
      <div>
        <div class="text-h5 text-white q-mb-sm q-px-md">Párrafos recientes</div>
      </div>
      <q-btn color="primary" dense no-caps size="md">
        <q-file borderless v-model="file" hint="(.xlsx)" accept=".xlsx, /*" @input="uploadFile()" style="height: 30px; font-size: 0px"/>
        <div class="absolute-center">Importar archivo</div>
      </q-btn>
    </div>
    <div class="row justify-between">
      <q-btn color="primary" label="Nuevo Párrafo" icon="add" dense no-caps size="md" class="q-ml-md" @click="newParagraph()"/>
      <q-btn color="red" label="Eliminar Párrafos" icon="delete" dense no-caps size="md" class="q-mr-md" @click="deleteAllParagraphs()"/>
    </div>
    <div class="row q-my-sm q-mx-md">
      <q-select style="min-width: 220px" class="q-mr-sm q-my-sm" outlined v-model="law" label="Escoga una ley" dense :options="laws" map-options emit-value option-value="id" options-selected-class="text-primary" option-label="law_name" @input="getArticlesByLaw(law)" clearable></q-select>
      <q-select style="min-width: 220px" class="q-mr-md q-my-sm" outlined v-model="article" label="Escoga un articulo" dense :options="articles" map-options emit-value option-value="id" options-selected-class="text-primary" option-label="article_name" @input="getParagraphs(true)" clearable>
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey">
              Primero escoge una ley
            </q-item-section>
          </q-item>
        </template>
      </q-select>
    </div>
    <div class="row justify-center" style="height: 70%">
      <listable class="col" :columns="columns" :data="paragraphs" title="Párrafos" @function="execute"/>
    </div>
    <q-dialog v-model="show" @hide="decartarCamb()">
      <q-card style="border-radius: 20px;">
        <q-card-section>
          <div class="text-h6">{{editParagraph ? 'Editar Párrafo' : 'Crear Párrafo'}}</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-select style="min-width: 220px" class="q-mr-sm q-my-sm" outlined v-model="law" label="Escoga una ley" dense :options="laws" map-options emit-value option-value="id" options-selected-class="text-primary" option-label="law_name" @input="getArticlesByLaw(law)" clearable></q-select>
          <q-select style="min-width: 220px" class="q-mr-md q-my-sm" outlined v-model="form.article_id" label="Escoga un articulo" dense :options="articles" map-options emit-value option-value="id" options-selected-class="text-primary" option-label="article_name" :error="$v.form.article_id.$error" error-message="Este campo es requerido"  @blur="$v.form.article_id.$touch()"  clearable>
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  Primero escoge una ley
                </q-item-section>
              </q-item>
            </template>
          </q-select>
          <q-input dense outlined type="text" v-model="form.paragraph_text" label="Nuevo Párrafo" :error="$v.form.paragraph_text.$error" error-message="Este campo es requerido"  @blur="$v.form.paragraph_text.$touch()">
          </q-input>
          <q-input dense outlined type="text" v-model="form.order" label="Orden" :error="$v.form.order.$error" error-message="Este campo es requerido"  @blur="$v.form.order.$touch()">
          </q-input>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" v-close-popup @click="decartarCamb()" no-caps/>
          <q-btn flat :label="editParagraph ? 'Actualizar' :  'Crear'" color="primary" v-close-popup @click="editParagraph ? updateParagraph() : setParagraph()" no-caps/>
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
      editParagraph: false,
      form: {},
      paragraphs: [],
      file: null,
      columns: [
        { name: 'id', label: 'ID', align: 'left', field: 'id' },
        { name: 'paragraph_text', label: 'Párrafo', align: 'left', field: 'paragraph_text' },
        { name: 'order', label: 'Orden', align: 'left', field: 'order' },
        { name: 'actions', required: true, align: 'left', field: 'actions', style: 'width: 9%' }
      ],
      show: false,
      courseId: '',
      filter: {},
      laws: [],
      articles: [],
      law: '',
      article: ''
    }
  },
  validations: {
    form: {
      paragraph_text: { required },
      order: { required },
      article_id: { required }
    }
  },
  mounted () {
    this.courseId = localStorage.getItem('course_id')
    this.getLaws()
  },
  methods: {
    async getLaws () {
      this.$q.loading.show({
        message: 'Cargando datos...'
      })
      await this.$api.get('getLawsByCourse/' + this.courseId).then(res => {
        if (res) {
          this.laws = res
          this.$q.loading.hide()
        }
      })
    },
    async getArticlesByLaw (id) {
      this.$q.loading.show({
        message: 'Cargando datos...'
      })
      await this.$api.get('getArticlesByLaw/' + id).then(res => {
        if (res) {
          this.articles = res
          this.$q.loading.hide()
        }
      })
    },
    updateParagraph () {
      this.$v.form.$touch()
      if (!this.$v.form.$error) {
        this.$q.loading.show({
          message: 'Actualizando Párrafo, Por Favor Espere...'
        })
        this.$api.put('updateParagraph/' + this.form._id, this.form).then((res) => {
          if (res) {
            this.$q.loading.hide()
            this.$q.notify({
              color: 'positive',
              message: 'Párrafo Actualizado Correctamente'
            })
            this.getParagraphs()
          }
        })
      }
    },
    decartarCamb () {
      this.form = {}
      this.show = false
    },
    setParagraph () {
      this.$v.$touch()
      if (!this.$v.form.$error) {
        this.$q.loading.show({
          message: 'Subiendo Párrafo, Por Favor Espere...'
        })
        this.form.course_id = this.courseId
        this.$api.post('setParagraph', this.form).then((res) => {
          if (res) {
            this.$q.loading.hide()
            this.$q.notify({
              color: 'positive',
              message: 'Párrafo Creado Correctamente'
            })
            this.getParagraphs()
          }
        })
      }
    },
    deleteParagraph (id) {
      this.$q.dialog({
        title: 'Confirma',
        message: '¿Seguro deseas eliminar este Párrafo?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.$api.delete('deleteParagraph/' + id).then(res => {
          if (res) {
            this.$q.notify({
              color: 'positive',
              message: 'Eliminado Correctamente'
            })
            this.getParagraphs()
          }
        })
      }).onCancel(() => {
        // console.log('>>>> Cancel')
      })
    },
    deleteAllParagraphs () {
      this.$q.dialog({
        title: 'Confirma',
        message: '¿Seguro deseas eliminar todos los Párrafos?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.$api.delete('deleteAllParagraphs').then(res => {
          if (res) {
            this.$q.notify({
              color: 'positive',
              message: 'Párrafos eliminados Correctamente'
            })
            this.$router.go()
          }
        })
      }).onCancel(() => {
        // console.log('>>>> Cancel')
      })
    },
    async getParagraphs (isFilter) {
      if (isFilter === true) {
        this.filter.article = this.article
      }
      this.$q.loading.show({
        message: 'Cargando datos...'
      })
      await this.$api.post('getParagraphsByFilter/' + this.courseId, this.filter).then(res => {
        if (res) {
          this.paragraphs = res
          this.$q.loading.hide()
        }
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
        this.$api.post('excel_paragraph', formData, {
          headers: {
            'Content-Type': undefined
          }
        }).then(res => {
          if (res) {
            this.$q.notify({
              message: 'Párrafos Cargados Correctamente',
              color: 'positive'
            })
            this.file = null
            // this.getArticles()
            this.$q.loading.hide()
          }
        })
      }
    },
    execute (emit) {
      if (emit.title === 'Eliminar') {
        this.deleteParagraph(emit.id)
      } else if (emit.title === 'Editar') {
        this.getParagraphById(emit.id)
        this.editParagraph = true
        this.show = true
      }
    },
    async getParagraphById (id) {
      await this.$api.get('getParagraphById/' + id).then(res => {
        if (res) {
          this.form = res
        }
      })
    },
    newParagraph () {
      this.editParagraph = false
      this.form = {}
      this.show = true
    }
  }
}
</script>
