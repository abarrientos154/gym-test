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
          <div class="text-bold text-primary cursor-pointer" @click="modal = true">mi contraseña</div>
        </div>

        <div class="row justify-center">
          <div class="text-grey q-mr-xs">¿No tienes cuenta aun?</div>
          <div class="text-bold text-primary cursor-pointer" @click="$router.push('/registro')">Crear una cuenta</div>
        </div>
        <div class="text-bold text-center text-grey-7 q-pt-md cursor-pointer" @click="$router.push('/pagina-principal')">Ir a página principal</div>
      </div>

    <q-dialog v-model="modal">
      <q-card class="column items-center justify-center" style="width: 350px; height:350px;">
        <q-card-section>
          <div class="text-h6">¿Olvidaste tu contraseña?</div>
        </q-card-section>
        <q-card-section>
          <q-input rounded outlined v-model="email" label="Introduce tu correo aquí" autofocus>
            <template v-slot:prepend>
              <q-icon color="primary" name="mail" />
            </template>
          </q-input>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            :loading="loading2"
            rounded
            no-caps
            icon-right="arrow_right"
            color="primary"
            @click="recuperar()"
          >Recuperar contraseña
          <template v-slot:loading>
            <q-spinner-hourglass class="on-center" />
            Cargando...
          </template>
          </q-btn>
        </q-card-actions>
        <q-card-actions class="absolute-top-right">
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
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
      modal: false,
      form: {},
      user: {},
      email: '',
      loading2: false
    }
  },
  validations: {
    form: {
      email: { required },
      password: { required }
    }
  },
  created () {
    this.logout()
  },
  methods: {
    // $router.push('/recuperar_clave')
    ...mapMutations('generals', ['login', 'logout']),
    ...mapActions('generals', ['saveUser']),
    async recuperar () {
      if (this.email) {
        // this.simulateProgress()
        this.loading2 = true
        this.$q.loading.show()
        await this.$api.get('email_send_app/' + this.email).then(res => {
          this.$q.loading.hide()
          if (res) {
            this.$q.notify({
              message: 'Se envió un correo para recuperar tu contraseña',
              color: 'positive'
            })
            this.loading2 = false
            this.cambio = false
          } else {
            this.loading2 = false
          }
        })
      } else {
        this.$q.notify({
          message: 'Campo Vacio',
          color: 'negative'
        })
      }
    },
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
              this.$router.push('/courses_client')
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
