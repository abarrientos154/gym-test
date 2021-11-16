<template>
  <div class="window-height">
    <q-img src="fondo.png" style="height: 300px; width: 100%; border-bottom-right-radius: 10px; border-bottom-left-radius: 10px">
        <div class="absolute-full column justify-center" style="width:100%">
          <div class="q-pb-sm row justify-center q-pb-md">
            <q-img src="gymtest 1.png" style="width: 300px"/>
          </div>
          <div class="text-h6 text-bold text-white q-pb-xl">INICIO DE SESIÓN</div>
        </div>
      </q-img>

      <div class="q-mx-md q-pa-md bg-white" style="position:relative; top: -90px; border-top-left-radius: 20px; border-top-right-radius: 20px">
        <q-input dense filled type="email" v-model="form.email" placeholder="Usuario" :error="$v.form.email.$error" error-message="Este campo es requerido"  @blur="$v.form.email.$touch()">
          <template v-slot:prepend>
            <q-icon name="person"/>
          </template>
        </q-input>
        <q-input dense filled class="q-mb-sm" type="password" v-model="form.password" placeholder="Contraseña" :error="$v.form.password.$error" error-message="Este campo es requerido"  @blur="$v.form.password.$touch()">
          <template v-slot:prepend>
            <q-icon name="lock"/>
          </template>
        </q-input>
        <q-btn color="primary" text-color="white" label="Iniciar sesión" :loading="loading" @click="loguear()" no-caps class="full-width q-py-xs q-mb-md">
          <template v-slot:loading>
            <q-spinner-hourglass class="on-center" />
            loading...
          </template>
        </q-btn>
        <div class="row justify-center text-h6 q-mb-lg">
          <div class="text-grey q-mr-xs">Olvide</div>
          <div class="text-bold text-primary cursor-pointer" @click="$router.push('/recuperar_clave')">mi contraseña</div>
        </div>
        <!-- <div class="row justify-center items-center q-mb-lg">
          <q-separator color="grey" class="col"/>
          <div class="text-grey q-px-sm">O conectate usando</div>
          <q-separator color="grey" class="col"/>
        </div>
        <div class="row justify-center q-mb-xl">
          <q-avatar rounded class="q-mx-md" size="50px" style="border-radius: 15px;">
            <q-img src="fa 1.png" class="full-height"/>
          </q-avatar>
          <q-avatar rounded class="q-mx-md" size="50px" style="border-radius: 15px;">
            <q-img src="email 1.png" class="full-height"/>
          </q-avatar>
          <q-avatar rounded class="q-mx-md" size="50px" style="border-radius: 15px;">
            <q-img src="twte 1.png" class="full-height"/>
          </q-avatar>
        </div> -->
        <div class="row justify-center">
          <div class="text-grey q-mr-xs">¿No tienes cuenta aun?</div>
          <div class="text-bold text-primary cursor-pointer" @click="$router.push('/registro')">Crear una cuenta</div>
        </div>
      </div>
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'
import { required } from 'vuelidate/lib/validators'
export default {
  data () {
    return {
      loading: false,
      isPwd: true,
      form: {},
      user: {}
    }
  },
  validations: {
    form: {
      email: { required },
      password: { required }
    }
  },
  methods: {
    ...mapMutations('generals', ['login']),
    ...mapActions('generals', ['saveUser']),
    loguear () {
      this.$v.$touch()
      if (!this.$v.form.$error) {
        this.loading = true
        this.$q.loading.show({
          message: 'Iniciando sesión'
        })
        this.$api.post('login', this.form).then(res => {
          if (res) {
            this.user = res.SESSION_INFO
            this.login(res)
            if (this.user.roles[0] === 1) {
              this.$router.push('/courses')
            } else {
              this.$api.get('user_info_license').then(res => {
                if (res) {
                  if (res.days > 0) {
                    if (this.user.disabled !== true) {
                      this.$router.push('/courses_client')
                    } else {
                      this.$router.push('/license')
                    }
                  } else {
                    this.$router.push('/license')
                  }
                }
              })
            }
          } else {
            console.log('error de ususario')
            this.loading = false
            this.$q.loading.hide()
          }
          this.$q.loading.hide()
          this.loading = false
        })
      }
    }
  }
}
</script>
