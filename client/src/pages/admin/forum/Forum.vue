<template>
  <div>
   <!--  <q-btn class="absolute-top-left" round flat color="white" icon="arrow_back" @click="$router.go(-1)" style="z-index: 5" /> -->
    <q-img src="fondo.png" style="height: 180px; width: 100%;">
        <div class="bg-transparent q-mt-lg" style="width:100%">
          <q-img src="gymtest 1.png" style="width: 150px"/>
        </div>
    </q-img>

    <div class="q-pa-md bg-white" style="position:relative; top: -40px;border-top-left-radius: 20px; border-top-right-radius: 20px">
      <div class="text-bold text-primary text-center text-italic text-h5">{{data.title}}</div>
      <div class="text-grey-8 q-mb-lg q-mt-sm" v-html="data.text"></div>
     <!--  <div v-if="login && data.question" class="row justify-center">
        <q-btn color="primary" no-caps size="lg" @click="question = true" label="Realizar Pregunta" style="width:100%; border-radius:10px" />
      </div> -->
      <div v-if="questions.length" class="q-py-md">
        <q-card v-for="(item, index) in questions" :key="index" class="row no-wrap bordes q-mb-md" style="width: 100%; border-radius: 10px"
         >
          <div class="bg-primary q-pa-md column justify-center" style="border-bottom-left-radius:10px; border-top-right-radius:0">
            <q-avatar size="70px">
              <q-img :src="item.user.perfile ? baseuPerfil + item.user._id : 'avatar gris 1.png'" style="height: 100%;"/>
            </q-avatar>
            <div class="text-center text-white text-caption text-bold">{{item.user.name}}</div>
          </div>
          <div class="q-pa-sm">
            <div class="absolute-right q-pa-sm">
               <q-btn color="negative" flat dense icon="visibility" label="Eliminar" @click="deleteQuestion(item._id)"/>
                <q-btn color="primary" flat dense icon="visibility" label="Ver Pregunta" @click="active = item._id;view = true"/>
              <div class="text-primary text-subtitle2 text-right">Fecha de publicación</div>
              <div class="text-grey-8 text-right">{{item.date}}</div>
            </div>
            <div class="q-mt-xl text-italic"> {{item.question}}</div>
                <!-- <div class="row">
                <q-btn color="white" flat round dense icon="edit" @click="setEditForum(item)"/>
                <q-btn color="white" flat round dense icon="delete" @click="deleteForum(item._id)"/>
                </div> -->
          </div>
        </q-card>
      </div>
    </div>

    <q-dialog v-model="question" @hide="decartarCamb()">
      <q-card style="width: 100%; border-radius:20px">
        <q-card-section>
          <div class="text-h6 text-center text-primary text-italic">Nueva Pregunta</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-input dense outlined rounded type="text" v-model="form.question" label="Ingrese su pregunta"
            :error="$v.form.question.$error" error-message="Este campo es requerido"  @blur="$v.form.question.$touch()"/>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" v-close-popup @click="decartarCamb()" no-caps/>
          <q-btn :label="'Enviar'" color="primary" @click="setQuestion()" no-caps/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog persistent v-model="view" @hide="active = null">
      <q-card style="width: 100%">
        <!-- <q-card-section>
          <div class="text-h6 text-center text-primary text-italic">{{edit ? 'Editar Foro' : 'Crear Foro'}}</div>
        </q-card-section> -->
        <q-card-section class="q-pt-none">
          <Question :id="active"></Question>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cerrar" color="primary" v-close-popup @click="active = null" no-caps/>
          <!-- <q-btn :label="edit ? 'Actualizar' :  'Crear'" color="primary" @click="edit ? updateForum() : setForum()" no-caps/> -->
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import env from '../../../env'
import { required } from 'vuelidate/lib/validators'
import Question from '../../admin/forum/Question.vue'
export default {
  components: { Question },
  props: ['id'],
  data () {
    return {
      view: false,
      active: null,
      login: false,
      question: false,
      baseuPerfil: '',
      thumbStyle: {
        right: '5px',
        borderRadius: '8px',
        backgroundColor: '#027be3',
        width: '8px',
        opacity: 0
      },
      data: {},
      form: {},
      questions: []
    }
  },
  validations: {
    form: {
      question: { required }
    }
  },
  mounted () {
    this.baseuPerfil = env.apiUrl + 'perfil_img/'
    this.getForums()
  },
  methods: {
    deleteQuestion (id) {
      this.$q.dialog({
        title: 'Confirmar',
        message: '¿Seguro deseas eliminar esta Pregunta?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.$api.put('deleteQuestionForum/' + id).then(res => {
          if (res) {
            this.$q.notify({
              color: 'positive',
              message: 'Eliminado Correctamente'
            })
            this.getForums()
          }
        })
      }).onCancel(() => {
        // console.log('>>>> Cancel')
      })
    },
    getForums () {
      this.$api.get('forumById/' + this.id).then(res => {
        if (res) {
          this.data = res
          if (res.question) {
            this.getQuestions()
          }
        }
      })
    },
    getQuestions () {
      this.$api.get('QuestionsForum/' + this.data._id).then(v => {
        this.questions = v
      })
    },
    decartarCamb () {
      this.form = {}
      this.$v.$reset()
    },
    setQuestion () {
      this.$v.$touch()
      if (!this.$v.form.$error) {
        this.$q.loading.show({
          message: 'Subiendo Pregunta, Por Favor Espere...'
        })
        this.form.forum_id = this.data._id
        this.$api.post('/setQuestion', this.form).then((res) => {
          if (res) {
            this.$q.loading.hide()
            this.$q.notify({
              color: 'positive',
              message: 'Pregunta enviada Correctamente'
            })
            this.form = {}
            this.question = false
            this.getQuestions()
          }
        })
      }
    }
  }
}
</script>

<style scoped lang="scss">
.bordes {
  border: 1px solid $primary;
  border-radius: 10px;
}
</style>
