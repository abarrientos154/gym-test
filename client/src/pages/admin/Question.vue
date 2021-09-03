<template>
  <div>
    <div style="background: linear-gradient(to right, #002938, #004e6d); height: 200px; width: 100%;"></div>
    <div class="column q-pa-lg no-wrap" style="margin-top: -200px">
      <div class="text-h4 text-white text-bold q-mb-xl q-px-xl">Preguntas</div>
      <div class="text-h5 text-white q-mb-sm q-px-md">Preguntas recientes</div>
      <div class="column">
        <!-- <q-scroll-area horizontal style="height: 280px;">
          <div class="full-width row no-wrap">
            <q-card class="q-mr-md column bordes" v-for="(item, index) in questions" :key="index" style="min-width: 275px; max-width: 400px">
              <q-card-section class="col" horizontal>
                <q-card-section class="col column justify-between">
                  <div class="text-subtitle1 text-bold text-primary" style="min-width: 275px; max-width: 400px">{{item.title}}</div>
                  <div class="column justify-between">
                    <div class="row items-center text-grey">
                      <q-icon size="20px" name="date_range" class="q-mr-xs"/>
                      <div>{{item.topic}}</div>
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
                <q-card-section class="column" style="width: 90px">
                  <div class="col column items-center justify-around">
                    <q-btn flat dense>
                      <q-img src="visibility.png" style="height: 25px; width: 35px;"/>
                    </q-btn>
                    <q-btn flat dense @click="editQuestion(item)">
                      <q-img src="edit.png" style="height: 30px; width: 30px;"/>
                    </q-btn>
                    <q-btn flat dense @click="eiminarQuestion(item._id)">
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
    <q-btn color="primary" label="Nueva Pregunta" icon="add" dense no-caps size="md" class="q-ml-md" @click="newQuest()"/>
    <div class="row justify-center" style="height: 70%">
      <listable class="col" :columns="columns" :data="questions" title="Preguntas" @function="execute"/>
    </div>
    <!-- <q-dialog v-model="nuevo" @hide="decartarCamb()">
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
          <q-btn flat :label="edit ? 'Actualizar' :  'Crear'" color="primary" v-close-popup @click="edit ? actualizarQuestion() : nuevo ? crearQuestion() : ''" no-caps/>
        </q-card-actions>
      </q-card>
    </q-dialog> -->
    <q-dialog v-model="show" @hide="decartarCamb()">
      <q-card style="border-radius: 20px;">
        <q-card-section>
          <div class="text-h6">{{editQuestion ? 'Editar pregunta' : 'Crear pregunta'}}</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-input dense outlined type="text" v-model="form.title" label="Nueva pregunta" :error="$v.form.title.$error" error-message="Este campo es requerido"  @blur="$v.form.title.$touch()">
          </q-input>
          <q-select style="min-width: 220px" class="q-mr-md" outlined v-model="form.topic" label="Escoga un tema" dense :options="topics" :error="$v.form.topic.$error" error-message="Este campo es requerido"  @blur="$v.form.topic.$touch()" map-options emit-value option-value="topic" options-selected-class="text-primary" option-label="topic" clearable></q-select>
          <q-select style="min-width: 220px" class="q-mr-md" outlined v-model="form.law_id" label="Escoga una ley" dense :options="laws" :error="$v.form.law_id.$error" error-message="Este campo es requerido"  @blur="$v.form.law_id.$touch()" map-options emit-value option-value="id" options-selected-class="text-primary" option-label="law_name" @input="getArticlesByLaw(form.law_id)" clearable></q-select>
          <q-select style="min-width: 220px" class="q-mr-md" outlined v-model="form.article" label="Escoga un Articulo" dense :options="articles" :error="$v.form.article.$error" error-message="Este campo es requerido"  @blur="$v.form.article.$touch()" map-options emit-value option-value="article_name" options-selected-class="text-primary" option-label="article_name" @input="getParagraphsByLawAndArticle(form.law_id, form.article)" clearable></q-select>
          <q-select style="min-width: 220px" class="q-mr-md" outlined v-model="form.paragraph_id" label="Escoga un Parrafo" dense :options="paragraphs" :error="$v.form.paragraph_id.$error" error-message="Este campo es requerido"  @blur="$v.form.paragraph_id.$touch()" map-options emit-value option-value="_id" options-selected-class="text-primary" option-label="paragraph_text" clearable></q-select>
          <q-select style="min-width: 220px" class="q-mr-md" outlined v-model="form.type" label="Escoga un Tipo" dense :options="types" :error="$v.form.type.$error" error-message="Este campo es requerido"  @blur="$v.form.type.$touch()" map-options emit-value option-value="type_name" options-selected-class="text-primary" option-label="type_name" clearable></q-select>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" v-close-popup @click="decartarCamb()" no-caps/>
          <q-btn flat :label="editQuestion ? 'Actualizar' :  'Crear'" color="primary" v-close-popup @click="editQuestion ? updateQuestion() : setQuestion()" no-caps/>
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
      questions: [],
      file: null,
      columns: [
        { name: 'title', label: 'Título', align: 'left', field: 'title' },
        { name: 'lawName', label: 'Ley', align: 'left', field: 'lawName' },
        { name: 'topic', align: 'left', label: 'Tema', field: 'topic' },
        { name: 'article', label: 'Articulo', field: 'article' },
        { name: 'type', label: 'Tipo', field: 'type' },
        { name: 'actions', required: true, align: 'left', field: 'actions', style: 'width: 9%' }
      ],
      show: false,
      editQuestion: false,
      topics: [],
      laws: [],
      articles: [],
      paragraphs: [],
      types: []
    }
  },
  validations: {
    form: {
      title: { required },
      topic: { required },
      law_id: { required },
      article: { required },
      paragraph_id: { required },
      type: { required }
    }
  },
  mounted () {
    this.getQuestions()
  },
  methods: {
    getData () {
      this.$q.loading.show({
        message: 'Cargando datos...'
      })
      this.getTopics()
      this.getLaws()
      this.getTypes()
      if (this.topics !== [] && this.laws !== []) {
        this.$q.loading.hide()
      }
    },
    async getQuestions (val) {
      this.$q.loading.show({
        message: 'Cargando datos...'
      })
      await this.$api.get('getQuestions').then(res => {
        if (res) {
          this.questions = res
          if (val && val === 'set') {
            this.$q.notify({
              color: 'positive',
              message: 'Pregunta Creada Correctamente'
            })
          } else if (val && val === 'update') {
            this.$q.notify({
              color: 'positive',
              message: 'Pregunta Actualizada Correctamente'
            })
          }
          this.$q.loading.hide()
        }
      })
    },
    async getQuestionById (id) {
      await this.$api.get('getQuestionById/' + id).then(res => {
        if (res) {
          this.form = res
        }
      })
    },
    async getTopics () {
      await this.$api.get('getTopics').then(res => {
        if (res) {
          this.topics = res
        }
      })
    },
    async getLaws () {
      await this.$api.get('getLaws').then(res => {
        if (res) {
          this.laws = res
        }
      })
    },
    async getArticlesByLaw (id) {
      await this.$api.get('getArticlesByLaw/' + id).then(res => {
        if (res) {
          this.articles = res
        }
      })
    },
    async getParagraphsByLawAndArticle (law, article) {
      const filterArticle = this.articles.filter(res => res.law === law && res.article_name === article)
      await this.$api.get('getParagraphsByArticle/' + filterArticle[0]._id).then(res => {
        if (res) {
          this.paragraphs = res
        }
      })
    },
    async getTypes () {
      await this.$api.get('types').then(res => {
        if (res) {
          this.types = res
        }
      })
    },
    updateQuestion () {
      this.$v.form.$touch()
      if (!this.$v.form.$error) {
        this.$api.put('updateQuest/' + this.form._id, this.form).then((res) => {
          if (res) {
            this.getQuestions('update')
          }
        })
      }
    },
    decartarCamb () {
      this.form = {}
      this.edit = false
    },
    /* editQuestion (itm) {
      if (itm) {
        const datos = { ...itm }
        this.form = datos
        this.nuevo = true
        this.edit = true
      } else {
        this.nuevo = true
      }
    }, */
    setQuestion () {
      this.$v.$touch()
      if (!this.$v.form.$error) {
        this.$api.post('newQuest', this.form).then((res) => {
          if (res) {
            this.getQuestions('set')
          }
        })
      }
    },
    deleteQuestion (id) {
      this.$q.dialog({
        title: 'Confirma',
        message: '¿Seguro deseas eliminar esta pregunta?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.$api.delete('destroyQuest/' + id).then(res => {
          if (res) {
            this.$q.notify({
              color: 'positive',
              message: 'Eliminado Correctamente'
            })
            this.getQuestions()
          }
        })
      }).onCancel(() => {
      })
    },
    changeFile () {
      if (this.file !== null) {
        this.$q.loading.show({
          message: 'Subiendo datos, esto puede tomar un tiempo...'
        })
        const formData = new FormData()
        formData.append('fileExcel', this.file)
        this.$api.post('excel_question', formData, {
          headers: {
            'Content-Type': undefined
          }
        }).then(res => {
          if (res) {
            this.$q.notify({
              message: 'Preguntas Cargadas Correctamente',
              color: 'positive'
            })
            this.file = null
            this.getQuestions()
          }
          this.$q.loading.hide()
        })
      }
    },
    execute (emit) {
      if (emit.title === 'Eliminar') {
        this.deleteQuestion(emit.id)
      } else if (emit.title === 'Editar') {
        this.getData()
        this.getQuestionById(emit.id)
        this.editQuestion = true
        this.show = true
      }
    },
    newQuest () {
      this.getData()
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
