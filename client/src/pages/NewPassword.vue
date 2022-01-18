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
        <div class="text-center text-primary q-px-xl">Por favor ingrese su dirección de correo electrónico para recibir un código de verificación</div>
        <div class="q-mt-md">
          <q-input dense filled type="email" v-model="email" placeholder="Correo" :error="$v.email.$error" error-message="Este campo es requerido"  @blur="$v.email.$touch()">
            <template v-slot:prepend>
              <q-icon name="mail"/>
            </template>
          </q-input>
        </div>
        <q-btn color="primary" text-color="white" label="Enviar código" :loading="loading" no-caps class="full-width q-py-xs"
        @click="enviar()">
          <template v-slot:loading>
            <q-spinner-hourglass class="on-center" />
            Enviando...
          </template>
        </q-btn>
        <div class="row justify-center q-mt-sm">
            <q-btn no-caps flat color="primary" label="Volver" @click="$router.go(-1)" />
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
      email: null,
      user: {}
    }
  },
  validations: {
    email: { required, email }
  },
  mounted () {
  },
  methods: {
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
