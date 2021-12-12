<template>
  <div>
    <div style="background: linear-gradient(to right, #002938, #004e6d); height: 200px; width: 100%;"></div>
    <div class="column q-pa-lg no-wrap" style="margin-top: -200px">
      <div class="text-h4 text-white text-bold q-mb-xl q-px-xl">Reporte de Fallos</div>
      <div>
        <div class="text-h5 text-white q-mb-sm q-px-md">Fallos recientes</div>
      </div>
    </div>
    <div class="row justify-center" style="height: 70%">
      <listable class="col" :columns="columns" :data="faults" title="Fallos" @function="execute"/>
    </div>
    <q-dialog v-model="show" style="with: 100%">
      <q-card style="border-radius: 20px;" class="q-pa-xl">
        <q-btn round dense flat class="q-mt-xs q-ml-xs absolute-top-left" icon="close" color="primary" @click="show = false"/>
        <q-card-section>
          <div class="text-h6 text-weight-bolder text-primary">{{question.title}}</div>
          <div class="text-weight-bold text-subtitle1 text-grey-10" v-for="(item, index) in question.answers" :key="index">
            <li class="row items-center">
              {{item.answer_name}}
              <q-icon name="check" size="sm" class="q-ml-xs" v-if="item.isCorrect === true" color="green"/>
            </li>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="show2">
      <q-card style="border-radius: 20px;" class="q-pa-lg">
        <q-btn round dense flat class="q-mt-xs q-ml-xs absolute-top-left" icon="close" color="primary" @click="show2 = false"/>
        <q-card-section>
          <q-avatar size="200px" class="bg-grey row justify-center">
            <q-img :src="baseu + user._id" style="height: 100%"/>
          </q-avatar>
          <div class="text-h4 text-weight-bolder text-center text-grey-10">{{user.name}}</div>
          <div class="row items-center">
            <q-icon class="q-mr-xs" size="sm" name="email" color="primary"/>
            <div class="text-h6 text-weight-light text-grey-10">{{user.email}}</div>
          </div>
          <div class="row items-center">
            <q-icon class="q-mr-xs" size="sm" name="location_city" color="primary"/>
            <div class="text-subtitle2 text-weight-normal text-grey-10">{{user.communityName}}</div>
          </div>
          <div class="row items-center">
            <q-icon class="q-mr-xs" size="sm" name="place" color="primary"/>
            <div class="text-subtitle1 text-weight-normal text-grey-10">{{user.placeName}}</div>
          </div>
        </q-card-section>
        <q-card-section class="q-pt-none">
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="show3" @hide="decartarCamb(), show3 = false">
      <q-card style="border-radius: 20px;">
        <q-card-section>
          <div class="text-h6">Editar pregunta</div>
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
        <q-card-actions align="left">
          <q-btn flat label="Cancelar" color="primary" v-close-popup @click="decartarCamb(), show3 = false" no-caps/>
          <q-btn flat label="Actualizar Pregunta" color="primary" v-close-popup @click="updateQuestion()" no-caps/>
        </q-card-actions>
        <q-card-section class="q-pt-none">
          <q-card class="text-weight-normal q-pa-sm q-my-xs" v-for="(item, index) in answers" :key="index">
            <div class="row items-center">
              {{item.answer_name}}
              <q-icon name="check" size="sm" class="q-ml-xs" v-if="item.isCorrect === true" color="green"/>
            </div>
            <q-btn label="Editar Respuesta" no-caps color="primary" flat @click="show3 = false, form2 = item, show4 = true"/>
          </q-card>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="show4" @hide="decartarCamb(), show4 = false">
      <q-card style="border-radius: 20px;">
        <q-card-section>
          <div class="text-h6">Editar Respuesta</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-input dense outlined type="text" v-model="form2.answer_name" label="Nueva Respuesta" :error="$v.form2.answer_name.$error" error-message="Este campo es requerido"  @blur="$v.form2.answer_name.$touch()">
          </q-input>
          <q-input dense outlined type="text" v-model="form2.order" label="Orden" :error="$v.form2.order.$error" error-message="Este campo es requerido"  @blur="$v.form2.order.$touch()">
          </q-input>
          <q-checkbox left-label v-model="form2.isCorrect" label="Respuesta correcta"/>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" v-close-popup @click="decartarCamb(), show4 = false" no-caps/>
          <q-btn flat label="Actualizar" color="primary" v-close-popup @click="updateAnswer()" no-caps/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import env from '../../env'
import Listable from '../../components/Listable.vue'
import { required, maxLength } from 'vuelidate/lib/validators'
export default {
  components: { Listable },
  data () {
    return {
      form: {},
      form2: {},
      faults: [],
      columns: [
        { name: 'questionButton', label: 'Pregunta', align: 'left', field: 'questionButton', style: 'width: 9%' },
        { name: 'userButton', label: 'Usuario', align: 'left', field: 'userButton', style: 'width: 9%' },
        { name: 'message', label: 'Mensaje', align: 'left', field: 'message' },
        {
          name: 'status',
          label: 'Estado',
          align: 'left',
          field: 'status'
        },
        { name: 'actions', required: true, align: 'left', field: 'actions', style: 'width: 9%' }
      ],
      show: false,
      show2: false,
      show3: false,
      show4: false,
      topic: { required },
      courseId: '',
      question: {},
      user: {},
      baseu: '',
      topics: [],
      laws: [],
      articles: [],
      paragraphs: [],
      types: [],
      answers: [],
      filter: {},
      questions: []
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
    },
    form2: {
      answer_name: { required },
      id_question: { required },
      isCorrect: { required },
      order: { required, maxLength: maxLength(1) }
    }
  },
  mounted () {
    this.baseu = env.apiUrl + 'perfil_img/'
    this.courseId = localStorage.getItem('course_id')
  },
  methods: {
    async getData () {
      this.$q.loading.show({
        message: 'Cargando datos...'
      })
      await this.getTopics()
      await this.getTypes()
      await this.getFaults()
      await this.getLaws()
      this.$q.loading.hide()
    },
    async getFaults () {
      this.$q.loading.show({
        message: 'Cargando datos...'
      })
      await this.$api.get('faultsByCourse/' + this.courseId).then(res => {
        if (res) {
          this.faults = res
        }
        this.$q.loading.hide()
      })
    },
    execute (emit) {
      if (emit.title === 'Pregunta') {
        this.question = emit.element
        this.show = true
      } else if (emit.title === 'Usuario') {
        this.user = emit.element
        this.show2 = true
      } else if (emit.title === 'Editar Pregunta') {
        this.getQuestionById(emit.element.question_id)
        this.show3 = true
      } else if (emit.title === 'Revisar') {
        this.checkFault(emit.id)
      }
    },
    checkFault (id) {
      this.$q.dialog({
        title: 'Confirma',
        message: '¿Seguro deseas marcar como revisada esta falta?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.$api.put('checkFault/' + id).then(res => {
          if (res) {
            this.$q.notify({
              color: 'positive',
              message: 'Falta revisada correctamente'
            })
            this.getFaults()
          }
        })
      }).onCancel(() => {
        // console.log('>>>> Cancel')
      })
    },
    async getQuestionById (id) {
      await this.$api.get('getQuestionById/' + id).then(res => {
        if (res) {
          this.form = res
          this.getAnswers()
        }
      })
    },
    decartarCamb () {
      this.$v.$reset()
    },
    updateQuestion () {
      this.$v.form.$touch()
      if (!this.$v.form.$error) {
        this.$q.loading.show({
          message: 'Actualizando pregunta, Por Favor Espere...'
        })
        this.$api.put('updateQuest/' + this.form._id, this.form).then((res) => {
          if (res) {
            this.$q.loading.hide()
            this.$q.notify({
              color: 'positive',
              message: 'Pregunta Actualizada Correctamente'
            })
          }
        })
      }
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
    async getAnswers () {
      this.filter.question = this.form.id
      this.$q.loading.show({
        message: 'Cargando datos...'
      })
      await this.$api.post('getAnswersByFilter/' + this.courseId, this.filter).then(res => {
        if (res) {
          this.answers = res
          this.$q.loading.hide()
        }
      })
    },
    updateAnswer () {
      this.$v.form.$touch()
      if (!this.$v.form.$error) {
        this.$q.loading.show({
          message: 'Actualizando Respuesta, Por Favor Espere...'
        })
        this.$api.put('updateAnswer/' + this.form2._id, this.form2).then((res) => {
          if (res) {
            this.$q.loading.hide()
            this.$q.notify({
              color: 'positive',
              message: 'Respuesta Actualizada Correctamente'
            })
            this.getAnswers()
          }
        })
      }
    }
  }
}
</script>
