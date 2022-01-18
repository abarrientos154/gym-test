<template>
  <div>
    <div class="text-h3 col-10 row justify-center q-my-sm text-primary text-weight-bolder">{{test.title}}</div>
    <div class="text-h6 col-10 row justify-center q-my-sm text-primary text-weight-bolder">{{test.course ? test.course.name : ''}}</div>
    <q-card class="row justify-start bg-blue-2">
      <div class="column q-ma-md">
        <div class="text-h6 text-primary">Nueva Pregunta</div>
        <div class="row">
          <q-btn @click="newQ = true" class="text-subtitle1" padding="10px 5px" color="primary" icon="add" no-caps>Nueva</q-btn>
        </div>
      </div>
    </q-card>

    <div class="row justify-center">
      <div class="col col-xs-12 col-sm-11 col-md-10 col-lg-8 col-xl-6 q-mx-md q-my-sm">
        <div class="column items-center q-py-md" v-if="questions.length > 0">
          <q-card class="q-py-md q-mb-md" v-for="(qt, index) in questions" :key="index" style="width:100%">
            <div class="row items-start">
              <div class="col-3 row justify-center q-mr-sm">
                <img :src="baseuPregunta + qt._id" style="width: 150px; height: 150px; border-radius: 10px"/>
              </div>
              <div class="col">
                <q-card class="row bg-blue-2 q-pa-sm q-mb-md">
                  <div class="col-9 text-h6 text-primary q-ml-xs q-mb-sm">{{index + 1}} - {{qt.question}}</div>
                  <div>
                    <q-btn class="col-6" round flat size="md" text-color="primary" icon="edit" @click="getIdForEdit(qt._id, index)"  />
                    <q-btn class="col-6" round flat size="md" text-color="primary" icon="delete" @click="destroyQuest(qt._id)" />
                  </div>
                </q-card>
                  <div v-for="(item, index2) in qt.answers" :key="index2">
                    <q-item clickable>
                      <div class="row items-start no-wrap">
                        <div class="text-bold q-pr-sm">{{index2 == 0 ? 'A)' : index2 == 1 ? 'B)' : index2 == 2 ? 'C)' : 'D)'}}</div>
                        <div class="text-subtitle1">{{item.titleAnswer}}</div>
                      </div>
                    </q-item>
                  </div>
              </div>
            </div>
          </q-card>
        </div>
        <q-card v-else class="shadow-2 q-ma-md q-pa-md">
          <div class="text-center text-subtitle1">Actualmente sin Preguntas...</div>
        </q-card>
      </div>
    </div>

    <div>
      <q-dialog v-model="newQ" @hide="reload">
        <quest @question="newQuest" :id="questId" :index="indexQ" :test_id="test.id"/>
      </q-dialog>
    </div>
  </div>
</template>
<script>
import Quest from '../../components/Quest.vue'
import env from '../../env'
export default {
  components: { Quest },
  data () {
    return {
      test: {},
      questions: [],
      questId: '',
      baseuPregunta: '',
      indexQ: null,
      newQ: false
    }
  },
  mounted () {
    this.baseuPregunta = env.apiUrl + 'pregunta_img/'
    this.getTestById()
  },
  methods: {
    async getTestById () {
      this.$q.loading.show({
        message: 'Cargando Datos...'
      })
      await this.$api.get('testById/' + this.$route.params.id).then(res => {
        if (res) {
          this.$q.loading.hide()
          this.test = res
          this.questions = this.test.questions
          this.indexQ = this.questions.length + 1
        } else {
          this.$q.loading.hide()
          this.$q.notify({
            color: 'negative',
            message: 'Aun no hay datos'
          })
        }
      })
    },
    newQuest (quest) {
      if (quest === false) {
        this.newQ = false
        this.getTestById()
      }
    },
    getIdForEdit (id, index) {
      this.questId = id
      this.indexQ = index + 1
      this.newQ = true
    },
    destroyQuest (id) {
      this.$q.dialog({
        title: 'Confirma',
        message: '¿Seguro deseas eliminar esta Pregunta?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.$q.loading.show({
          message: 'Eliminando Datos...'
        })
        this.$api.delete('destroyQuest/' + id).then(res => {
          if (res) {
            this.$q.loading.hide()
            this.$q.notify({
              color: 'positive',
              message: 'Pregunta Eliminada Correctamente'
            })
            this.getTestById()
          }
        })
      }).onCancel(() => {
        // console.log('>>>> Cancel')
      })
    },
    reload () {
      this.questId = ''
      this.indexQ = this.questions.length + 1
    }
  }
}
</script>
