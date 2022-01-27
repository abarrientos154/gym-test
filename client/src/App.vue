<template>
  <div id="q-app">
    <router-view />
  </div>
</template>
<script>
import { mapMutations } from 'vuex'
import Vue from 'vue'
import Vuelidate from 'vuelidate'
Vue.use(Vuelidate)
export default {
  name: 'App',
  data () {
    return {
      modal: true,
      dat: {}
    }
  },
  mounted () {
    this.universal()
  },
  methods: {
    ...mapMutations('generals', ['login']),
    universal () {
      const vm = this
      // alert(`metodo ${ this.$q.platform.is.mobile } hola`)
      if (this.$q.platform.is.mobile) {
        // alert('mobile del if')
        universalLinks.subscribe('ul_event_link', function (eventData) {
          vm.logeo_ok({ ...eventData.params })
          // alert(JSON.stringify(eventData))
          // vm.$router.push('/license')
        })
        universalLinks.subscribe('ul_recuperar', function (eventData) {
        if (eventData.params.codigo) {
          vm.$router.push('/recuperar_clave/' + eventData.params.codigo)
        }
      })
      }
    },
    logeo_ok (data) {
      this.$q.loading.show({
        message: 'Procesando'
      })
      this.$api.post('login_by_mail', { user_id: data.user_id }).then(resp => {
        if (resp) {
          this.$q.loading.hide()
          const est = data.cancel ? '2' : '1'
          this.login(resp)
          this.$router.push('/license/' + est + '/' + data.ref)
        } else {
          this.$q.notify({
            message: 'err' + resp,
            color: 'negative'
          })
          this.$q.loading.hide()
          console.log('hubo un error')
        }
      }).catch(err => {
        this.$q.notify({
          message: 'err' + err,
          color: 'negative'
        })
      })
    }
  }
}
</script>
