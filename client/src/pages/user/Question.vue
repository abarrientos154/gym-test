<template>
  <div>
    <q-btn class="absolute-top" round flat color="white" icon="arrow_back" style="z-index: 5"
    @click="$router.go(-1)" />
    <q-img src="fondo.png" style="height: 300px; width: 100%; border-bottom-right-radius: 10px; border-bottom-left-radius: 10px">
        <div class="absolute-full column justify-end">
            <div class="row no-wrap items-center" style="padding-bottom: 60px">
                <div v-if="data.forum" class="text-h5 text-bold q-pl-sm">{{data.forum['title']}}</div>
            </div>
        </div>
    </q-img>
    <div class="q-mx-md q-pa-md bg-grey-2" style="position:relative; top: -60px; border-radius: 20px; height: 100%">
        <q-card style="width: 47%; border-radius: 10px">
            <div class="bg-primary text-white text-h6 q-pa-sm row justify-between items-center">
                <q-img v-if="data.user" :src="data.user.perfile ? baseuPerfil + data.user._id : 'avatar gris 1.png'" class="bg-grey-5" style="width: 50px; height: 50px; border-radius: 100%"/>
                <div v-if="data.user">{{data.user.name}} {{data.created_at}}</div>
                <!-- <div class="row">
                <q-btn color="white" flat round dense icon="edit" @click="setEditForum(item)"/>
                <q-btn color="white" flat round dense icon="delete" @click="deleteForum(item._id)"/>
                </div> -->
            </div>
            <div class="q-pa-sm"> {{data.question}} </div>
        </q-card>
             <q-btn v-if="canResponse" color="primary" @click="response = true" label="Responder" />
        <div v-if="data.responses">
            <q-card v-for="(item, index) in data.responses" :key="index" style="width: 47%; border-radius: 10px">
            <div class="bg-primary text-white text-h6 q-pa-sm row justify-between items-center">
                <q-img :src="item.user.perfile ? baseuPerfil + user._id : 'avatar gris 1.png'" class="bg-grey-5" style="width: 50px; height: 50px; border-radius: 100%"/>
                <div>{{item.user.name}} {{item.created_at}}</div>
                <!-- <div class="row">
                <q-btn color="white" flat round dense icon="edit" @click="setEditForum(item)"/>
                <q-btn color="white" flat round dense icon="delete" @click="deleteForum(item._id)"/>
                </div> -->
            </div>
            <div class="q-pa-sm"> {{item.response}} </div>
            </q-card>
        </div>
    </div>
    <q-dialog v-model="response" @hide="decartarCamb()">
      <q-card style="width: 100%">
        <q-card-section>
          <div class="text-h6 text-center text-primary text-italic">{{'Crear Respuesta'}}</div>
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
import env from '../../env'
import { required } from 'vuelidate/lib/validators'
export default {
  data () {
    return {
      thumbStyle: {
        right: '5px',
        borderRadius: '8px',
        backgroundColor: '#027be3',
        width: '8px',
        opacity: 0
      },
      data: {},
      response: false,
      form: {},
      baseuPerfil: '',
      canResponse: false
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
    getData () {
      this.$api.get('questionAndResponses/' + this.$route.params.id).then(res => {
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
