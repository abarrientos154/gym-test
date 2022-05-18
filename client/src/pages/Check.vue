<template>
  <q-layout>
    <q-page-container>
      <q-page class="bg-primary q-pa-lg">
          <q-card class="row justify-center q-py-lg q-mt-md bg-white" style="width: 100%; border-radius: 10px;">
            <q-img src="gymtest 1.png" style="width: 150px"/>
          </q-card>
          <q-btn flat dense no-caps label="Volver al login" color="white" class="absolute-top-left q-mx-sm" @click="cerrarSesion()" />

        <div class="text-white" style="margin-top: 100px">
          <div class="text-center text-h6">Hemos enviado un código de verificación digital a tu correo electrónico</div>
          <div class="text-center text-subtitle1 q-py-md">Por favor ingrese el código a continuación para verificar que es usted</div>
          <div class="row justify-center q-py-md">
            <verification-box @code="getCode"></verification-box>
            <div class="text-red text-subtitle1 text-bold" v-if="isValid === false">Este código no es valido</div>
          </div>
          <div class="q-pt-xl row justify-center">
              <q-btn no-caps rounded class="q-py-xs" color="white" text-color="primary" label="Verificarme" :loading="loading" style="width:90%"
              @click="check()"/>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import VerificationBox from '../components/VerificationBox'
import { mapMutations } from 'vuex'
export default {
  components: { VerificationBox },
  data () {
    return {
      loading: false,
      userCheckCode: null,
      checkCode: '',
      isValid: null
    }
  },
  mounted () {
    this.getUser()
  },
  methods: {
    ...mapMutations('generals', ['logout']),
    getUser () {
      this.$api.get('user_info').then(res => {
        if (res) {
          this.userCheckCode = res.checkCode
        }
      })
    },
    async check () {
      if (this.isValid === true) {
        this.$q.loading.show({
          message: 'Verificando...'
        })
        this.$api.put('verifyAccount').then(res => {
          if (res) {
            this.$q.loading.hide()
            this.$q.notify({
              message: 'Tu cuenta ha sido verificada correctamente',
              color: 'positive'
            })
            this.$router.push('/courses_client')
          }
        })
      } else {
        this.$q.notify({
          message: 'Por favor, introduce el código correcto',
          color: 'negative'
        })
      }
    },
    getCode (code) {
      this.checkCode = code
      if (this.userCheckCode === this.checkCode) {
        this.isValid = true
      } else {
        this.isValid = false
      }
    },
    cerrarSesion () {
      this.logout()
      this.$router.push('/login')
    }
  }

}
</script>
 <style>
 .loginbg {
   background: #1783FA;
   opacity: .75;
 }
 </style>
