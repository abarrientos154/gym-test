<template>
  <div>
    <div style="background: linear-gradient(to right, #002938, #004e6d); height: 200px; width: 100%;"></div>
    <div class="column q-pa-lg no-wrap" style="margin-top: -200px">
      <div class="text-h4 text-white text-bold q-mb-xl q-px-xl">Control de uso</div>
      <div>
        <div class="text-h5 text-white q-mb-sm q-px-md q-mb-xl">Uso por usuario</div>
      </div>
    </div>

    <div class="row justify-center q-px-md">
      <q-table
      title="Listado"
      :data="data"
      :columns="columns"
      row-key="name"
      :no-data-label="`No hay datos, intenta escoger un usuario`"
      style="width:100%"
    >
      <template v-slot:top-right>
        <q-select
            outlined
            v-model="userSelec"
            :options="users"
            @input="selectUser()"
            label="Selecciona usuario"
            map-options
            option-label="name"
            style="width:300px"
        >
            <template v-slot:no-option>
            <q-item>
                <q-item-section class="text-grey">
                No hay resultados
                </q-item-section>
            </q-item>
            </template>
            <template v-slot:option="scope">
            <q-item
                v-bind="scope.itemProps"
                v-on="scope.itemEvents"
            >
                <q-item-section avatar>
                    <q-avatar size="50px" color="grey">
                        <q-img :src="scope.opt._id && scope.opt.perfile ? baseuPerfil + scope.opt._id : 'avatar gris 1.png'" style="height:100%"/>
                    </q-avatar>
                </q-item-section>
                <q-item-section>
                    <q-item-label v-html="scope.opt.name" />
                    <q-item-label caption>{{ scope.opt.email }}</q-item-label>
                </q-item-section>
            </q-item>
            </template>
        </q-select>
      </template>

      <template v-slot:body-cell-type_name="props">
        <q-td :props="props">
            <div>{{props.row.type_data === 'Examen' ? props.row.examen_name : props.row.type_name}}</div>
        </q-td>
      </template>
      <template v-slot:body-cell-result="props">
        <q-td :props="props">
            <div>{{props.row.correctas}} / {{props.row.type_data === 'Examen' ? props.row.all_quest : props.row.total_quest}}</div>
        </q-td>
      </template>
    </q-table>
    </div>
  </div>
</template>

<script>
import env from '../../env'
export default {
  data () {
    return {
      userSelec: null,
      baseuPerfil: '',
      allUsers: [],
      users: [],
      data: [],
      columns: [
        { name: 'type_data', label: 'Tipo', align: 'center', field: 'type_data' },
        { name: 'type_name', label: 'Test', align: 'center', field: 'type_name' },
        { name: 'fecha', label: 'Fecha', align: 'center', field: 'fecha' },
        { name: 'result', label: 'Resultados', align: 'center', field: 'result' }
      ]
    }
  },
  mounted () {
    this.baseuPerfil = env.apiUrl + 'perfil_img/'
    this.getUsers()
  },
  methods: {
    async getUsers () {
      this.$q.loading.show({
        message: 'Cargando datos...'
      })
      await this.$api.get('estadistic_users').then(res => {
        if (res) {
          this.allUsers = res
          this.users = res
          this.$q.loading.hide()
        } else {
          this.$q.loading.hide()
        }
      })
    },
    selectUser () {
      this.data = this.userSelec.data
    },
    filterFn (val, update) {
      if (val === '') {
        this.users = this.allUsers
      } else {
        const needle = val.toLowerCase()
        this.users = this.allUsers.filter(v => v.name.toLowerCase().indexOf(needle) > -1)
      }
    }
  }
}
</script>
