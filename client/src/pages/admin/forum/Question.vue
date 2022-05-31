<template>
  <div>
   <!--  <q-btn class="absolute-top-left" round flat color="white" icon="arrow_back" @click="$router.go(-1)" style="z-index: 5" /> -->
    <q-img src="fondo.png" style="height: 180px; width: 100%;">
        <div class="bg-transparent q-mt-lg" style="width:100%">
          <q-img src="gymtest 1.png" style="width: 150px"/>
        </div>
    </q-img>

    <div class="q-pa-md bg-white" style="position:relative; top: -40px;border-top-left-radius: 20px; border-top-right-radius: 20px">
      <div class="text-bold text-primary text-center text-italic text-h5">{{data.forum ? data.forum.title : ''}}</div>
      <q-card class="row no-wrap q-my-md bg-primary text-white" style="width: 100%; border-radius: 10px">
          <div class="q-pa-md column justify-center" style="border-bottom-left-radius:10px; border-top-right-radius:0">
            <q-avatar size="70px">
              <q-img :src="data.user ? data.user.perfile ? baseuPerfil + data.user._id : 'avatar gris 1.png' : ''" style="height: 100%;"/>
            </q-avatar>
            <div class="text-center text-caption text-bold">{{data.user ? data.user.name : ''}}</div>
          </div>
          <div class="q-pa-sm">
            <div class="absolute-right q-pa-sm">
              <div class="text-subtitle2 text-right">Fecha de publicación</div>
              <div class="text-right">{{data.date}}</div>
            </div>
            <div class="q-mt-xl text-italic"> {{data.question}}</div>
          </div>
      </q-card>

     <!--  <q-btn v-if="login && canResponse" color="primary" no-caps size="lg" @click="response = true" label="Responder" style="width:100%; border-radius:10px" /> -->

      <div v-if="data.responses" class="q-py-md">
        <q-card v-for="(item, index) in data.responses" :key="index" class="row no-wrap bordes q-mb-md" style="width: 100%; border-radius: 10px">
          <div class="bg-primary q-pa-md column justify-center" style="border-bottom-left-radius:10px; border-top-right-radius:0">
            <q-avatar size="70px">
              <q-img :src="item.user.perfile ? baseuPerfil + item.user._id : 'avatar gris 1.png'" style="height: 100%;"/>
            </q-avatar>
            <div class="text-center text-white text-caption text-bold">{{item.user.name}}</div>
          </div>
          <div class="q-pa-sm">
            <div class="absolute-right q-pa-sm">
              <div class="text-primary text-subtitle2 text-right">Fecha de publicación</div>
              <div class="text-grey-8 text-right">{{item.date}}</div>
            </div>
            <div class="q-my-xl text-italic"> {{item.response}}</div>
            <div class="row absolute-bottom-right q-pa-sm">
                <q-btn color="negative" flat dense no-caps label="Eliminar" icon="delete" @click="deleteResponse(item._id)"/>
            </div>
          </div>
        </q-card>
      </div>
    </div>

    <q-dialog v-model="response" @hide="decartarCamb()">
      <q-card style="width: 100%; border-radius:20px">
        <q-card-section>
          <div class="text-h6 text-center text-primary text-italic">Nueva Respuesta</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-input dense outlined rounded type="text" v-model="form.response" label="Escriba su pregunta"
            :error="$v.form.response.$error" error-message="Este campo es requerido"  @blur="$v.form.response.$touch()"/>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" v-close-popup @click="decartarCamb()" no-caps/>
          <q-btn :label="'Enviar'" color="primary" @click="setResponse()" no-caps/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import env from '../../../env'
import { required } from 'vuelidate/lib/validators'
export default {
  props: ['id'],
  data () {
    return {
      response: false,
      login: false,
      canResponse: false,
      baseuPerfil: '',
      thumbStyle: {
        right: '5px',
        borderRadius: '8px',
        backgroundColor: '#027be3',
        width: '8px',
        opacity: 0
      },
      data: {},
      form: {}
    }
  },
  validations: {
    form: {
      response: { required }
    }
  },
  async created () {
    this.baseuPerfil = env.apiUrl + 'perfil_img/'
    await this.getData()
  },
  methods: {
    deleteResponse (id) {
      this.$q.dialog({
        title: 'Confirmar',
        message: '¿Seguro deseas eliminar esta Respuesta?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.$api.put('deleteResponseQuestion/' + id).then(res => {
          if (res) {
            this.$q.notify({
              color: 'positive',
              message: 'Eliminado Correctamente'
            })
            this.getData()
          }
        })
      }).onCancel(() => {
        // console.log('>>>> Cancel')
      })
    },
    getData () {
      this.$api.get('questionAndResponses/' + this.id).then(res => {
        if (res) {
          this.data = res
          if (res.forum.response) {
            this.canResponse = true
          }
        }
      })
    },
    decartarCamb () {
      this.form = {}
      this.$v.$reset()
    },
    setResponse () {
      this.$v.$touch()
      if (!this.$v.form.$error) {
        this.$q.loading.show({
          message: 'Subiendo Respuesta, Por Favor Espere...'
        })
        this.form.question_id = this.data._id
        this.$api.post('/setResponse', this.form).then((res) => {
          if (res) {
            this.$q.loading.hide()
            this.$q.notify({
              color: 'positive',
              message: 'Respuesta enviada Correctamente'
            })
            this.form = {}
            this.response = false
            this.getData()
          } else {
            this.$q.loading.hide()
          }
        })
      }
    }
  }
}
</script>
