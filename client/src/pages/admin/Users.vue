<template>
  <div>
    <div style="background: linear-gradient(to right, #002938, #004e6d); height: 200px; width: 100%;"></div>
    <div class="column q-pa-lg no-wrap" style="margin-top: -200px">
      <div class="text-h4 text-white text-bold q-mb-xl q-px-xl">Usuarios</div>
      <div>
        <div class="text-h5 text-white q-mb-sm q-px-md q-mb-xl">Usuarios recientes</div>
      </div>
    </div>

    <div class="row justify-between">
      <q-btn color="primary" label="Nuevo Usuario" icon="add" dense no-caps size="md" class="q-ml-md" @click="newUser()"/>
     <!--  <q-btn color="red" label="Eliminar Usuarios" icon="delete" dense no-caps size="md" class="q-mr-md" @click="deleteAllUsers()"/> -->
    </div>

    <div class="row justify-center" style="height: 70%">
      <listable class="col" :columns="columns" :data="users" title="Usuarios" @function="execute"/>
    </div>

    <q-dialog v-model="show" @hide="decartarCamb()">
      <q-card style="border-radius: 20px; width: 100%">
        <q-card-section>
          <div class="text-h6">{{editUser ? 'Editar Usuario' : 'Crear Usuario'}}</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-input dense filled v-model="form.name" placeholder="Nombre o Usuario" :error="$v.form.name.$error" error-message="Este campo es requerido"  @blur="$v.form.name.$touch()">
          <template v-slot:prepend>
            <q-icon name="person"/>
          </template>
        </q-input>
        <q-input v-if="editUser === false" dense filled type="email" v-model="form.email" placeholder="Correo electrónico" :error="$v.form.email.$error" error-message="Este campo es requerido"  @blur="$v.form.email.$touch()">
          <template v-slot:prepend>
            <q-icon name="mail"/>
          </template>
        </q-input>
        <q-input v-if="editUser === false" dense filled class="q-mb-sm" type="password" v-model="password" placeholder="Contraseña" :error="$v.password.$error" error-message="Este campo es requerido"  @blur="$v.password.$touch()">
          <template v-slot:prepend>
            <q-icon name="lock"/>
          </template>
        </q-input>
        <q-input v-if="editUser === false" dense filled class="q-mb-sm" type="password" v-model="repeatPassword" placeholder="Repetir contraseña" :error="$v.repeatPassword.$error" error-message="Este campo es requerido"  @blur="$v.repeatPassword.$touch()">
          <template v-slot:prepend>
            <q-icon name="lock"/>
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
          <q-select dense filled label="Selecciona la comunidad autónoma" v-model="form.community" :options="comunidades" option-label="name" option-value="_id" emit-value map-options @input="location = comunidades.filter(v => v._id === form.community)[0].communities" error-message="Este campo es requerido" :error="$v.form.community.$error" @blur="$v.form.community.$touch()">
            <template v-slot:prepend>
              <q-icon name="place" />
            </template>
          </q-select>
          <q-select dense filled label="Selecciona la comunidad" v-model="form.place" :options="location" option-label="name" option-value="_id" emit-value map-options error-message="Este campo es requerido" :error="$v.form.place.$error" @blur="$v.form.place.$touch()">
            <template v-slot:prepend>
              <q-icon name="place" />
            </template>
          </q-select>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" v-close-popup @click="decartarCamb()" no-caps/>
          <q-btn flat :label="editUser ? 'Actualizar' :  'Crear'" color="primary" v-close-popup @click="editUser ? updateUser() : setUser()" no-caps/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import Listable from '../../components/Listable.vue'
import { required, maxLength, email, sameAs, minLength } from 'vuelidate/lib/validators'
export default {
  components: { Listable },
  data () {
    return {
      editUser: false,
      form: {},
      users: [],
      file: null,
      repeatPassword: '',
      password: '',
      columns: [
        { name: 'name', label: 'Nombre', align: 'left', field: 'name' },
        { name: 'email', label: 'Correo Electronico', align: 'left', field: 'email' },
        { name: 'birthday', label: 'Fecha de Nacimiento', align: 'left', field: 'birthday' },
        { name: 'communityName', label: 'Comunidad', align: 'left', field: 'communityName' },
        { name: 'placeName', label: 'Lugar', align: 'left', field: 'placeName' },
        { name: 'actions', required: true, align: 'left', field: 'actions', style: 'width: 9%' }
      ],
      show: false,
      comunidades: [],
      location: []
    }
  },
  validations: {
    form: {
      name: { required },
      email: { required, email },
      birthday: { required },
      community: { required },
      place: { required }
    },
    repeatPassword: { sameAsPassword: sameAs('password') },
    password: { required, maxLength: maxLength(256), minLength: minLength(6) }
  },
  mounted () {
    this.getUsers()
    this.getComunidades()
  },
  methods: {
    updateUser () {
      this.$v.form.$touch()
      if (!this.$v.form.$error) {
        this.$q.loading.show({
          message: 'Actualizando Usuario, Por Favor Espere...'
        })
        this.$api.put('updateUser/' + this.form._id, this.form).then((res) => {
          if (res) {
            this.$q.loading.hide()
            this.$q.notify({
              color: 'positive',
              message: 'Usuario Actualizado Correctamente'
            })
            this.form = {}
            this.$v.$reset()
            this.getUsers()
          }
        })
      }
    },
    getComunidades () {
      this.$api.get('communities').then(res => {
        if (res) {
          this.comunidades = res
        }
      })
    },
    decartarCamb () {
      this.form = {}
      this.$v.$reset()
      this.edit = false
    },
    setUser () {
      this.$v.$touch()
      if (!this.$v.form.$error) {
        this.$q.loading.show({
          message: 'Subiendo Usuario, Por Favor Espere...'
        })
        this.form.roles = 2
        this.form.perfile = false
        this.form.password = this.password
        const formData = new FormData()
        formData.append('dat', JSON.stringify(this.form))
        this.$api.post('register', formData, {
          headers: {
            'Content-Type': undefined
          }
        }).then((res) => {
          if (res) {
            this.$q.loading.hide()
            this.$q.notify({
              color: 'positive',
              message: 'Usuario Creado Correctamente'
            })
            this.repeatPassword = ''
            this.password = ''
            this.form = {}
            this.$v.$reset()
            this.getUsers()
          }
        })
      }
    },
    toDisable (id, action) {
      this.$q.dialog({
        title: 'Confirma',
        message: action === 1 ? '¿Seguro deseas suspender a este Usuario?' : '¿Seguro deseas habilitar a este Usuario?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.$api.put('toDisable/' + id, { action: action }).then(res => {
          if (res === true) {
            this.$q.notify({
              color: 'positive',
              message: 'Usuario Suspendido Correctamente'
            })
            this.getUsers()
          } else if (res === false) {
            this.$q.notify({
              color: 'positive',
              message: 'Usuario Habilitado Correctamente'
            })
            this.getUsers()
          }
        })
      }).onCancel(() => {
        // console.log('>>>> Cancel')
      })
    },
    deleteAllUsers () {
      this.$q.dialog({
        title: 'Confirma',
        message: '¿Seguro deseas eliminar todos los Usuarios?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.$api.delete('deleteAllUsers').then(res => {
          if (res) {
            this.$q.notify({
              color: 'positive',
              message: 'Usuarios eliminados Correctamente'
            })
            this.$router.go()
          }
        })
      }).onCancel(() => {
        // console.log('>>>> Cancel')
      })
    },
    async getUsers () {
      this.$q.loading.show({
        message: 'Cargando datos...'
      })
      await this.$api.get('getUsers').then(res => {
        if (res) {
          this.users = res
          this.$q.loading.hide()
        } else {
          this.$q.loading.hide()
        }
      })
    },
    execute (emit) {
      if (emit.title === 'Deshabilitar') {
        this.toDisable(emit.id, 1)
      } else if (emit.title === 'Habilitar') {
        this.toDisable(emit.id, 0)
      } else if (emit.title === 'Editar') {
        this.getUserById(emit.id)
        this.editUser = true
        this.show = true
      }
    },
    async getUserById (id) {
      await this.$api.get('getUserById/' + id).then(res => {
        if (res) {
          this.form = res
        }
      })
    },
    newUser () {
      this.editUser = false
      this.form = {}
      this.show = true
    }
  }
}
</script>
