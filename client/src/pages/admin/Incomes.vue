<template>
  <div>
    <div style="background: linear-gradient(to right, #002938, #004e6d); height: 200px; width: 100%;"></div>
    <div class="column q-pa-lg no-wrap" style="margin-top: -200px">
      <div class="text-h4 text-white text-bold q-mb-xl q-px-xl">Ingresos</div>
      <div>
        <div class="text-h5 text-white q-mb-sm q-px-md q-mb-xl">Ingresos recientes</div>
      </div>
    </div>
    <q-card class="text-white bg-primary q-pa-md q-mx-md" style="height:100%; border-radius: 15px">
      <div class="text-h6">Total de Ingresos</div>
      <div class="text-h4 text-bold">{{total}}€</div>
    </q-card>
    <div class="row justify-center" style="height: 70%">
      <listable class="col" :columns="columns" :data="incomes" title="Ingresos" />
    </div>
  </div>
</template>

<script>
import Listable from '../../components/Listable.vue'
export default {
  components: { Listable },
  data () {
    return {
      columns: [
        { name: 'userName', label: 'Usuario', align: 'left', field: 'userName' },
        { name: 'courseName', label: 'Curso', align: 'left', field: 'courseName' },
        { name: 'days', label: 'Licencia', align: 'left', field: 'days' },
        { name: 'amount', label: 'Monto', align: 'left', field: 'amount', format: val => { return val !== undefined ? `${val} €` : '-- €' } }
      ],
      total: null,
      incomes: []
    }
  },
  mounted () {
    this.getIncomes()
  },
  methods: {
    async getIncomes () {
      this.$q.loading.show({
        message: 'Cargando datos...'
      })
      await this.$api.get('getIncomes').then(res => {
        if (res) {
          this.incomes = res.data
          this.total = res.total
          this.$q.loading.hide()
        }
      })
    }
  }
}
</script>
