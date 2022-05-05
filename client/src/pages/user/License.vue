<template>
  <div>
    <q-card class="bg-primary no-border-radius q-pa-lg" style="width: 100vw; height: 100vh">
      <q-card class="column items-center q-py-lg bg-white" style="width: 100%; border-radius: 10px;">
        <q-img src="gymtest 1.png" style="width: 150px"/>
        <div class="text-h6 text-primary">Bienvenido {{user.name}}</div>
        <div class="text-primary text-center">Adquiere tu licencia para el curso <br> <b>{{course.name}}</b></div>
      </q-card>
      <q-btn flat dense round icon="arrow_back" color="white" class="absolute-top-left" @click="$router.go(-1)" />

      <div v-if="!user.disabled">
        <div v-if="seeDays" class="text-center text-white text-italic q-pt-md">
          <div>Quedan <b class="text-h6">{{licenseTime.days}} días</b> de licencia</div>
        </div>
        <div class="text-white text-center text-h6 q-pt-md">Licencias Disponibles</div>
        <q-card class="q-mt-md q-pa-sm" style="border-radius: 10px">
          <div class="text-primary text-h6">30 días de licencia</div>
          <div class="text-primary text-h5 text-weight-bolder">€{{course.price30}}</div>
          <div class="row justify-end">
            <q-btn color="primary" outline dense class="q-px-md" no-caps label="Comprar" @click="show = true, license = { name: 'price30', total: course.price30 }"/>
          </div>
        </q-card>
        <q-card class="q-mt-md q-pa-sm" style="border-radius: 10px">
          <div class="text-primary text-h6">60 días de licencia</div>
          <div class="text-primary text-h5 text-weight-bolder">€{{course.price60}}</div>
          <div class="row justify-end">
            <q-btn color="primary" outline dense class="q-px-md" no-caps label="Comprar" @click="show = true, license = { name: 'price60', total: course.price60 }"/>
          </div>
        </q-card>
        <q-card class="q-mt-md q-pa-sm" style="border-radius: 10px">
          <div class="text-primary text-h6">90 días de licencia</div>
          <div class="text-primary text-h5 text-weight-bolder">€{{course.price90}}</div>
          <div class="row justify-end">
            <q-btn color="primary" outline dense class="q-px-md" no-caps label="Comprar" @click="show = true, license = { name: 'price90', total: course.price90 }"/>
          </div>
        </q-card>
      </div>
      <div v-else class="q-mx-md q-px-md q-pt-lg q-pb-xl bg-white q-mb-xl" style="position:relative; top: -30px; border-top-left-radius: 20px; border-top-right-radius: 20px">
        <div class="text-grey-7 text-h6 text-center">Tu licencia fue suspendida debes comunicarte con el admin</div>
      </div>
    </q-card>

    <q-dialog v-model="show">
      <q-card class="q-py-xl q-px-md column items-center justify-center text-primary" style="width:100%">
        <q-img src="Imágenes web _Mesa de trabajo 1.png" style="width:200px;" />
        <div class="text-h6 q-pt-lg">Adquirir Membresía</div>
        <div class="text-subtitle1 q-pb-lg">Costo <b class="text-h5 text-bold text-light-green-14">€{{license.total}}</b></div>
        <q-btn label="Pagar" color="primary" text-color="white" v-close-popup @click="setBuy()" no-caps style="width:100%"/>
        <q-btn flat label="Cancelar" color="primary" v-close-popup no-caps class="q-mt-sm"/>
      </q-card>
    </q-dialog>

    <q-dialog v-model="modalExi" persistent>
      <q-card class="q-py-xl q-px-md column items-center justify-center text-primary" style="width:100%">
        <q-img src="Imágenes web -02.png" style="width:200px;" />
        <div class="text-h6 q-pt-lg">Compra completada</div>
        <div class="text-subtitle1 q-pb-lg">Ya puedes acceder a este curso</div>
        <q-btn label="Ir a inicio" color="primary" text-color="white" @click="$router.go(-1)" no-caps style="width:100%"/>
      </q-card>
    </q-dialog>

    <q-dialog v-model="modalFault" persistent>
      <q-card class="q-py-xl q-px-md column items-center justify-center text-primary" style="width:100%">
        <q-icon name="disabled_by_default" size="200px" color="red-14" />
        <div class="text-h6 q-pt-lg">Error al procesar tu compra</div>
        <div class="text-subtitle1 q-pb-lg">Puedes intentar nuevamente</div>
        <q-btn label="Cerrar" color="primary" text-color="white" v-close-popup no-caps style="width:100%"/>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import env from '../../env'
import { openURL } from 'quasar'
export default {
  data () {
    return {
      show: false,
      modalExi: false,
      modalFault: false,
      seeDays: false,
      ex: false,
      baseu: '',
      courseId: this.$route.params.id,
      user: {},
      course: {},
      license: {},
      licenseTime: {}
    }
  },
  mounted () {
    /* if (this.$route.params.est) {
      if (this.$route.params.est < 2) {
        this.setBuy()
      } else {
        this.modalFault = true
      }
    } */
    this.getUser()
    this.getCourse()
    this.getLicense()
  },
  methods: {
    async getUser () {
      await this.$api.get('user_info').then(res => {
        if (res) {
          this.user = res
          this.baseu = env.apiUrl + 'pagar?user_id=' + this.user._id
        }
      })
    },
    async getCourse () {
      this.$q.loading.show({
        message: 'Cargando Datos...'
      })
      await this.$api.get('course_by_id/' + this.courseId).then(res => {
        if (res) {
          this.course = res
          this.$q.loading.hide()
        }
      })
    },
    getLicense () {
      this.$api.get('get_License_course/' + this.courseId).then(res => {
        if (res.days > 0) {
          this.licenseTime = res
          this.seeDays = true
        }
      })
    },
    async buy () {
      const ruta = `${this.baseu}&montoTotal=${this.license.total}&ref=${this.courseId}`
      this.$q.loading.show({
        message: 'Comprando'
      })
      await openURL(ruta)
      navigator.app.exitApp()
    },
    async setBuy () {
      this.$q.loading.show({
        message: 'Procesando pago...'
      })
      this.$api.put('setBuy/' + this.license.name + '/' + this.courseId).then(res => {
        if (res) {
          this.modalExi = true
          this.$q.loading.hide()
        }
      }).catch(err => {
        console.log(err)
        this.$q.loading.hide()
      })
    }
  }
}
</script>
