<template>
  <div>
    <q-card class="bg-primary no-border-radius q-pa-xl" style="width: 100vw; height: 100vh">
      <q-card class="row justify-center bg-grey-3" style="border-radius: 25px;">
        <q-img src="gymtest 1.png" style="width: 150px"/>
      </q-card>
      <div class="text-h5 text-center text-grey-3 text-weight-medium q-my-xs">Cursos Disponibles</div>
      <q-card class="bg-grey-3 row items-center justify-center q-mt-sm" style="border-radius: 16px" v-for="(item, index) in courses" :key="index">
        <div class="text-h6 text-bold">{{item.name}}</div>
        <q-btn class="q-ml-xs" icon="arrow_forward" flat color="primary" @click="selectCourse(item._id)"/>
      </q-card>
    </q-card>
  </div>
</template>
<script>
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
    getCourses () {
      this.$api.get('getCoursesClient').then(res => {
        if (res) {
          this.courses = res
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
