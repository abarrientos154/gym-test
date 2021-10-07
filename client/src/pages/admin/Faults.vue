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
  </div>
</template>

<script>
import env from '../../env'
import Listable from '../../components/Listable.vue'
import { required } from 'vuelidate/lib/validators'
export default {
  components: { Listable },
  data () {
    return {
      form: {},
      faults: [],
      columns: [
        { name: 'message', label: 'Mensaje', align: 'left', field: 'message' },
        { name: 'questionButton', label: 'Pregunta', align: 'left', field: 'questionButton', style: 'width: 9%' },
        { name: 'userButton', label: 'Usuario', align: 'left', field: 'userButton', style: 'width: 9%' }
        // { name: 'actions', required: true, align: 'left', field: 'actions', style: 'width: 9%' }
      ],
      show: false,
      show2: false,
      topic: { required },
      courseId: '',
      question: {},
      user: {},
      baseu: ''
    }
  },
  mounted () {
    this.baseu = env.apiUrl + 'perfil_img/'
    this.courseId = localStorage.getItem('course_id')
    this.getFaults()
  },
  methods: {
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
      }
    }
  }
}
</script>
