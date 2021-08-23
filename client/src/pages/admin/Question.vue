<template>
  <div>
    <div style="background: linear-gradient(to right, #002938, #004e6d); height: 200px; width: 100%;"></div>
    <!-- <q-img src="noimg.png" style="border-bottom-left-radius: 10px; border-bottom-right-radius: 10px; height: 265px; width: 100%;"/> -->
    <div class="column q-pa-lg no-wrap" style="margin-top: -200px">
      <div class="text-h4 text-white text-bold q-mb-xl q-px-xl">Preguntas</div>
      <div>
        <div class="text-h5 text-white q-mb-sm q-px-md">Preguntas recientes</div>
        <q-scroll-area horizontal style="height: 175px">
          <div class="full-width row no-wrap">
            <q-card class="q-mr-md column bordes" v-for="(item, index) in questions" :key="index" style="width: 275px;">
              <q-card-section class="col" horizontal>
                <q-card-section class="col column justify-between">
                  <div class="text-subtitle1 text-bold text-primary">{{item.title}}</div>
                  <div class="column justify-between">
                    <div class="row items-center text-grey">
                      <q-icon size="20px" name="date_range" class="q-mr-xs"/>
                      <div>{{item.tema}}</div>
                    </div>
                    <div class="row items-center text-grey">
                      <q-icon size="20px" name="account_tree" class="q-mr-xs"/>
                      <div>Gestion</div>
                    </div>
                    <div class="row items-center text-grey">
                      <q-icon size="20px" name="schedule" class="q-mr-xs"/>
                      <div>10 minutos</div>
                    </div>
                  </div>
                </q-card-section>
                <q-separator color="primary" vertical/>
                <q-card-section class="column">
                  <div class="col column items-center justify-between">
                    <q-btn flat dense>
                      <q-img src="visibility.png" style="height: 25px; width: 35px;"/>
                    </q-btn>
                    <q-btn flat dense @click="editQuestion(item)">
                      <q-img src="edit.png" style="height: 30px; width: 30px;"/>
                    </q-btn>
                    <q-btn flat dense @click="eiminarQuestion(item._id)">
                      <q-img src="delete.png" style="height: 30px; width: 30px;"/>
                    </q-btn>
                  </div>
                </q-card-section>
              </q-card-section>
            </q-card>
          </div>
        </q-scroll-area>
      </div>
      <q-btn color="primary" dense no-caps size="md">
        <q-file borderless v-model="file" hint="(.xls, .xlsx, .xltx, .ods, .ots, .csv)" accept=".xls, .xlsx, .xltx, .ods, .ots, .csv/*" @input="changeFile()" style="height: 30px; font-size: 0px"/>
        <div class="absolute-center">Importar archivo</div>
      </q-btn>
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
          <q-btn flat :label="edit ? 'Actualizar' :  'Crear'" color="primary" v-close-popup @click="edit ? actualizarQuestion() : nuevo ? crearQuestion() : ''" no-caps/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <!-- <div class="text-primary text-h5">{{course.name}}</div>
    <div class="text-black text-subtitle1 text-weight-bolder q-mb-lg">Niveles</div>
    <div class="column items-center" style="width: 100%" v-if="tests.length > 0">
      <q-card v-for="(item,index) in tests" clickable :key="index" class="q-pa-none q-mb-md" style="width: 98%; border-radius: 15px; min-width: 300px; max-width: 500px">
        <div class="row">
          <div class="col-6 q-pa-sm">
            <div class="text-h6" @click="$router.push('/preguntas/' + item._id)">{{item.title}}</div>
            <div class="absolute-bottom row q-pa-md">
              <q-btn flat dense round class="q-mx-sm" color="primary" icon="edit" @click="editTem(item)"/>
              <q-btn flat dense round class="q-mx-sm" color="red" icon="delete" @click="eiminarTem(item._id)"/>
            </div>
          </div>
          <div v-ripple class="col-6 q-pa-none" @click="$router.push('/preguntas/' + item._id)">
            <q-img :src="baseuNivel + item._id" style="height: 150px; width: 100%; border-top-right-radius: 15px; border-bottom-right-radius: 15px" />
          </div>
        </div>
      </q-card>
    </div>
    <q-card v-else class="shadow-2 q-ma-md q-pa-md">
      <div class="text-center text-subtitle1">Actualmente sin niveles...</div>
    </q-card>

    <q-dialog v-model="nuevo" @hide="decartarCamb()">
      <q-card style="width:100%">
        <q-card-section>
          <div class="text-h6">{{edit ? 'Editar Nivel' : 'Crear Nivel'}}</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <div class="column items-center q-pb-sm">
            <q-avatar size="100px" class="bg-grey-5">
              <q-img :src="edit ? imgNivel : nivelFile ? imgNivel : ''" style="height: 100%">
                <q-file borderless v-model="nivelFile" @input="changeFile()" accept=".jpg, image/*" style="width: 100%; height: 100%; font-size: 0px">
                  <q-icon name="cloud_upload" class="absolute-center q-mt-lg" size="45px" color="white" />
                </q-file>
              </q-img>
            </q-avatar>
            <div :class="$v.nivelFile.$error ? 'text-negative' : 'text-grey-9'">Imagen del nivel</div>
          </div>
          <q-input
            dense
            outlined
            type="text"
            v-model="form.title"
            label="Nuevo nombre"
            :error="$v.form.title.$error"
            error-message="Este campo es requerido"
            @blur="$v.form.title.$touch()"
          />
          <div class="row justify-around q-pb-md q-gutter-md">
            <div class="col">
              <div>Puntuación del nivel</div>
              <q-input
                  v-model.number="form.point"
                  type="number"
                  placeholder="0"
                  outlined
                  dense
                  :error="$v.form.point.$error"
                  error-message="Este campo es requerido"
                  @blur="$v.form.point.$touch()"
                />
            </div>
            <div class="col">
              <div>Duración del nivel</div>
              <q-input
                v-model.number="form.time"
                type="number"
                suffix="min"
                outlined
                dense
                :error="$v.form.time.$error"
                error-message="Este campo es requerido"
                @blur="$v.form.time.$touch()"
              />
            </div>
          </div>
          <q-toggle
            v-model="form.type"
            label="Nivel gratuito"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn label="Cancelar" color="primary" v-close-popup no-caps style="width:100px"/>
          <q-btn :label="edit ? 'Actualizar' :  'Guardar'" color="primary" no-caps style="width:100px"
          @click="edit ? actualizarTem() : crearTem()" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-page-sticky position="bottom-right" :offset="[20, 20]">
      <q-btn round icon="add" color="primary" size="20px" @click="editTem()"/>
    </q-page-sticky> -->
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
      questions: [],
      file: null
    }
  },
  validations: {
    form: {
      name: { required, minLength: minLength(3), maxLength: maxLength(20) }
    }
  },
  mounted () {
    this.getQuestion()
  },
  methods: {
    actualizarQuestion () {
      this.$v.form.$touch()
      if (!this.$v.form.$error) {
        this.$q.loading.show({
          message: 'Actualizando Examen, Por Favor Espere...'
        })
        this.$api.put('updateQuest/' + this.form._id, this.form).then((res) => {
          if (res) {
            this.$q.loading.hide()
            this.$q.notify({
              color: 'positive',
              message: 'Pregunta Actualizada Correctamente'
            })
            this.getQuestion()
          }
        })
      }
    },
    decartarCamb () {
      this.form = {}
      this.edit = false
    },
    editQuestion (itm) {
      if (itm) {
        const datos = { ...itm }
        this.form = datos
        this.nuevo = true
        this.edit = true
      } else {
        this.nuevo = true
      }
    },
    crearQuestion () {
      this.$v.$touch()
      if (!this.$v.form.$error) {
        this.$q.loading.show({
          message: 'Subiendo Examen, Por Favor Espere...'
        })
        this.$api.post('newQuest', this.form).then((res) => {
          if (res) {
            this.$q.loading.hide()
            this.$q.notify({
              color: 'positive',
              message: 'Pregunta Creada Correctamente'
            })
            this.getQuestion()
          }
        })
      }
    },
    eiminarQuestion (id) {
      this.$q.dialog({
        title: 'Confirma',
        message: '¿Seguro deseas eliminar este examen?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.$api.delete('destroyQuest/' + id).then(res => {
          if (res) {
            this.$q.notify({
              color: 'positive',
              message: 'Eliminado Correctamente'
            })
            this.getQuestion()
          }
        })
      }).onCancel(() => {
        // console.log('>>>> Cancel')
      })
    },
    getQuestion () {
      this.$q.loading.show({
        message: 'Cargando datos...'
      })
      this.$api.get('getQuestions').then(res => {
        if (res) {
          this.questions = res.slice(0, 10)
          // console.log(this.questions)
        }
        this.$q.loading.hide()
      })
    },
    changeFile () {
      if (this.file !== null) {
        this.$q.loading.show({
          message: 'Subiendo datos, esto puede tomar un tiempo...'
        })
        const formData = new FormData()
        formData.append('fileExcel', this.file)
        this.$api.post('excel_question', formData, {
          headers: {
            'Content-Type': undefined
          }
        }).then(res => {
          if (res) {
            this.$q.notify({
              message: 'Preguntas Cargadas Correctamente',
              color: 'positive'
            })
            this.file = null
            this.getQuestion()
          }
          this.$q.loading.hide()
        })
      }
    }
  }
}
</script>

<style scoped lang="scss">
.bordes {
  border-right: 10px solid $primary;
  border-radius: 20px;
}
</style>
