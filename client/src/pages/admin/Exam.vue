<template>
  <div>
    <div v-if="componentQ === false">
      <div class="text-h3 col-10 row justify-center q-my-sm text-primary text-weight-bolder">{{test.title}}</div>
      <div class="text-h6 col-10 row justify-center q-my-sm text-primary text-weight-bolder">{{test.exam.name}}</div>
      <q-card class="row justify-start bg-blue-2">
        <div class="column q-ma-md">
          <div class="text-h6 text-primary">Nueva Pregunta</div>
          <div class="row col col-xs-3">
            <q-btn @click="newQ = true" class="dimensionE q-mb-xs text-subtitle1" padding="10px 5px" color="primary" icon="add" no-caps>Nueva</q-btn>
            <q-btn @click="newF = true" padding="10px 8px" class="dimensionE q-mb-xs text-subtitle1 q-ml-sm" color="primary" icon="upload_file" no-caps>Desde Excel</q-btn>
            <q-btn @click="componentQ = true" padding="10px 8px" class="dimensionE q-mb-xs text-subtitle1 q-ml-sm" color="primary" icon="quiz" no-caps>Preguntas Existentes</q-btn>
          </div>
        </div>
      </q-card>
      <div>
        <q-dialog v-model="newQ" @hide="reload">
          <quest @question="newQuest" :id="questId" :index="indexQ" :test_id="test.id"/>
        </q-dialog>
      </div>
      <div>
        <q-dialog v-model="newF">
          <quest-upload @file="getFile" :test_id="test.id"/>
        </q-dialog>
      </div>
      <div class="row justify-center">
        <div class="col col-xs-12 col-sm-11 col-md-10 col-lg-8 col-xl-6 q-mx-md q-my-sm">
          <div class="column dimension no-wrap" v-if="questions.length > 0">
            <q-card class="dimensionC q-px-xl q-pt-md q-pb-lg q-ma-lg" v-for="(qt, index) in questions" :key="index">
              <q-card class="row justify-between bg-blue-2 q-pa-sm q-mb-md">
                <div class="text-h6 text-primary q-ml-xs q-mb-sm">{{index + 1}} - {{qt.question}}</div>
                <div>
                  <q-btn round flat size="md" text-color="primary" icon="edit" @click="getIdForEdit(qt._id)"  />
                  <q-btn round flat size="md" text-color="primary" icon="delete" @click="destroyQuest(qt._id)" />
                </div>
              </q-card>
              <div class="column q-pl-lg" v-for="(item, index) in qt.answers" :key="index">
                <q-item class="text-subtitle1 q-mb-sm" clickable> {{item.titleAnswer}}</q-item>
              </div>
            </q-card>
          </div>
          <q-card v-else class="shadow-2 q-ma-md q-pa-md">
            <div class="text-center text-subtitle1">Actualmente sin Preguntas...</div>
          </q-card>
        </div>
      </div>
    </div>
    <div v-else>
      <questions :id="test.id" :_id="test._id" @closeC="close"></questions>
    </div>
  </div>
</template>
<script>
import Quest from '../../components/Quest.vue'
import QuestUpload from '../../components/QuestUpload.vue'
import Questions from '../../components/Questions.vue'
export default {
  components: { Quest, QuestUpload, Questions },
  data () {
    return {
      test: {},
      questions: [],
      questId: '',
      indexQ: null,
      file: {},
      newQ: false,
      newF: false,
      componentQ: false
    }
  },
  mounted () {
    this.getTestById()
  },
  methods: {
    async getTestById () {
      this.$q.loading.show({
        message: 'Cargando Datos...'
      })
      await this.$api.get('testExamById/' + this.$route.params.id).then(res => {
        if (res) {
          this.$q.loading.hide()
          this.test = res
          this.questions = this.test.questions
          this.indexQ = this.questions.length + 1
        }
      })
    },
    newQuest (quest) {
      if (quest === false) {
        this.newQ = false
        this.getTestById()
      }
    },
    async getFile (f) {
      if (f === false) {
        this.newF = false
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
    },
    close (f) {
      if (f === false) {
        this.componentQ = false
        this.getTestById()
      }
    }
  }
}
</script>

<style scoped lang="scss">
.dimension {
  min-width: 280px;
}
.dimensionE {
  min-width: 80px;
}
.dimensionC {
  min-width: 270px;
}
</style>
