<template>
  <div class="window-height">
    <q-img src="fondo.png" style="height: 350px; width: 100%; border-bottom-right-radius: 10px; border-bottom-left-radius: 10px">
        <div class="q-pa-md absolute-full">
          <q-img src="gymtest 1.png" style="width: 150px; margin-left: -15px;"/>
          <div class="text-h6 text-white">Bienvenido {{form.name}}</div>
          <div class="text-white">Puedes modificar tu perfil</div>
          <div class="column items-center justify-center q-pt-md">
            <q-avatar size="140px" class="bg-grey-5">
              <q-img :src="form.perfile ? imgPerfil : 'avatar gris 1.png'" style="height: 100%"/>
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

      <div class="q-mx-md q-px-md q-pt-lg bg-white" style="position:relative; top: -70px; border-top-left-radius: 20px; border-top-right-radius: 20px">
          <q-input dense filled v-model="form.name" placeholder="Nombre o Usuario" :error="$v.form.name.$error" error-message="Este campo es requerido"  @blur="$v.form.name.$touch()">
            <template v-slot:prepend>
              <q-icon name="person"/>
            </template>
          </q-input>
          <q-input class="q-mb-lg" dense filled readonly type="email" v-model="form.email" placeholder="Correo electrónico">
            <template v-slot:prepend>
              <q-icon name="mail"/>
            </template>
          </q-input>
          <q-input dense filled readonly v-model="form.birthday" placeholder="Fecha de Nacimiento" error-message="Este campo es requerido" :error="$v.form.birthday.$error" @blur="$v.form.birthday.$touch()" @click="$refs.qDateProxy.show()">
            <template v-slot:prepend>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                  <q-date v-model="form.birthday" mask="DD/MM/YYYY"/>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <div class="text-h6 text-primary">¿Donde vives?</div>
          <div class="text-grey-8 q-pb-md">Selecciona tu lugar de residencia</div>
          <q-select dense filled label="Selecciona la comunidad autónoma" v-model="form.community" :options="comunidades" option-label="name" option-value="_id" emit-value map-options
          @input="location = comunidades.find(v => v._id === form.community).communities, form.place = null" error-message="Este campo es requerido" :error="$v.form.community.$error" @blur="$v.form.community.$touch()">
            <template v-slot:prepend>
              <q-icon name="place" />
            </template>
          </q-select>
          <q-select dense filled label="Selecciona la comunidad" v-model="form.place" :options="location" option-label="name" option-value="_id" emit-value map-options
          error-message="Este campo es requerido" :error="$v.form.place.$error" @blur="$v.form.place.$touch()">
            <template v-slot:prepend>
              <q-icon name="place" />
            </template>
          </q-select>

        <q-btn color="primary" text-color="white" label="Guardar" :loading="loading" @click="actualizar()" no-caps class="full-width q-py-xs q-mb-xl">
          <template v-slot:loading>
            <q-spinner-hourglass class="on-center" />
            Actualizando...
          </template>
        </q-btn>
      </div>
  </div>
</template>

<script>
import env from '../../env'
import { required } from 'vuelidate/lib/validators'
export default {
  data () {
    return {
      loading: false,
      perfile: null,
      baseuPerfil: '',
      imgPerfil: '',
      slide: 1,
      user: {},
      form: {},
      comunidades: [],
      location: []
    }
  },
  validations: {
    form: {
      name: { required },
      birthday: { required },
      community: { required },
      place: { required }
    }
  },
  mounted () {
    this.getUser()
  },
  methods: {
    getUser () {
      this.$q.loading.show({
        message: 'Cargando Datos...'
      })
      this.baseuPerfil = env.apiUrl + 'perfil_img/'
      this.$api.get('user_info').then(v => {
        if (v) {
          this.form = v
          if (this.form.perfile) {
            this.imgPerfil = this.baseuPerfil + v._id
          }
          this.getComunidades()
          this.$q.loading.hide()
        }
      })
    },
    getComunidades () {
      this.$api.get('communities').then(res => {
        if (res) {
          this.comunidades = res
          this.location = res.find(v => v._id === this.form.community).communities
        }
      })
    },
    async actualizar () {
      this.$v.form.$touch()
      if (!this.$v.form.$error) {
        this.$q.loading.show({
          message: 'Actualizando Datos...'
        })
        await this.$api.put('update_user_info/' + this.form._id, this.form).then(res => {
          if (res) {
            this.$q.notify({
              message: 'Perfil actualizado con éxito',
              color: 'positive'
            })
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
    async changeProfile () {
      this.$q.loading.show({
        message: 'Cambiando foto de perfil...'
      })
      this.form.perfile = true
      const formData = new FormData()
      formData.append('files', this.perfile)
      await this.$api.put('update_perfilImg', formData, {
        headers: {
          'Content-Type': undefined
        }
      }).then(res => {
        if (res) {
          this.$q.notify({
            message: 'Foto actualizada correctamente',
            color: 'positive'
          })
        }
        location.reload()
        this.$q.loading.hide()
      })
    }
  }
}
</script>

<style>
</style>
