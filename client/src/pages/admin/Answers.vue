<template>
  <div>
    <div style="background: linear-gradient(to right, #002938, #004e6d); height: 200px; width: 100%;"></div>
    <!-- <q-img src="noimg.png" style="border-bottom-left-radius: 10px; border-bottom-right-radius: 10px; height: 265px; width: 100%;"/> -->
    <div class="column q-pa-lg no-wrap" style="margin-top: -200px">
      <div class="text-h4 text-white text-bold q-mb-xl q-px-xl">Respuestas</div>
      <div>
        <div class="text-h5 text-white q-mb-sm q-px-md">Respuestas recientes</div>
        <!-- <q-scroll-area horizontal style="height: 230px">
          <div class="full-width row no-wrap">
            <q-card class="q-mr-md column bordes" v-for="(item, index) in answers" :key="index" style="width: 260px; border-radius: 20px;">
              <q-img src="noimg.png" style="height: 130px"/>
              <q-card-section class="items-center" horizontal>
                <q-card-section class="ellipsis" style="width: 150px">
                  <div class="text-subtitle1 text-bold text-primary ellipsis">{{item.answer_name}}</div>
                  <div class="text-subtitle2 text-grey">Gestion</div>
                </q-card-section>
                <q-card-section>
                  <div class="row no-wrap items-center">
                    <q-btn flat dense @click="editAnswer(item)">
                      <q-img src="edit.png" style="height: 35px; width: 35px;"/>
                    </q-btn>
                    <q-btn flat dense @click="deleteAnswer(item._id)">
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
    <!-- <q-btn color="primary" label="Nueva Respuesta" icon="add" dense no-caps size="md" class="q-ml-md" @click="newAnswer()"/> -->
    <div class="row q-my-sm q-mx-md">
      <q-select style="min-width: 220px" class="q-mr-sm q-my-sm" outlined v-model="topic" label="Escoga un tema" dense :options="topics" map-options emit-value option-value="topic" options-selected-class="text-primary" option-label="topic" @input="getQuestionsByTopic(topic)" clearable></q-select>
      <q-select style="min-width: 220px" class="q-mr-md q-my-sm" outlined v-model="question" label="Escoga una pregunta" dense :options="questions" map-options emit-value option-value="id" options-selected-class="text-primary" option-label="title" @input="getAnswers(true)" clearable>
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey">
              Primero escoge un Tema
            </q-item-section>
          </q-item>
        </template>
      </q-select>
    </div>
    <div class="row justify-center" style="height: 70%">
      <listable class="col" :columns="columns" :data="answers" title="Respuestas" @function="execute"/>
    </div>
    <q-dialog v-model="show" @hide="decartarCamb()">
      <q-card style="border-radius: 20px;">
        <q-card-section>
          <div class="text-h6">{{editAnswer ? 'Editar Respuesta' : 'Crear Respuesta'}}</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-select style="min-width: 220px" class="q-mr-md" outlined v-model="form.id_question" label="Escoga una pregunta" dense :options="questions" :error="$v.form.id_question.$error" error-message="Este campo es requerido"  @blur="$v.form.id_question.$touch()" map-options emit-value option-value="id" options-selected-class="text-primary" option-label="title" clearable>
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  Primero escoge un Tema
                </q-item-section>
              </q-item>
            </template>
          </q-select>
          <q-input dense outlined type="text" v-model="form.answer_name" label="Nueva Respuesta" :error="$v.form.answer_name.$error" error-message="Este campo es requerido"  @blur="$v.form.answer_name.$touch()">
          </q-input>
          <q-input dense outlined type="text" v-model="form.order" label="Orden" :error="$v.form.order.$error" error-message="Este campo es requerido"  @blur="$v.form.order.$touch()">
          </q-input>
          <q-checkbox left-label v-model="form.isCorrect" label="Respuesta correcta" :error="$v.form.isCorrect.$error" error-message="Este campo es requerido"  @blur="$v.form.isCorrect.$touch()"/>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" v-close-popup @click="decartarCamb()" no-caps/>
          <q-btn flat :label="editAnswer ? 'Actualizar' :  'Crear'" color="primary" v-close-popup @click="editAnswer ? updateAnswer() : setAnswer()" no-caps/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import Listable from '../../components/Listable.vue'
import { required, maxLength } from 'vuelidate/lib/validators'
export default {
  components: { Listable },
  data () {
    return {
      editAnswer: false,
      nuevo: false,
      form: {},
      answers: [],
      file: null,
      questions: [],
      columns: [
        { name: 'id', label: 'ID', align: 'left', field: 'id' },
        { name: 'id_question', label: '# de Pregunta', align: 'left', field: 'id_question' },
        { name: 'answer_name', label: 'Respuesta', align: 'left', field: 'answer_name' },
        {
          name: 'isCorrectL',
          align: 'left',
          label: 'Correcta',
          field: 'isCorrectL'/* ,
          format: (val) => {
            if (val === true) {
              val = 'Si'
            } else {
              val = 'No'
            }
          } */
        },
        { name: 'order', label: 'Orden', align: 'left', field: 'order' },
        { name: 'actions', required: true, align: 'left', field: 'actions', style: 'width: 9%' }
      ],
      show: false,
      filter: {},
      question: '',
      topic: '',
      topics: [],
      options: this.questions,
      courseId: ''
    }
  },
  validations: {
    form: {
      answer_name: { required },
      id_question: { required },
      isCorrect: { required },
      order: { required, maxLength: maxLength(1) }
    }
  },
  mounted () {
    // this.getAnswers()
    this.courseId = localStorage.getItem('course_id')
    this.getTopics()
  },
  methods: {
    async getTopics () {
      await this.$api.get('getTopics').then(res => {
        if (res) {
          this.topics = res
        }
      })
    },
    async getQuestionsByTopic (topic) {
      await this.$api.get('getQuestionsByTopic/' + topic).then(res => {
        if (res) {
          this.questions = res
        }
      })
    },
    updateAnswer () {
      this.$v.form.$touch()
      if (!this.$v.form.$error) {
        this.$q.loading.show({
          message: 'Actualizando Respuesta, Por Favor Espere...'
        })
        this.$api.put('updateAnswer/' + this.form._id, this.form).then((res) => {
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
    },
    decartarCamb () {
      this.form = {}
      this.edit = false
    },
    setAnswer () {
      this.$v.$touch()
      if (!this.$v.form.$error) {
        this.$q.loading.show({
          message: 'Subiendo ley, Por Favor Espere...'
        })
        this.form.course_id = this.courseId
        this.$api.post('setAnswer', this.form).then((res) => {
          if (res) {
            this.$q.loading.hide()
            this.$q.notify({
              color: 'positive',
              message: 'Respuesta Creada Correctamente'
            })
            this.getAnswers()
          }
        })
      }
    },
    deleteAnswer (id) {
      this.$q.dialog({
        title: 'Confirma',
        message: '¿Seguro deseas eliminar esta Respuesta?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.$api.delete('deleteAnswer/' + id).then(res => {
          if (res) {
            this.$q.notify({
              color: 'positive',
              message: 'Eliminado Correctamente'
            })
            this.getAnswers()
          }
        })
      }).onCancel(() => {
        // console.log('>>>> Cancel')
      })
    },
    async getAnswers (isFilter) {
      if (isFilter === true) {
        this.filter.question = this.question
      }
      this.$q.loading.show({
        message: 'Cargando datos...'
      })
      await this.$api.post('getAnswersByFilter/' + this.courseId, this.filter).then(res => {
        if (res) {
          this.answers = res
          // console.log(this.answers)
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
        this.$api.post('excel_answer', formData, {
          headers: {
            'Content-Type': undefined
          }
        }).then(res => {
          if (res) {
            this.$q.notify({
              message: 'Respuestas Cargadas Correctamente',
              color: 'positive'
            })
            this.file = null
            this.getAnswers()
            this.$q.loading.hide()
          }
        })
      }
    },
    execute (emit) {
      if (emit.title === 'Eliminar') {
        this.deleteAnswer(emit.id)
      } else if (emit.title === 'Editar') {
        this.getAnswerById(emit.id)
        this.editAnswer = true
        this.show = true
      }
    },
    async getAnswerById (id) {
      await this.$api.get('getAnswerById/' + id).then(res => {
        if (res) {
          this.form = res
        }
      })
    },
    newAnswer () {
      this.editAnswer = false
      this.form = {}
      this.show = true
    }
  }
}
</script>
