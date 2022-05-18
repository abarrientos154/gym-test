<template>
  <div>
    <div style="background: linear-gradient(to right, #002938, #004e6d); height: 200px; width: 100%;"></div>
    <div class="column q-pa-lg no-wrap" style="margin-top: -200px">
      <div class="text-h4 text-white text-bold q-mb-xl q-px-xl">Subscripciones</div>
      <div>
        <div class="text-h5 text-white q-mb-sm q-px-md q-mb-xl">Subscripciones de usuarios</div>
      </div>
    </div>

    <div class="row justify-center" style="height: 70%">
      <listable class="col" :columns="columns" :data="data" title="Subscripciones" @function="execute"/>
    </div>

    <q-dialog v-model="show" @hide="decartarCamb()">
      <q-card style="border-radius: 20px; width: 100%">
        <q-card-section>
          <div class="text-h6">Agregar días a la subscripción</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" v-close-popup @click="decartarCamb()" no-caps/>
          <q-btn flat label="Guardar" color="primary" no-caps/>
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
      show: false,
      days: 0,
      subSelected: {},
      data: [],
      columns: [
        { name: 'name', label: 'Usuario', align: 'center', field: 'name' },
        { name: 'course_name', label: 'Curso', align: 'center', field: 'course_name' },
        { name: 'days', label: 'Días de la subscrición', align: 'center', field: 'days' },
        { name: 'actionsSubscription', required: true, align: 'left', field: 'actions', style: 'width: 9%' }
      ]
    }
  },
  validations: {
    days: { required }
  },
  mounted () {
    this.getData()
  },
  methods: {
    async getData () {
      this.$q.loading.show({
        message: 'Cargando datos...'
      })
      await this.$api.get('getSubscriptions').then(res => {
        if (res) {
          this.data = res
          this.$q.loading.hide()
        } else {
          this.$q.loading.hide()
        }
      })
    },
    decartarCamb () {
      this.days = 0
      this.$v.$reset()
    },
    execute (emit) {
      this.subSelected = emit.element
      this.show = true
    }
  }
}
</script>
