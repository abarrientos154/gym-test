<template>
  <div>
    <q-card class="bg-primary no-border-radius q-pa-xl" style="width: 100vw; height: 100vh">
      <q-card class="row justify-center bg-grey-3" style="border-radius: 25px;">
        <q-img src="gymtest 1.png" style="width: 150px"/>
      </q-card>
      <div class="text-h3 text-center text-grey-3 text-weight-medium">Mis Cursos</div>
      <q-card class="bg-grey-3 row items-center justify-center q-mt-sm" style="border-radius: 16px" v-for="(item, index) in courses" :key="index">
        <div class="text-h6 text-bold">{{item.name}}</div>
        <q-btn class="q-ml-xs" icon="arrow_forward" flat color="primary" @click="selectCourse(item._id)"/>
      </q-card>
    </q-card>
  </div>
</template>
<script>
import { required } from 'vuelidate/lib/validators'
export default {
  data () {
    return {
      courses: [],
      form: {
        isEnabled: false
      },
      editCourse: false,
      show: false
    }
  },
  validations: {
    form: {
      name: { required }
    }
  },
  mounted () {
    this.getCourses()
  },
  methods: {
    getCourses () {
      this.$api.get('getCourses').then(res => {
        if (res) {
          this.courses = res
          console.log('this.courses :>> ', this.courses)
        }
      })
    },
    selectCourse (id) {
      localStorage.setItem('course_id', id)
      this.$router.push('/inicio')
    }
  }
}
</script>
