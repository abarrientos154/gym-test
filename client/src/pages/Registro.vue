<template>
  <div class="window-height">
    <q-img src="fondo.png" :style="register ? 'height: 300px' : 'height: 350px'" style="width: 100%; border-bottom-right-radius: 10px; border-bottom-left-radius: 10px">
      <div v-if="register" class="absolute-full column justify-center" style="width:100%">
        <div class="q-pb-sm row justify-center q-pb-md">
          <q-img src="gymtest 1.png" style="width: 300px"/>
        </div>
        <div class="text-h6 text-bold text-white q-pb-xl">CREAR CUENTA</div>
      </div>
      <div class="q-pa-md absolute-full" v-else>
        <q-img src="gymtest 1.png" style="width: 150px; margin-left: -15px;"/>
        <div class="text-h6 text-white">Bienvenido {{form.name}}</div>
        <div class="text-white">Queremos conocerte más</div>
        <div class="column items-center justify-center q-pt-md">
          <q-avatar size="140px" class="bg-grey-5">
            <q-img :src="perfile ? imgPerfil : 'avatar gris 1.png'" style="height: 100%"/>
            <q-badge round class="bg-grey-5" floating style="border-radius: 100%; margin-top: 95px; width: 50px; height: 50px;">
              <q-avatar style="width: 100%; height: 50px;">
                <q-file borderless v-model="perfile" @input="changeProfile()" accept=".jpg, image/*" style="height: 50px; font-size: 0px">
                  <q-icon color="white" class="absolute-center" size="25px" name="photo_camera"/>
                </q-file>
              </q-avatar>
            </q-badge>
          </q-avatar>
        </div>
      </div>
    </q-img>

    <div class="q-mx-md q-px-md q-pt-lg bg-white" :style="register ? 'top: -90px' : 'top: -70px'" style="position:relative; border-top-left-radius: 20px; border-top-right-radius: 20px">
      <div v-if="register">
        <q-input dense filled v-model="form.name" placeholder="Nombre o Usuario" :error="$v.form.name.$error" error-message="Este campo es requerido"  @blur="$v.form.name.$touch()">
          <template v-slot:prepend>
            <q-icon name="person"/>
          </template>
        </q-input>
        <q-input dense filled type="email" v-model="form.email" placeholder="Correo electrónico" :error="$v.form.email.$error" error-message="Este campo es requerido"  @blur="$v.form.email.$touch()">
          <template v-slot:prepend>
            <q-icon name="mail"/>
          </template>
        </q-input>
        <q-input dense filled class="q-mb-sm" type="password" v-model="password" placeholder="Contraseña" :error="$v.password.$error" error-message="Este campo es requerido"  @blur="$v.password.$touch()">
          <template v-slot:prepend>
            <q-icon name="lock"/>
          </template>
        </q-input>
        <q-input dense filled class="q-mb-sm" type="password" v-model="repeatPassword" placeholder="Repetir contraseña" :error="$v.repeatPassword.$error" error-message="Este campo es requerido"  @blur="$v.repeatPassword.$touch()">
          <template v-slot:prepend>
            <q-icon name="lock"/>
          </template>
        </q-input>
      </div>
      <div v-else>
        <q-input dense filled readonly v-model="form2.birthday" placeholder="Fecha de Nacimiento" error-message="Este campo es requerido" :error="$v.form2.birthday.$error" @blur="$v.form2.birthday.$touch()" @click="$refs.qDateProxy.show()">
          <template v-slot:prepend>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                <q-date v-model="form2.birthday" mask="DD/MM/YYYY"/>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
        <div class="text-h6 text-primary">¿Donde vives?</div>
        <div class="text-grey-8 q-pb-md">Selecciona tu lugar de residencia</div>
        <q-select dense filled label="Selecciona la comunidad autónoma" v-model="form2.community" :options="comunidades" option-label="name" option-value="_id" emit-value map-options @input="location = comunidades.filter(v => v._id === form2.community)[0].communities" error-message="Este campo es requerido" :error="$v.form2.community.$error" @blur="$v.form2.community.$touch()">
          <template v-slot:prepend>
            <q-icon name="place" />
          </template>
        </q-select>
        <q-select dense filled label="Selecciona la comunidad" v-model="form2.place" :options="location" option-label="name" option-value="_id" emit-value map-options error-message="Este campo es requerido" :error="$v.form2.place.$error" @blur="$v.form2.place.$touch()">
          <template v-slot:prepend>
            <q-icon name="place" />
          </template>
        </q-select>
      </div>
      <q-btn color="primary" text-color="white" :label="register ? 'Crear cuenta' : 'Guardar'" :loading="loading" @click="register ? registrarse() : profile()" no-caps class="full-width q-py-xs">
        <template v-slot:loading>
          <q-spinner-hourglass class="on-center" />
          Registrando...
        </template>
      </q-btn>
      <!-- <div v-if="register">
        <div class="row justify-center items-center q-pt-lg q-mb-lg">
          <q-separator color="grey" class="col"/>
          <div class="text-grey q-px-sm">O conectate usando</div>
          <q-separator color="grey" class="col"/>
        </div>
        <div class="row justify-center">
          <q-avatar rounded class="q-mx-md" size="50px" style="border-radius: 15px;">
            <q-img src="fa 1.png" class="full-height"/>
          </q-avatar>
          <q-avatar rounded class="q-mx-md" size="50px" style="border-radius: 15px;">
            <q-img src="email 1.png" class="full-height"/>
          </q-avatar>
          <q-avatar rounded class="q-mx-md" size="50px" style="border-radius: 15px;">
            <q-img src="twte 1.png" class="full-height"/>
          </q-avatar>
        </div>
      </div> -->
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import { required, maxLength, email, sameAs, minLength } from 'vuelidate/lib/validators'
export default {
  data () {
    return {
      isPwd: false,
      loading: false,
      register: true,
      perfile: null,
      repeatPassword: '',
      password: '',
      imgPerfil: '',
      slide: 1,
      user: {},
      form: {},
      form2: {},
      comunidades: [],
      location: []
    }
  },
  validations: {
    form: {
      name: { required },
      email: { required, email }
    },
    form2: {
      birthday: { required },
      community: { required },
      place: { required }
    },
    repeatPassword: { sameAsPassword: sameAs('password') },
    password: { required, maxLength: maxLength(256), minLength: minLength(6) }
  },
  mounted () {
    this.getComunidades()
  },
  methods: {
    ...mapMutations('generals', ['login']),
    getComunidades () {
      this.$api.get('communities').then(res => {
        if (res) {
          this.comunidades = res
          // console.log(this.comunidades)
        }
      })
    },
    async registrarse () {
      this.$v.form.$touch()
      this.$v.password.$touch()
      this.$v.repeatPassword.$touch()
      if (!this.$v.form.$error && !this.$v.password.$error && !this.$v.repeatPassword.$error) {
        this.$q.loading.show({
          message: 'Registrando Datos...'
        })
        this.form.roles = 2
        this.form.password = this.password
        await this.$api.post('register', this.form).then(res => {
          if (res) {
            this.$q.notify({
              message: 'Ya formas parte de GymTest, Bienvenido',
              color: 'positive'
            })
            this.loguear()
          }
        })
        this.$q.loading.hide()
      } else {
        this.$q.notify({
          message: 'Debe ingresar todos los datos correspondientes',
          color: 'negative'
        })
      }
    },
    loguear () {
      this.$api.post('login', this.form).then(res => {
        if (res) {
          const usuario = res.SESSION_INFO.roles.find(value => value === 2)
          if (usuario) {
            this.register = false
            this.login(res)
            this.$api.get('user_info').then(user => {
              if (user) {
                this.user = user
              }
            })
          }
        } else {
          console.log('error de ususario')
          // this.loading = false
        }
      })
    },
    async profile () {
      this.$v.form2.$touch()
      if (!this.$v.form2.$error) {
        this.$q.loading.show({
          message: 'Guardando Datos...'
        })
        const formData = new FormData()
        formData.append('files', this.perfile)
        formData.append('dat', JSON.stringify(this.form2))
        await this.$api.put('updateUser/' + this.user._id, formData, {
          headers: {
            'Content-Type': undefined
          }
        }).then(res => {
          if (res) {
            this.$q.notify({
              message: 'Perfil guardado, Bienvenido',
              color: 'positive'
            })
            this.$router.push('/inicio')
          }
          this.$q.loading.hide()
        })
      } else {
        this.$q.notify({
          message: 'Debe ingresar todos los datos correspondientes',
          color: 'negative'
        })
      }
    },
    changeProfile () {
      if (this.perfile) {
        this.imgPerfil = URL.createObjectURL(this.perfile)
        this.form2.perfile = true
      }
    }
  }
}
</script>

<style>
</style>
