<template>
  <div>
    <div style="background: linear-gradient(to right, #002938, #004e6d); height: 200px; width: 100%;"></div>
    <!-- <q-img src="noimg.png" style="border-bottom-left-radius: 10px; border-bottom-right-radius: 10px; height: 265px; width: 100%;"/> -->
    <div class="column q-pa-lg no-wrap" style="margin-top: -200px">
      <div class="text-h4 text-white text-bold q-mb-xl q-px-xl">Foro</div>
      <div>
       <!--  <div class="text-h5 text-white q-mb-sm q-px-md">Listado de Foros creados</div> -->
      </div>
     <!--  <q-btn color="primary" label="Nuevo Foro" icon="add" dense no-caps size="md" class="q-ml-md" @click="newForum()"/> -->
    </div>

    <div class="row justify-around q-pt-md">
        <q-card v-for="(item, index) in forums" :key="index" style="width: 47%; border-radius: 10px">
          <div class="bg-primary text-white text-h6 q-pa-sm row justify-between items-center">
            <div>{{item.title}}</div>
            <!-- <div class="row">
              <q-btn color="white" flat round dense icon="edit" @click="setEditForum(item)"/>
              <q-btn color="white" flat round dense icon="delete" @click="deleteForum(item._id)"/>
            </div> -->
          </div>
          <div v-html="item.text" class="ellipsis-3-lines q-pa-sm"></div>
        </q-card>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      forums: []
    }
  },
  mounted () {
    this.courseId = localStorage.getItem('course_id')
    this.getForum()
  },
  methods: {
    async getForum () {
      this.$q.loading.show({
        message: 'Cargando datos...'
      })
      await this.$api.get('forumByCourse/' + this.courseId).then(res => {
        if (res) {
          this.forums = res
          this.$q.loading.hide()
        } else {
          this.$q.loading.hide()
          this.$q.notify({
            color: 'negative',
            message: 'Error al consultar datos'
          })
        }
      })
    }
  }
}
</script>
