<template>
  <q-layout>
    <q-page-container>
      <q-page class="bg-primary q-pa-lg">
          <q-card class="row justify-center q-py-lg q-mt-md bg-white" style="width: 100%; border-radius: 10px;">
            <q-img src="gymtest 1.png" style="width: 150px"/>
          </q-card>
          <q-btn v-if="login" flat dense no-caps label="Cerrar sesión" color="white" class="absolute-top-left q-mx-sm" @click="cerrarSesion()" />
          <q-btn v-else flat dense icon="arrow_back" color="white" class="absolute-top-left q-mx-sm" @click="$router.go(-1)" />

          <div v-for="(item, index) in courses" :key="index" class="q-pt-md">
            <q-expansion-item
              class="bg-transparent overflow-hidden"
              header-class="bg-white"
              style="border-radius:15px"
            >
              <template v-slot:header>
                <div class="text-primary text-h6 full-width text-center q-ma-md">{{item.name}}</div>
              </template>
              <q-card class="bg-transparent">
                <q-card class="q-pa-md q-mt-sm" style="border-radius: 10px" clickable v-ripple @click="login ? verifyLicense(item2) : seeDetails(item2)"
                  v-for="(item2, index2) in item.courses" :key="index2">
                  <div class="text-primary text-subtitle1 text-bold">{{item2.name}}</div>
                  <div class="q-pt-sm q-mb-lg">
                    <div v-html="item2.description" class="ellipsis-3-lines"></div>
                  </div>
                  <div v-if="item2.free" class="row justify-end absolute-bottom q-pa-xs">
                    <q-chip color="green" text-color="white" dense class="q-px-md">Curso gratuito</q-chip>
                  </div>
                </q-card>
              </q-card>
            </q-expansion-item>
            <!-- <div class="text-h5 text-center text-white text-weight-medium q-my-xs">{{item.name}}</div>
            <q-card class="q-pa-md q-mt-sm" style="border-radius: 10px" clickable v-ripple @click="login ? verifyLicense(item2) : seeDetails(item2)"
              v-for="(item2, index2) in item.courses" :key="index2">
              <div class="text-primary text-subtitle1 text-bold">{{item2.name}}</div>
              <div class="q-pt-sm q-mb-lg">
                <div v-html="item2.description" class="ellipsis-3-lines"></div>
              </div>
              <div v-if="item2.free" class="row justify-end absolute-bottom q-pa-xs">
                <q-chip color="green" text-color="white" dense class="q-px-md">Curso gratuito</q-chip>
              </div>
            </q-card> -->
          </div>

          <q-dialog v-model="details" persistent maximized>
            <q-card class="q-pa-md column justify-between no-wrap">
              <div>
                <q-card class="row justify-center q-py-lg q-mt-md bg-grey-5" style="width: 100%; border-radius: 10px;">
                  <q-img src="gymtest 1.png" style="width: 150px"/>
                </q-card>

                <div class="text-center text-primary text-h5 text-bold q-pt-md">{{course.name}}</div>
                <div v-if="course.free" class="row justify-center q-pa-xs">
                  <q-chip color="green" text-color="white" dense class="q-px-md">Curso gratuito</q-chip>
                </div>
                <div v-html="course.description" class="q-py-md"></div>
                </div>

              <div class="q-pb-md q-px-md column items-center">
                <q-btn v-if="login" no-caps label="Adquirir curso" color="primary" size="lg" style="width:100%" @click="$router.push('/license/' + course._id)" />
                <div v-else class="q-py-md">
                  <div class="text-grey-8 text-subtitle1 text-center">Para {{course.free ? 'entrar' : 'adquirirlo'}} debes <b class="text-primary cursor-pointer" @click="$router.push('/login')">Iniciar Sesión</b> o <b class="text-primary cursor-pointer" @click="$router.push('/registro')">Registrarte</b></div>
                </div>
                <q-btn no-caps flat color="primary" label="Volver" class="q-mt-md" @click="details = false" />
              </div>
            </q-card>
          </q-dialog>
      </q-page>
    </q-page-container>
  </q-layout>
</template>
<script>
import { mapMutations } from 'vuex'
export default {
  data () {
    return {
      login: false,
      details: false,
      user: {},
      course: {},
      courses: []
    }
  },
  mounted () {
    this.getCourses()
    const value = localStorage.getItem('SESSION_INFO')
    if (value) {
      this.login = true
      this.getUser()
    } else {
      this.login = false
    }
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
    seeDetails (data) {
      this.course = data
      this.details = true
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
            this.seeDetails(data)
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
