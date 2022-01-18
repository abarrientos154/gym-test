<template>
  <div class="q-pa-md column items-center">
    <div class="text-primary text-h5 q-pb-md">Usuarios</div>
    <div class="column items-center" style="width: 100%" v-if="usuarios.length">
      <q-card v-for="(item,index) in usuarios" clickable v-ripple :key="index" class="q-pa-none q-mb-md" style="width: 98%; border-radius: 15px; min-width: 300px; max-width: 500px">
        <div class="row">
          <div class="q-pa-md" >
            <q-img :src="baseuPerfil + item._id" style="height: 100px; width: 100px; border-radius: 100%;" />
          </div>
          <div class="q-pa-sm">
            <div class="text-h6">{{item.name}}</div>
            <div class="text-caption">{{item.email}}</div>
            <div class="text-caption">Puntuación: {{item.points}}</div>
          </div>
        </div>
      </q-card>
    </div>
    <q-card v-else class="shadow-2 q-ma-md q-pa-md">
      <div class="text-center text-subtitle1">Actualmente sin usuarios registrados...</div>
    </q-card>
  </div>
</template>

<script>
import env from '../../env'
export default {
  data () {
    return {
      baseuPerfil: '',
      usuarios: []
    }
  },
  mounted () {
    this.baseuPerfil = env.apiUrl + 'perfil_img/'
    this.getUsuarios()
  },
  methods: {
    async getUsuarios () {
      this.$q.loading.show({
        message: 'Cargando Datos...'
      })
      await this.$api.get('all_user').then(async res => {
        if (res) {
          this.$q.loading.hide()
          this.usuarios = res
        }
      })
    }
  }
}
</script>
