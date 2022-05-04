<template>
    <q-layout view="lHh Lpr lFf">
      <q-drawer v-model="drawer" style="width: 175px;">
        <div class="fit bg-primary">
          <div class="column items-center justify-center" style="background: linear-gradient(to right, #002938, #004e6d); height: 200px; width: 100%;">
            <div class="column items-center q-pt-xl q-pb-xs">
              <q-img src="gymtest 1.png" style="width: 200px"/>
            </div>
            <div class="text-center text-bold text-h5 text-white">Admin</div>
          </div>
          <q-list class="q-mt-lg q-pa-sm">
            <q-btn icon="add" color="white" outline rounded style="width: 100%" label="Nueva categoría" class="q-mb-md" no-caps @click="newCategorie()"/>
            <q-btn icon="add" color="white" outline rounded style="width: 100%" label="Nuevo Curso" no-caps @click="newCourse()"/>
          </q-list>
        </div>
      </q-drawer>

      <q-page-container>
        <div class="q-pa-xl">
          <div v-for="(item, index) in courses" :key="index">
            <div class="row items-center justify-center">
              <q-btn icon="edit" size="lg" flat round color="primary" @click="catUpdate(item)"/>
              <div class="text-h3 text-primary text-weight-medium">{{item.name}}</div>
            </div>
            <div v-if="item.courses && item.courses.length">
              <q-card class="q-mt-sm" style="border-radius: 16px" v-for="(item2, index2) in item.courses" :key="index2">
                <div class="row items-center justify-between bg-primary q-pa-xs">
                  <div class="row items-center">
                    <q-btn class="q-ml-xs" icon="edit" flat round color="white" @click="setUpdate(item2)"/>
                    <div class="text-h6 text-bold text-white">{{item2.name}}</div>
                  </div>
                  <q-btn class="q-ml-xs" icon="arrow_forward" flat round color="white" @click="selectCourse(item2._id)"/>
                </div>
                <div class="q-pa-md">{{item2.description}}</div>
              </q-card>
            </div>
            <div v-else class="text-primary text-center text-italic q-py-lg">No tiene cursos asignados</div>
          </div>
        </div>

        <q-dialog v-model="show">
          <q-card style="width:100%;border-radius: 20px;">
            <q-card-section>
              <div class="text-h6">{{editCourse ? 'Editar Curso' : 'Crear Curso'}}</div>
            </q-card-section>
            <q-card-section class="q-pt-none">
              <q-input dense outlined type="text" v-model="form.name" label="Nombre del curso"
                :error="$v.form.name.$error" error-message="Este campo es requerido"  @blur="$v.form.name.$touch()">
              </q-input>
              <q-select dense outlined v-model="form.category_id" :options="categories" label="Seleccione una categoría"
                map-options emit-value option-label="name" option-value="_id"
                :error="$v.form.category_id.$error" error-message="Este campo es requerido"  @blur="$v.form.category_id.$touch()">
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-italic text-grey">
                      Añade categorías para continuar
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
              <q-input dense outlined v-model="form.description" label="Breve descripción" type="textarea"
                :error="$v.form.description.$error" error-message="Este campo es requerido"  @blur="$v.form.description.$touch()">
              </q-input>
              <div class="row items-start">
                <q-input dense outlined type="number" v-model="form.price" label="Costo del curso"
                  :error="$v.form.price.$error" error-message="Este campo es requerido"  @blur="$v.form.price.$touch()">
                </q-input>
                <q-checkbox v-model="form.isEnabled" keep-color color="primary" label="Activo" class="q-ml-lg"/>
              </div>
            </q-card-section>
            <q-card-actions align="right">
              <q-btn flat label="Cancelar" color="primary" v-close-popup @click="show = false" no-caps/>
              <q-btn flat :label="editCourse ? 'Actualizar' :  'Crear'" color="primary" v-close-popup @click="editCourse ? updateCourse() : setCourse()" no-caps/>
            </q-card-actions>
          </q-card>
        </q-dialog>

        <q-dialog v-model="showCat">
          <q-card style="width:100%;border-radius: 20px;">
            <q-card-section>
              <div class="text-h6">{{editCat ? 'Editar' : 'Crear'}} Categoría</div>
            </q-card-section>
            <q-card-section class="q-pt-none">
              <q-input dense outlined type="text" v-model="formCat.name" label="Nombre de la categoría"
              :error="$v.formCat.name.$error" error-message="Este campo es requerido"  @blur="$v.formCat.name.$touch()"/>
            </q-card-section>
            <q-card-actions align="right">
              <q-btn flat label="Cancelar" color="primary" v-close-popup no-caps/>
              <q-btn flat label="Guardar" color="primary" v-close-popup @click="editCat ? updateCat() : setCat()" no-caps/>
            </q-card-actions>
          </q-card>
        </q-dialog>
      </q-page-container>
    </q-layout>
</template>
<script>
import { required } from 'vuelidate/lib/validators'
export default {
  data () {
    return {
      drawer: true,
      editCourse: false,
      editCat: false,
      show: false,
      showCat: false,
      form: {
        isEnabled: false
      },
      formCat: {},
      categories: [],
      courses: []
    }
  },
  validations: {
    form: {
      name: { required },
      price: { required },
      category_id: { required },
      description: { required }
    },
    formCat: {
      name: { required }
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    getData () {
      this.$api.get('cat_by_courses').then(res => {
        if (res) {
          this.courses = res
          this.getCategories()
        }
      })
    },
    getCategories () {
      this.$api.get('category').then(res => {
        if (res) {
          this.categories = res
        }
      })
    },
    setCourse () {
      this.$v.form.$touch()
      if (!this.$v.form.$error) {
        this.$q.loading.show({
          message: 'Guardando Datos...'
        })
        this.$api.post('setCourse', this.form).then(res => {
          if (res) {
            this.$q.notify({
              message: 'Curso guardado correctamente',
              color: 'positive'
            })
            this.getData()
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
          this.getData()
          this.$q.loading.hide()
        }
      })
    },
    setCat () {
      this.$v.formCat.$touch()
      if (!this.$v.formCat.$error) {
        this.$q.loading.show({
          message: 'Guardando Datos...'
        })
        this.$api.post('category', this.formCat).then(res => {
          if (res) {
            this.$q.notify({
              message: 'Categoría guardada correctamente',
              color: 'positive'
            })
            this.getData()
            this.$q.loading.hide()
          }
        })
      }
    },
    updateCat () {
      this.$v.formCat.$touch()
      if (!this.$v.formCat.$error) {
        this.$q.loading.show({
          message: 'Guardando Datos...'
        })
      }
      this.$api.put('category/' + this.formCat._id, this.formCat).then(res => {
        if (res) {
          this.$q.notify({
            message: 'Categoría guardada correctamente',
            color: 'positive'
          })
          this.getData()
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
    newCategorie () {
      this.editCat = false
      this.formCat = {}
      this.$v.formCat.$reset()
      this.showCat = true
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
    },
    catUpdate (item) {
      this.editCat = true
      this.formCat = { ...item }
      this.$v.formCat.$reset()
      this.showCat = true
    }
  }
}
</script>
