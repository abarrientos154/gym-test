<template>
  <div>
    <div style="background: linear-gradient(to right, #002938, #004e6d); height: 200px; width: 100%;"></div>
    <div class="column q-pa-lg no-wrap" style="margin-top: -200px">
      <div class="text-h4 text-white text-bold q-mb-xl q-px-xl">Control de uso</div>
      <div>
        <div class="text-h5 text-white q-mb-sm q-px-md q-mb-xl">Uso por usuario</div>
      </div>
    </div>

    <q-scroll-area horizontal class="q-mt-md" style="height: 50px; width: 100%;">
      <div class="row items-center no-wrap q-gutter-xs q-pr-sm q-py-sm" style="height:100%">
        <div v-for="(item, index) in types" :key="index">
          <q-chip clickable color="primary" :outline="type === item.value ? false : true"
            :text-color="type === item.value ? 'white' : 'primary'" @click="selecType(item.value)">
            {{item.label}}
          </q-chip>
        </div>
      </div>
    </q-scroll-area>

    <div class="row justify-center q-px-md">
      <q-table
      title="Listado de tests"
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
          <div v-if="props.row.type_data === 'Test por tema'">
            <div v-for="(item, index) in props.row.temasInfo" :key="index" class="ellipsis">
              {{index + 1}}) {{item}}
            </div>
          </div>
          <div v-else>{{props.row.type_data === 'Test' ? props.row.tema_name : props.row.type_data === 'Test general' ? props.row.test_name : props.row.type_data === 'Examen' ? props.row.examen_name : props.row.type_name}}</div>
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
      type: 0,
      allUsers: [],
      users: [],
      allData: [],
      data: [],
      types: [
        { value: 0, label: 'Todos' },
        { value: 1, label: 'Tests' },
        { value: 2, label: 'Tests por temas' },
        { value: 3, label: 'Tests general' },
        { value: 4, label: 'Rutinas de Entrenamiento' },
        { value: 5, label: 'Mis Exámenes' }
      ],
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
      this.type = 0
      this.allData = this.userSelec.data
      this.data = this.userSelec.data
    },
    filterFn (val, update) {
      if (val === '') {
        this.users = this.allUsers
      } else {
        const needle = val.toLowerCase()
        this.users = this.allUsers.filter(v => v.name.toLowerCase().indexOf(needle) > -1)
      }
    },
    selecType (val) {
      this.type = val
      if (val === 1) {
        this.data = this.allData.filter(v => v.type_data === 'Test')
      } else if (val === 2) {
        this.data = this.allData.filter(v => v.type_data === 'Test por tema')
      } else if (val === 3) {
        this.data = this.allData.filter(v => v.type_data === 'Test general')
      } else if (val === 4) {
        this.data = this.allData.filter(v => v.type_data === 'Rutina de entrenamiento')
      } else if (val === 5) {
        this.data = this.allData.filter(v => v.type_data === 'Examen')
      } else {
        this.data = this.allData
      }
    }
  }
}
</script>
