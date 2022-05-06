<template>
  <q-layout>
    <q-page-container>
      <q-page class="bg-primary q-pa-lg">
          <q-card class="row justify-center q-py-lg q-mt-md bg-white" style="width: 100%; border-radius: 10px;">
            <q-img src="gymtest 1.png" style="width: 150px"/>
          </q-card>
          <q-btn flat dense no-caps label="Cerrar sesión" color="white" class="absolute-top-left q-mx-sm" @click="cerrarSesion()" />

          <div v-for="(item, index) in courses" :key="index" class="q-pt-md">
            <div class="text-h5 text-center text-white text-weight-medium q-my-xs">{{item.name}}</div>
            <q-card class="q-pa-md q-mt-sm" style="border-radius: 10px" clickable v-ripple @click="getLicense(item2._id)"
              v-for="(item2, index2) in item.courses" :key="index2">
              <div class="text-primary text-subtitle1 text-bold">{{item2.name}}</div>
              <div class="q-py-sm">{{item2.description}}</div>
            </q-card>
          </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>
<script>
import { mapMutations } from 'vuex'
export default {
  data () {
    return {
      courses: []
    }
  },
  mounted () {
    this.getCourses()
  },
  methods: {
    ...mapMutations('generals', ['logout']),
    getCourses () {
      this.$api.get('getCoursesClient').then(res => {
        if (res) {
          this.courses = res
        }
      })
    },
    getLicense (id) {
      this.$api.get('get_License_course/' + id).then(res => {
        if (res && !res.disable) {
          localStorage.setItem('course_id', id)
          this.$router.push('/inicio')
        } else {
          this.$q.dialog({
            title: 'Atención',
            message: 'No tienes licencia para este curso ¿Deseas adquirir una nueva?',
            cancel: true,
            persistent: true
          }).onOk(() => {
            this.$router.push('/license/' + id)
          }).onCancel(() => {
            // console.log('>>>> Cancel')
          })
        }
      })
    },
    cerrarSesion () {
      this.logout()
      this.$router.push('/login')
    }
  }
}
</script>
