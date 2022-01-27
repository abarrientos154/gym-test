<template>
  <div class="window-height">
    <div style="background: linear-gradient(to right, #002938, #004e6d); border-bottom-left-radius: 10px; border-bottom-right-radius: 10px; height: 400px; width: 100%;"></div>

    <div class="absolute-full column q-px-md no-wrap">
      <div class="q-mb-sm">
        <div class="q-py-md">
          <q-img src="gymtest 1.png" style="width: 200px"/>
        </div>
        <div class="text-center text-h6 text-white">Recuperar contraseña</div>
        <div class="row justify-center">
            <q-img src="Mail sent 1.png" style="width: 200px"/>
        </div>
      </div>

      <div class="q-px-md q-py-lg bg-white" style="border-radius: 10px;">
        <div class="text-center text-primary q-px-xl">Recuperación de contraseña: Ingresa tu nueva contraseña</div>
        <div class="q-mt-md">
          <q-input :type="isPwd ? 'password' : 'text'"  class="q-mb-md" rounded outlined v-model="password" label="Introduce tu contraseña" autofocus
             :error="$v.password.$error" @blur="$v.password.$touch()" error-message="Debe ingresar una contraseña.">
              <template v-slot:prepend>
                <q-icon color="primary" name="vpn_key" />
              </template>
              <template v-slot:append>
                <q-icon :name="isPwd ? 'visibility' : 'visibility_off'" class="cursor-pointer" color="primary" @click="isPwd = !isPwd" />
              </template>
            </q-input>
            <q-input :type="isPwd2 ? 'password' : 'text'" rounded outlined v-model="repeatPassword" label="Repite tu contraseña" error-message="las contraseñas deben ser iguales"
              :error="$v.repeatPassword.$error" @blur="$v.repeatPassword.$touch()">
              <template v-slot:prepend>
                <q-icon color="primary" name="vpn_key" />
              </template>
              <template v-slot:append>
                <q-icon :name="isPwd2 ? 'visibility' : 'visibility_off'" class="cursor-pointer" color="primary" @click="isPwd2 = !isPwd2" />
              </template>
            </q-input>
        </div>
        <q-btn color="primary" text-color="white" label="Cambiar contraseña" :loading="loading" no-caps class="full-width q-py-xs"
        @click="recuperar()">
          <template v-slot:loading>
            <q-spinner-hourglass class="on-center" />
            Procesando...
          </template>
        </q-btn>
        <div class="row justify-center q-mt-sm">
            <q-btn no-caps flat color="primary" label="Volver" @click="$router.push('/')" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { required, email } from 'vuelidate/lib/validators'
export default {
  data () {
    return {
      loading: false,
      user: {},
      password: '',
      repeatPassword: '',
      isPwd: true,
      isPwd2: true
    }
  },
  validations: {
    password: { required },
    repeatPassword: {
      sameAsPassword: sameAs('password')
    }
  },
  mounted () {
  },
  methods: {
    recuperar () {
      this.$v.$touch()
      if (!this.$v.password.$error && !this.$v.repeatPassword.$error) {
        this.$api.put('actualizar_pass/' + this.$route.params.code, { password: this.password }).then(res => {
          if (res) {
            this.$router.push('/')
            this.$q.notify({
              message: 'Contraseña restablecida con éxito'
            })
          }
        })
      }
    },
    async enviar () {
      this.$v.email.$touch()
      if (!this.$v.email.$error) {
        this.$q.loading.show({
          message: 'Enviando...'
        })
        this.$q.loading.hide()
      } else {
        this.$q.notify({
          message: 'Debe ingresar un correo válido',
          color: 'negative'
        })
      }
    }
  }
}
</script>

<style>
</style>
