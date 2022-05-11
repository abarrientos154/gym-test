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
            <q-card class="q-pa-md q-mt-sm" style="border-radius: 10px" clickable v-ripple @click="verifyLicense(item2)"
              v-for="(item2, index2) in item.courses" :key="index2">
              <div class="text-primary text-subtitle1 text-bold">{{item2.name}}</div>
              <div class="q-pt-sm q-pb-lg">{{item2.description}}</div>
              <div v-if="item2.free" class="row justify-end absolute-bottom q-pa-xs">
                <q-chip color="green" text-color="white" dense class="q-px-md">Curso gratuito</q-chip>
              </div>
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
      user: {},
      courses: []
    }
  },
  mounted () {
    this.getCourses()
    this.getUser()
  },
  methods: {
    ...mapMutations('generals', ['logout']),
    async getUser () {
      await this.$api.get('user_info').then(res => {
        if (res) {
          this.user = res
        }
      })
    },
    getCourses () {
      this.$api.get('getCoursesClient').then(res => {
        if (res) {
          this.courses = res
        }
      })
    },
    verifyLicense (data) {
      if (data.free) {
        if (!this.user.disabled) {
          localStorage.setItem('course_id', data._id)
          this.$router.push('/inicio')
        } else {
          this.$q.dialog({
            title: 'Atención',
            message: 'Tu usuario ha sido suspendido, debes comunicarte con el admin',
            persistent: true
          }).onOk(() => {
            // ok
          })
        }
      } else {
        this.$api.get('get_License_course/' + data._id).then(res => {
          if (res && !res.disable) {
            localStorage.setItem('course_id', data._id)
            this.$router.push('/inicio')
          } else {
            this.$q.dialog({
              title: 'Atención',
              message: 'No tienes licencia para este curso ¿Deseas adquirir una nueva?',
              cancel: true,
              persistent: true
            }).onOk(() => {
              this.$router.push('/license/' + data._id)
            }).onCancel(() => {
              // console.log('>>>> Cancel')
            })
          }
        })
      }
    },
    cerrarSesion () {
      this.logout()
      this.$router.push('/login')
    }
  }
}
</script>
