<template>
  <div>
    <div style="background: linear-gradient(to right, #002938, #004e6d); height: 200px; width: 100%;"></div>
    <!-- <q-img src="noimg.png" style="border-bottom-left-radius: 10px; border-bottom-right-radius: 10px; height: 265px; width: 100%;"/> -->
    <div class="column q-pa-lg no-wrap" style="margin-top: -200px">
      <div class="text-h4 text-white text-bold q-mb-xl q-px-xl">Blogs</div>
      <div>
        <div class="text-h5 text-white q-mb-sm q-px-md">Blogs recientes</div>
        <q-scroll-area horizontal style="height: 230px">
          <div class="full-width row no-wrap">
            <q-card class="q-mr-md column bordes" v-for="(item, index) in blogs" :key="index" style="width: 260px; border-radius: 20px;">
              <q-img src="noimg.png" style="height: 130px"/>
              <q-card-section class="items-center" horizontal>
                <q-card-section class="ellipsis" style="width: 150px">
                  <div class="text-subtitle1 text-bold text-primary ellipsis">{{item.name}}</div>
                  <div class="text-subtitle2 text-grey">Gestion</div>
                </q-card-section>
                <q-card-section>
                  <div class="row no-wrap items-center">
                    <q-btn flat dense @click="editTopic(item)">
                      <q-img src="edit.png" style="height: 35px; width: 35px;"/>
                    </q-btn>
                    <q-btn flat dense @click="eiminarTopic(item._id)">
                      <q-img src="delete.png" style="height: 35px; width: 35px;"/>
                    </q-btn>
                  </div>
                </q-card-section>
              </q-card-section>
            </q-card>
          </div>
        </q-scroll-area>
      </div>
    </div>
    <q-dialog v-model="nuevo" @hide="decartarCamb()">
      <q-card style="border-radius: 20px;">
        <q-card-section>
          <div class="text-h6">{{edit ? 'Editar Examen' : 'Crear Examen'}}</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-input rounded dense outlined type="text" v-model="form.name" label="Nuevo nombre" :error="$v.form.name.$error" error-message="Este campo es requerido"  @blur="$v.form.name.$touch()">
            <template v-slot:prepend>
              <q-icon name="edit" color="primary"/>
            </template>
          </q-input>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" v-close-popup @click="decartarCamb()" no-caps/>
          <q-btn flat :label="edit ? 'Actualizar' :  'Crear'" color="primary" v-close-popup @click="edit ? actualizarTopic() : nuevo ? crearTopic() : ''" no-caps/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <!-- <div class="text-h3 col-10 row justify-center q-my-sm text-primary text-weight-bolder">Fecha Examen</div>
    <q-card class="row justify-start bg-blue-2">
      <div class="column q-ma-md">
        <div class="text-h6 text-primary">Programar Nueva Fecha</div>
        <div class="row">
          <q-btn @click="newDE = true" class="text-subtitle1" padding="10px 5px" color="primary" icon="add" no-caps>Nueva</q-btn>
        </div>
      </div>
    </q-card>
    <q-dialog v-model="newDE" @hide="reload">
      <new-date-exam @close="closeComponent" :id="dateExam_id"/>
    </q-dialog>
    <div class="row justify-center">
      <listable style="min-width: 900px" :columns="columns" :data="data" @function="execute"/>
    </div> -->
  </div>
</template>

<script>
import { required, minLength, maxLength } from 'vuelidate/lib/validators'
export default {
  data () {
    return {
      edit: false,
      nuevo: false,
      form: {},
      blogs: [],
      file: null
    }
  },
  validations: {
    form: {
      name: { required, minLength: minLength(3), maxLength: maxLength(20) }
    }
  },
  mounted () {
    this.getBlogs()
  },
  methods: {
    actualizarBlog () {
      this.$v.form.$touch()
      if (!this.$v.form.$error) {
        this.$q.loading.show({
          message: 'Actualizando blog, Por Favor Espere...'
        })
        this.$api.put('/' + this.form._id, this.form).then((res) => {
          if (res) {
            this.$q.loading.hide()
            this.$q.notify({
              color: 'positive',
              message: 'Pregunta Actualizada Correctamente'
            })
            this.getTopics()
          }
        })
      }
    },
    decartarCamb () {
      this.form = {}
      this.edit = false
    },
    editBlog (itm) {
      if (itm) {
        const datos = { ...itm }
        this.form = datos
        this.nuevo = true
        this.edit = true
      } else {
        this.nuevo = true
      }
    },
    crearBlog () {
      this.$v.$touch()
      if (!this.$v.form.$error) {
        this.$q.loading.show({
          message: 'Subiendo blog, Por Favor Espere...'
        })
        this.$api.post('', this.form).then((res) => {
          if (res) {
            this.$q.loading.hide()
            this.$q.notify({
              color: 'positive',
              message: 'Pregunta Creada Correctamente'
            })
            this.getTopics()
          }
        })
      }
    },
    eiminarBlog (id) {
      this.$q.dialog({
        title: 'Confirma',
        message: '¿Seguro deseas eliminar este examen?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.$api.delete('/' + id).then(res => {
          if (res) {
            this.$q.notify({
              color: 'positive',
              message: 'Eliminado Correctamente'
            })
            this.getTopics()
          }
        })
      }).onCancel(() => {
        // console.log('>>>> Cancel')
      })
    },
    getBlogs () {
      this.$q.loading.show({
        message: 'Cargando datos...'
      })
      this.$api.get('blogs').then(res => {
        if (res) {
          this.blogs = res
          // console.log(this.blogs)
        }
        this.$q.loading.hide()
      })
    }
  }
}
</script>
