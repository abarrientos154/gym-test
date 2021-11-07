<template>
  <div class="window-height">
    <q-img src="fondo.png" style="height: 150px; width: 100%; border-bottom-right-radius: 10px; border-bottom-left-radius: 10px">
      <div class="q-pa-md absolute-full">
        <q-img src="gymtest 1.png" style="width: 150px; margin-left: -15px;"/>
        <div class="text-h6 text-white">Bienvenido {{user.name}}</div>
        <div class="text-white">Puedes modificar tu licencia</div>
      </div>
    </q-img>
    <div class="q-mx-md q-px-md q-pt-lg q-pb-xl bg-white q-mb-xl" style="position:relative; top: -30px; border-top-left-radius: 20px; border-top-right-radius: 20px">
      <div class="text-center text-subtitle2 text-grey-7">Tiempo restante:</div>
      <div class="column justify-center items-center">
        <div class="text-primary text-h1 col-12 text-weight-bolder">{{user.days > 0 ? user.days : '00'}}</div>
        <div class="text-grey-7 text-h6">Dias</div>
        <div v-if="user.days <= 0" class="text-grey-7 text-subtitle1">Debes Comprar un plan para seguir utilizando la aplicación</div>
      </div>
      <div class="text-primary text-h6">Membresias Disponibles</div>
      <q-card class="column bordes justify-center items-center q-my-xs q-pa-sm" v-for="(item, index) in licenses" :key="index" style="border-radius: 20px">
        <div class="row items-center">
          <div class="text-primary text-h3 q-mr-xs text-weight-bolder">{{item.months}}</div>
          <div class="text-grey-7 text-h6">{{item.months === 1 ? 'Mes' : 'Meses'}}</div>
        </div>
        <div class="text-primary text-h6 col-12 text-weight-bolder">{{item.name}}</div>
        <div class="text-primary text-h6 col-12 text-weight-bolder">{{item.monthPrice}}€</div>
        <q-btn color="primary" outline label="Comprar" rounded />
      </q-card>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      user: {},
      licenses: []
    }
  },
  mounted () {
    this.getUser()
    this.getLicenses()
  },
  methods: {
    getUser () {
      this.$q.loading.show({
        message: 'Cargando Datos...'
      })
      this.$api.get('user_info_license').then(res => {
        if (res) {
          this.user = { ...res }
          this.$q.loading.hide()
        }
      })
    },
    getLicenses () {
      this.$q.loading.show({
        message: 'Cargando Datos...'
      })
      this.$api.get('getLicenses').then(res => {
        if (res) {
          this.licenses = res
          this.$q.loading.hide()
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.bordes {
  border: 1px solid $primary;
}
</style>
