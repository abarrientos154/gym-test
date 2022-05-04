<template>
  <div>
    <q-card class="bg-primary no-border-radius q-pa-lg" style="width: 100vw; height: 100vh">
      <q-card class="row justify-center q-py-lg bg-white" style="width: 100%; border-radius: 10px;">
        <q-img src="gymtest 1.png" style="width: 150px"/>
      </q-card>

      <div v-for="(item, index) in courses" :key="index" class="q-pt-md">
        <div class="text-h5 text-center text-white text-weight-medium q-my-xs">{{item.name}}</div>
        <q-card class="q-pa-md q-mt-sm" style="border-radius: 10px" clickable v-ripple @click="selectCourse(item2._id)"
          v-for="(item2, index2) in item.courses" :key="index2">
          <div class="text-primary text-subtitle1 text-bold">{{item2.name}}</div>
          <div class="q-py-sm">{{item2.description}}</div>
          <div>
            <q-chip dense color="primary" text-color="white" class="q-px-md">${{item2.price}}</q-chip>
          </div>
        </q-card>
      </div>
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
