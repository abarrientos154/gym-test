<template>
  <div>
    <div style="background: linear-gradient(to right, #002938, #004e6d); height: 200px; width: 100%;"></div>
    <!-- <q-img src="noimg.png" style="border-bottom-left-radius: 10px; border-bottom-right-radius: 10px; height: 265px; width: 100%;"/> -->
    <div class="column q-pa-lg no-wrap" style="margin-top: -200px">
      <div class="text-h4 text-white text-bold q-mb-xl q-px-xl">Temas</div>
      <div>
        <div class="text-h5 text-white q-mb-sm q-px-md">Temas recientes</div>
        <!-- <q-scroll-area horizontal style="height: 230px">
          <div class="full-width row no-wrap">
            <q-card class="q-mr-md column bordes" v-for="(item, index) in topics" :key="index" style="width: 260px; border-radius: 20px;">
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
        </q-scroll-area> -->
      </div>
      <q-btn color="primary" dense no-caps size="md">
        <q-file borderless v-model="file" hint="(.xlsx)" accept=".xlsx, /*" @input="changeFile()" style="height: 30px; font-size: 0px"/>
        <div class="absolute-center">Importar archivo</div>
      </q-btn>
    </div>
    <div class="row justify-between">
      <q-btn color="primary" label="Nuevo Tema" icon="add" dense no-caps size="md" class="q-ml-md" @click="newTopic()"/>
      <q-btn color="red" label="Eliminar Temas" icon="delete" dense no-caps size="md" class="q-mr-md" @click="deleteAllTopics()"/>
    </div>
    <div class="row justify-center" style="height: 70%">
      <listable class="col" :columns="columns" :data="topics" title="Temas" @function="execute"/>
    </div>

    <q-dialog v-model="show" @hide="decartarCamb()">
      <q-card style="width:100%;border-radius: 20px;">
        <q-card-section>
          <div class="text-h6">{{editTopic ? 'Editar Tema' : 'Crear Tema'}}</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-avatar square size="200px" style="width: 100%" class="bg-grey row justify-center">
            <q-img :src="file2 !== null ? imgFile : editTopic ? typeof form.image === 'string' ? baseu + form.image : 'noimg.png' : ''" style="height: 100%">
              <q-file borderless v-model="file2" @input="test()" accept=".jpg, image/*" style="width: 100%; height: 100%; font-size: 0px" :error="$v.file2.$error" @blur="$v.file2.$touch()">
                <q-icon name="image" size="50px" color="white" />
              </q-file>
            </q-img>
          </q-avatar>
          <div :class="$v.file2.$error ? 'text-negative' : ''" class="q-my-sm">Sube la portada del Tema</div>
          <q-input dense outlined type="text" v-model="form.name" label="Nuevo Tema" :error="$v.form.name.$error" error-message="Este campo es requerido"  @blur="$v.form.name.$touch()">
          </q-input>
          <q-input dense outlined type="text" v-model="form.long_name" label="Nombre Completo" :error="$v.form.long_name.$error" error-message="Este campo es requerido"  @blur="$v.form.long_name.$touch()">
          </q-input>
          <q-input dense outlined type="text" v-model="form.topic" label="Número de Tema" :error="$v.form.topic.$error" error-message="Este campo es requerido"  @blur="$v.form.topic.$touch()">
          </q-input>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" v-close-popup @click="decartarCamb()" no-caps/>
          <q-btn flat :label="editTopic ? 'Actualizar' :  'Crear'" color="primary" @click="editTopic ? updateTopic() : setTopic()" no-caps/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import env from '../../env'
import Listable from '../../components/Listable.vue'
import { required } from 'vuelidate/lib/validators'
export default {
  components: { Listable },
  data () {
    return {
      editTopic: false,
      form: {},
      topics: [],
      file: null,
      columns: [
        { name: 'id', label: 'ID', align: 'left', field: 'id' },
        { name: 'topic', label: 'Tema', align: 'left', field: 'topic' },
        { name: 'long_name', label: 'Nombre Completo', align: 'left', field: 'long_name' },
        { name: 'name', align: 'left', label: 'Nombre', field: 'name' },
        { name: 'actions', required: true, align: 'left', field: 'actions', style: 'width: 9%' }
      ],
      show: false,
      courseId: '',
      imgFile: '',
      baseu: '',
      file2: null
    }
  },
  validations: {
    form: {
      name: { required },
      long_name: { required },
      topic: { required }
    },
    file2: { required }
  },
  mounted () {
    this.baseu = env.apiUrl + 'topics_img/'
    this.courseId = localStorage.getItem('course_id')
    this.getTopics()
  },
  methods: {
    updateTopic () {
      this.$v.form.$touch()
      if (!this.$v.form.$error) {
        this.$q.loading.show({
          message: 'Actualizando Tema, Por Favor Espere...'
        })
        const formData = new FormData()
        formData.append('image', this.file2)
        formData.append('data', JSON.stringify(this.form))
        this.$api.put('updateTopic/' + this.form._id, formData, {
          headers: {
            'Content-Type': undefined
          }
        }).then((res) => {
          if (res) {
            this.$q.loading.hide()
            this.$q.notify({
              color: 'positive',
              message: 'Tema Actualizado Correctamente'
            })
            this.file2 = null
            this.getTopics()
            this.show = false
          }
        })
      }
    },
    decartarCamb () {
      this.form = {}
      this.file2 = null
      this.show = false
      this.$v.$reset()
    },
    setTopic () {
      this.$v.$touch()
      if (!this.$v.form.$error && !this.$v.file2.$error) {
        this.$q.loading.show({
          message: 'Subiendo Tema, Por Favor Espere...'
        })
        this.form.course_id = this.courseId
        const formData = new FormData()
        formData.append('image', this.file2)
        formData.append('data', JSON.stringify(this.form))
        this.$api.post('setTopic', formData, {
          headers: {
            'Content-Type': undefined
          }
        }).then((res) => {
          if (res) {
            this.$q.loading.hide()
            this.$q.notify({
              color: 'positive',
              message: 'Tema Creado Correctamente'
            })
            this.getTopics()
            this.show = false
          }
        })
      }
    },
    deleteTopic (id) {
      this.$q.dialog({
        title: 'Confirma',
        message: '¿Seguro deseas eliminar este Tema?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.$api.delete('deleteTopic/' + id).then(res => {
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
    deleteAllTopics () {
      this.$q.dialog({
        title: 'Confirma',
        message: '¿Seguro deseas eliminar todos los temas?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.$api.delete('deleteAllTopics').then(res => {
          if (res) {
            this.$q.notify({
              color: 'positive',
              message: 'Temas eliminados Correctamente'
            })
            this.$router.go()
          }
        })
      }).onCancel(() => {
        // console.log('>>>> Cancel')
      })
    },
    async getTopics () {
      this.$q.loading.show({
        message: 'Cargando datos...'
      })
      await this.$api.get('getTopicsByCourse/' + this.courseId).then(res => {
        if (res) {
          this.topics = res
          this.$q.loading.hide()
        }
      })
    },
    changeFile () {
      if (this.file !== null) {
        this.$q.loading.show({
          message: 'Subiendo datos, esto puede tomar un tiempo...'
        })
        const formData = new FormData()
        formData.append('fileExcel', this.file)
        formData.append('courseId', this.courseId)
        this.$api.post('excel_topic', formData, {
          headers: {
            'Content-Type': undefined
          }
        }).then(res => {
          if (res) {
            this.$q.notify({
              message: 'Temas Cargados Correctamente',
              color: 'positive'
            })
            this.file = null
            this.getTopics()
            this.$q.loading.hide()
          }
        })
      }
    },
    async execute (emit) {
      if (emit.title === 'Eliminar') {
        this.deleteTopic(emit.id)
      } else if (emit.title === 'Editar') {
        await this.getTopicById(emit.id)
        this.editTopic = true
        this.show = true
      }
    },
    async getTopicById (id) {
      await this.$api.get('getTopicById/' + id).then(res => {
        if (res) {
          this.form = { ...res }
        }
      })
    },
    newTopic () {
      this.editTopic = false
      this.form = {}
      this.show = true
    },
    test () {
      if (this.file2) { this.imgFile = URL.createObjectURL(this.file2) }
    }
  }
}
</script>
