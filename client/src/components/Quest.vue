<template>
  <div>
    <q-card class="column q-pa-md">
      <div v-if="edit" class="text-h6">Editar Pregunta</div>
      <div v-else class="text-h6">Nueva Pregunta</div>
      <div class="column items-center q-pb-sm">
        <q-avatar size="100px" class="bg-grey-5">
          <q-img :src="edit ? imgQuest : questFile ? imgQuest : ''" style="height: 100%">
            <q-file borderless v-model="questFile" @input="changeFile()" accept=".jpg, image/*" style="width: 100%; height: 100%; font-size: 0px">
              <q-icon name="cloud_upload" class="absolute-center q-mt-lg" size="45px" color="white" />
            </q-file>
          </q-img>
        </q-avatar>
        <div :class="$v.questFile.$error ? 'text-negative' : 'text-grey-9'">Imagen de la pregunta</div>
      </div>
      <div class="q-my-sm">
        <q-input outlined v-model="quest.question" label="Introduzca la pregunta:" dense :error="$v.quest.question.$error" error-message="Este campo es requerido"  @blur="$v.quest.question.$touch()"/>
      </div>
      <div class="text-subtitle-1">Opciones:</div>
      <div class="row q-mb-sm">
        <q-input class="q-mr-md" outlined v-model="answers.optionA" label="Opción A:" dense :error="$v.answers.optionA.$error" error-message="Este campo es requerido"  @blur="$v.answers.optionA.$touch()"/>
        <q-input outlined v-model="answers.optionB" label="Opción B:" dense :error="$v.answers.optionB.$error" error-message="Este campo es requerido"  @blur="$v.answers.optionB.$touch()"/>
      </div>
      <div class="row q-mb-sm">
        <q-input class="q-mr-md" outlined v-model="answers.optionC" label="Opción C:" dense :error="$v.answers.optionC.$error" error-message="Este campo es requerido"  @blur="$v.answers.optionC.$touch()"/>
        <q-input outlined v-model="answers.optionD" label="Opción D:" dense :error="$v.answers.optionD.$error" error-message="Este campo es requerido"  @blur="$v.answers.optionD.$touch()"/>
      </div>
      <div class="text-subtitle-1">Respuesta correcta:</div>
      <div class="row q-gutter-sm">
        <q-radio class="col" v-model="quest.result" val="A" label="Opción A" />
        <q-radio class="col" v-model="quest.result" val="B" label="Opción B" />
      </div>
      <div class="row q-gutter-sm q-mb-sm">
        <q-radio class="col" v-model="quest.result" val="C" label="Opción C" />
        <q-radio class="col" v-model="quest.result" val="D" label="Opción D" />
      </div>
      <q-btn color="primary" @click="edit ?update() : save()" :label="edit ? 'Actualizar' : 'Guardar'"/>
    </q-card>
  </div>
</template>
<script>
import { required } from 'vuelidate/lib/validators'
import env from '../env'
export default {
  name: 'Quest',
  props: ['id', 'index', 'test_id'],
  data () {
    return {
      edit: false,
      questFile: null,
      imgQuest: '',
      baseuPregunta: '',
      quest: {
        result: 'A'
      },
      answers: {}
    }
  },
  validations: {
    quest: {
      question: { required }
    },
    answers: {
      optionA: { required },
      optionB: { required },
      optionC: { required },
      optionD: { required }
    },
    questFile: { required }
  },
  mounted () {
    this.baseuPregunta = env.apiUrl + 'pregunta_img/'
    this.getQuestById()
  },
  methods: {
    async getQuestById () {
      if (this.id !== '') {
        this.$q.loading.show({
          message: 'Cargando Datos...'
        })
        this.edit = true
        await this.$api.get('questById/' + this.id).then(res => {
          if (res) {
            this.$q.loading.hide()
            this.quest = res
            this.imgQuest = this.baseuPregunta + res._id
            this.answers.optionA = this.quest.answers[0].titleAnswer
            this.answers.optionB = this.quest.answers[1].titleAnswer
            this.answers.optionC = this.quest.answers[2].titleAnswer
            this.answers.optionD = this.quest.answers[3].titleAnswer
          }
        })
      }
    },
    async save () {
      this.$v.$touch()
      if (!this.$v.quest.$error && !this.$v.answers.$error && !this.$v.questFile.$error) {
        this.$q.loading.show({
          message: 'Creando Datos...'
        })
        this.quest.test_id = this.test_id
        this.quest.question_number = this.index
        const formData = new FormData()
        formData.append('files', this.questFile)
        formData.append('datQ', JSON.stringify(this.quest))
        formData.append('datA', JSON.stringify(this.answers))
        await this.$api.post('newQuest', formData, {
          headers: {
            'Content-Type': undefined
          }
        }).then(res => {
          if (res) {
            this.$q.loading.hide()
            this.$q.notify({
              message: 'Pregunta Creada Correctamente',
              color: 'positive'
            })
            this.$emit('question', false)
          }
        })
      }
    },
    async update () {
      this.$v.answers.$touch()
      this.$v.quest.$touch()
      if (!this.$v.quest.$error && !this.$v.answers.$error) {
        this.$q.loading.show({
          message: 'Actualizando Datos...'
        })
        this.quest.question_number = this.index
        const formData = new FormData()
        if (this.questFile) {
          formData.append('files', this.questFile)
          this.quest.file = true
        } else {
          this.quest.file = false
        }
        formData.append('datQ', JSON.stringify(this.quest))
        formData.append('datA', JSON.stringify(this.answers))
        await this.$api.put('updateQuest/' + this.id, formData, {
          headers: {
            'Content-Type': undefined
          }
        }).then(res => {
          if (res) {
            this.$q.loading.hide()
            this.$q.notify({
              message: 'Pregunta Editada Correctamente',
              color: 'positive'
            })
            if (this.quest.file) {
              location.reload()
            }
            this.$emit('question', false)
          }
        })
      }
    },
    changeFile () {
      if (this.questFile) { this.imgQuest = URL.createObjectURL(this.questFile) }
    }
  }
}
</script>
