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
        <div class="text-primary text-h6 col-12 text-weight-bolder">{{item.monthPrice}}€ / Mes</div>
        <q-btn color="primary" outline label="Comprar" rounded @click="show = true, license = item "/>
      </q-card>
    </div>
    <q-dialog v-model="show">
      <q-card style="border-radius: 20px;">
        <q-card-section>
        </q-card-section>
        <q-card-section class="q-pt-none column justify-center items-center">
          <q-card class="q-pa-md" style="width:100%; border-radius:15px">
            <div class="text-h6 text-primary">Adquirir Membresia</div>
            <div class="row items-start q-mt-md q-py-md">
              <!-- <div>
                <q-img src="app movil 33.png" style="width:100px; height: 100px; border-radius: 15px" />
              </div> -->
              <div class="col q-pl-md">
                <div class="text-grey-8 text-h5">Membresia</div>
                <div class="row items-center">
                  <div class="text-primary text-h3 q-mr-xs text-weight-bolder">{{license.months}}</div>
                  <div class="text-grey-7 text-h6">{{license.months === 1 ? 'Mes' : 'Meses'}}</div>
                </div>
                <div class="text-grey-8 text-caption">{{license.name}}</div>
                <div class="text-grey-8 text-h6"><b>Costo </b>{{license.total}}€</div>
              </div>
            </div>
            <div class="row justify-center q-pt-xl">
              <paypal @pagoProcesado="comprarMembresia" :total="license.total" :descripcion="`Membresia ${license.months} ${license.months === 1 ? 'Mes' : 'Meses'}`" style="width:100%" />
            </div>
          </q-card>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" v-close-popup no-caps/>
          <q-btn flat label="Pagar" color="primary" v-close-popup @click="setBuy()" no-caps/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import Paypal from '../../components/Paypal.vue'
export default {
  components: { Paypal },
  data () {
    return {
      user: {},
      licenses: [],
      license: {},
      show: false
    }
  },
  mounted () {
    this.getUser()
    this.getLicenses()
  },
  methods: {
    async getUser () {
      this.$q.loading.show({
        message: 'Cargando Datos...'
      })
      await this.$api.get('user_info_license').then(res => {
        if (res) {
          this.user = { ...res }
          this.$q.loading.hide()
        }
      })
    },
    async getLicenses () {
      this.$q.loading.show({
        message: 'Cargando Datos...'
      })
      await this.$api.get('getLicenses').then(res => {
        if (res) {
          this.licenses = res
          this.$q.loading.hide()
        }
      })
    },
    async setBuy () {
      this.$q.loading.show({
        message: 'Procesando pago...'
      })
      await this.$api.put('setBuy/' + this.license._id).then(res => {
        if (res) {
          this.$q.loading.hide()
          this.$router.go()
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
