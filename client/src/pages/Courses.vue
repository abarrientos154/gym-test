<template>
  <div>
    <q-card class="bg-primary no-border-radius q-pa-xl" style="width: 100vw; height: 100vh">
      <div class="text-h3 text-center text-white text-weight-medium">Mis Cursos</div>
      <q-btn icon="add" color="white" outline rounded style="width: 100%" label="Nuevo Curso" no-caps @click="newCourse()"/>
      <q-card class="bg-white row items-center justify-center q-mt-sm" style="border-radius: 16px" v-for="(item, index) in courses" :key="index">
        <q-btn class="q-ml-xs" icon="edit" flat color="primary" @click="setUpdate(item)"/>
        <div class="text-h6 text-bold">{{item.name}}</div>
        <q-btn class="q-ml-xs" icon="arrow_forward" flat color="primary" @click="selectCourse(item._id)"/>
      </q-card>
    </q-card>
    <q-dialog v-model="show">
      <q-card style="border-radius: 20px;">
        <q-card-section>
          <div class="text-h6">{{editCourse ? 'Editar Curso' : 'Crear Curso'}}</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-input dense outlined type="text" v-model="form.name" label="Nombre del curso" :error="$v.form.name.$error" error-message="Este campo es requerido"  @blur="$v.form.name.$touch()">
          </q-input>
          <q-checkbox v-model="form.isEnabled" keep-color color="primary" label="Activo"/>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" v-close-popup @click="show = false" no-caps/>
          <q-btn flat :label="editCourse ? 'Actualizar' :  'Crear'" color="primary" v-close-popup @click="editCourse ? updateCourse() : setCourse()" no-caps/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
import { required } from 'vuelidate/lib/validators'
export default {
  data () {
    return {
      courses: [],
      form: {
        isEnabled: false
      },
      editCourse: false,
      show: false
    }
  },
  validations: {
    form: {
      name: { required }
    }
  },
  mounted () {
    this.getCourses()
  },
  methods: {
    getCourses () {
      this.$api.get('getCourses').then(res => {
        if (res) {
          this.courses = res
        }
      })
    },
    setCourse () {
      this.$v.form.$touch()
      if (!this.$v.form.$error) {
        this.$q.loading.show({
          message: 'Guardando Datos...'
        })
        this.form.isEnabled = this.isEnabled
        this.$api.post('setCourse', this.form).then(res => {
          if (res) {
            this.$q.notify({
              message: 'Curso guardado correctamente',
              color: 'positive'
            })
            this.getCourses()
            this.$q.loading.hide()
          }
        })
      }
    },
    updateCourse () {
      this.$v.form.$touch()
      if (!this.$v.form.$error) {
        this.$q.loading.show({
          message: 'Guardando Datos...'
        })
      }
      this.$api.put('updateCourse/' + this.form._id, this.form).then(res => {
        if (res) {
          this.$q.notify({
            message: 'Curso guardado correctamente',
            color: 'positive'
          })
          this.getCourses()
          this.$q.loading.hide()
        }
      })
    },
    newCourse () {
      this.editCourse = false
      this.form = {
        isEnabled: false
      }
      this.$v.form.$reset()
      this.show = true
    },
    selectCourse (id) {
      localStorage.setItem('course_id', id)
      this.$router.push('/administrador')
    },
    setUpdate (item) {
      this.editCourse = true
      this.form = { ...item }
      this.$v.form.$reset()
      this.show = true
    }
  }
}
</script>
