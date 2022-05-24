<template>
    <q-layout view="lHh Lpr lFf">
      <q-header style="background: linear-gradient(to right, #002938, #004e6d);">
        <q-toolbar>
          <q-btn flat @click="drawer = !drawer" round dense icon="menu" />
        </q-toolbar>
      </q-header>

      <q-drawer v-model="drawer" style="width: 175px;">
        <div class="fit bg-primary column justify-between no-wrap">
          <div>
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
          <div class="text-white row justify-center q-pb-xl">
            <q-btn no-caps rounded color="white" text-color="primary" label="Cerrar sesión" style="width:90%" @click="cerrarSesion()" />
          </div>
        </div>
      </q-drawer>

      <q-page-container>
        <div class="q-pa-xl" v-if="courses.length">
          <div v-for="(item, index) in courses" :key="index" class="q-pb-lg">
            <div class="row items-center justify-center">
              <q-btn icon="edit" size="lg" flat round color="primary" @click="catUpdate(item)"/>
              <div class="text-h3 text-primary text-weight-medium">{{item.name}}</div>
            </div>
            <div v-if="item.courses && item.courses.length">
              <q-card class="q-mt-sm" style="border-radius: 10px" v-for="(item2, index2) in item.courses" :key="index2">
                <div class="row items-center justify-between bg-primary q-pa-xs">
                  <div class="row items-start">
                    <q-btn class="q-ml-xs" icon="edit" flat round color="white" @click="setUpdate(item2)"/>
                    <div class="text-white">
                      <div class="text-h6 text-bold">{{item2.name}}</div>
                      <div v-if="!item2.free" class="row q-gutter-x-md">
                        <div class="text-subtitle2">1 mes: €{{item2.price1}}</div>
                        <div class="text-subtitle2">6 meses: €{{item2.price2}}</div>
                        <div class="text-subtitle2">1 año: €{{item2.price3}}</div>
                      </div>
                      <div v-else>
                        <q-chip color="green" text-color="white" dense class="q-px-md">Curso gratuito</q-chip>
                      </div>
                    </div>
                  </div>
                  <q-btn class="q-ml-xs" icon="arrow_forward" flat round color="white" @click="selectCourse(item2._id)"/>
                </div>
                <div class="q-pa-md">
                  <div v-html="item2.description" class="ellipsis-3-lines"></div>
                </div>
              </q-card>
            </div>
            <div v-else class="text-primary text-center text-italic q-py-lg">No tiene cursos asignados</div>
          </div>
        </div>
        <div v-else class="text-primary text-center text-italic text-h6 q-py-lg">Sin datos cargados...</div>

        <q-dialog v-model="show">
          <q-card style="width:100%;">
            <q-card-section>
              <div class="text-h6 text-center text-italic text-primary">{{editCourse ? 'Editar Curso' : 'Crear Curso'}}</div>
            </q-card-section>
            <q-card-section class="q-pt-none">
              <q-input dense outlined rounded type="text" v-model="form.name" label="Nombre del curso"
                :error="$v.form.name.$error" error-message="Este campo es requerido"  @blur="$v.form.name.$touch()">
              </q-input>
              <q-select dense outlined rounded v-model="form.category_id" :options="categories" label="Seleccione una categoría"
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
              <div :class="$v.description.$error ? 'text-red' : ''">Breve descripción</div>
              <q-editor v-model="description" style="width: 100%" min-height="5rem"
              :error="$v.description.$error" error-message="Este campo es requerido"  @blur="$v.description.$touch()"/>
              <div class="column q-pb-md">
                <q-checkbox v-model="form.isEnabled" keep-color color="primary" label="Curso activo"/>
                <q-toggle v-model="form.free" label="Curso gratuito" />
              </div>
              <div v-if="!form.free" class="row items-start justify-between">
                <q-input dense outlined rounded type="number" v-model.number="form.price1" label="Costo de 1 mes" class="col-5"
                  :error="$v.form.price1.$error" error-message="Este campo es requerido"  @blur="$v.form.price1.$touch()">
                </q-input>
                <q-input dense outlined rounded type="number" v-model.number="form.price2" label="Costo de 6 meses" class="col-5"
                  :error="$v.form.price2.$error" error-message="Este campo es requerido"  @blur="$v.form.price2.$touch()">
                </q-input>
                <q-input dense outlined rounded type="number" v-model.number="form.price3" label="Costo de 1 año" class="col-5"
                  :error="$v.form.price3.$error" error-message="Este campo es requerido"  @blur="$v.form.price3.$touch()">
                </q-input>
              </div>
            </q-card-section>
            <q-card-actions align="right">
              <q-btn flat label="Cancelar" color="primary" v-close-popup @click="show = false" no-caps/>
              <q-btn :label="editCourse ? 'Actualizar' :  'Crear'" color="primary" @click="editCourse ? updateCourse() : setCourse()" no-caps/>
            </q-card-actions>
          </q-card>
        </q-dialog>

        <q-dialog v-model="showCat">
          <q-card style="width:100%;">
            <q-card-section>
              <div class="text-h6 text-center text-italic text-primary">{{editCat ? 'Editar' : 'Crear'}} Categoría</div>
            </q-card-section>
            <q-card-section class="q-pt-none">
              <q-input dense outlined rounded type="text" v-model="formCat.name" label="Nombre de la categoría"
              :error="$v.formCat.name.$error" error-message="Este campo es requerido"  @blur="$v.formCat.name.$touch()"/>
            </q-card-section>
            <q-card-actions align="right">
              <q-btn flat label="Cancelar" color="primary" v-close-popup no-caps/>
              <q-btn label="Guardar" color="primary" @click="editCat ? updateCat() : setCat()" no-caps/>
            </q-card-actions>
          </q-card>
        </q-dialog>
      </q-page-container>
    </q-layout>
</template>
<script>
import { required, requiredIf } from 'vuelidate/lib/validators'
import { mapMutations } from 'vuex'
export default {
  data () {
    return {
      drawer: false,
      editCourse: false,
      editCat: false,
      show: false,
      showCat: false,
      description: '',
      form: {
        isEnabled: false,
        free: false
      },
      formCat: {},
      categories: [],
      courses: []
    }
  },
  validations: {
    form: {
      name: { required },
      category_id: { required },
      price1: {
        required: requiredIf(function (nestedModel) {
          return !this.form.free
        })
      },
      price2: {
        required: requiredIf(function (nestedModel) {
          return !this.form.free
        })
      },
      price3: {
        required: requiredIf(function (nestedModel) {
          return !this.form.free
        })
      }
    },
    description: { required },
    formCat: {
      name: { required }
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    ...mapMutations('generals', ['logout']),
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
      this.$v.description.$touch()
      if (!this.$v.form.$error && !this.$v.description.$error) {
        this.$q.loading.show({
          message: 'Guardando Datos...'
        })
        this.form.description = this.description
        this.$api.post('setCourse', this.form).then(res => {
          if (res) {
            this.$q.notify({
              message: 'Curso guardado correctamente',
              color: 'positive'
            })
            this.getData()
            this.show = false
            this.$q.loading.hide()
          }
        })
      }
    },
    updateCourse () {
      this.$v.form.$touch()
      this.$v.description.$touch()
      if (!this.$v.form.$error && !this.$v.description.$error) {
        this.$q.loading.show({
          message: 'Guardando Datos...'
        })
        this.form.description = this.description
        this.$api.put('updateCourse/' + this.form._id, this.form).then(res => {
          if (res) {
            this.$q.notify({
              message: 'Curso guardado correctamente',
              color: 'positive'
            })
            this.getData()
            this.show = false
            this.$q.loading.hide()
          }
        })
      }
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
            this.showCat = false
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
          this.showCat = false
          this.$q.loading.hide()
        }
      })
    },
    newCourse () {
      this.editCourse = false
      this.description = ''
      this.form = {
        isEnabled: false,
        free: false
      }
      this.$v.form.$reset()
      this.$v.description.$reset()
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
      this.description = this.form.description
      this.$v.description.$reset()
      this.$v.form.$reset()
      this.show = true
    },
    catUpdate (item) {
      this.editCat = true
      this.formCat = { ...item }
      this.$v.formCat.$reset()
      this.showCat = true
    },
    cerrarSesion () {
      this.logout()
      this.$router.push('/login')
    }
  }
}
</script>
