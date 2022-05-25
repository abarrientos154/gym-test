<template>
  <div class="column items-center">
      <q-btn class="absolute-top-left" round flat color="white" icon="arrow_back" @click="$router.go(-1)" style="z-index:5" />
      <q-img src="fondo.png" style="height: 180px; width: 100%;">
        <div class="bg-transparent q-mt-lg" style="width:100%">
          <div>
            <q-img src="gymtest 1.png" style="width: 150px"/>
          </div>
        </div>
      </q-img>

      <div class="q-pa-md bg-white" style="position:absolute; top: 140px; padding-bottom: 100px; width:100%; border-top-left-radius: 20px; border-top-right-radius: 20px">
        <div class="text-bold text-primary text-center text-italic text-h5">Mis estadísticas</div>

        <q-scroll-area horizontal class="q-mt-md" :thumb-style="thumbStyle" style="height: 50px; width: 100%;">
          <div class="row items-center no-wrap q-gutter-xs q-pr-sm q-py-sm" style="height:100%">
            <div v-for="(item, index) in types" :key="index">
              <q-chip clickable color="primary" :outline="type === item.value ? false : true"
                :text-color="type === item.value ? 'white' : 'primary'" @click="selecType(item.value)">
                {{item.label}}
              </q-chip>
            </div>
          </div>
        </q-scroll-area>

        <div class="q-pt-md" v-for="(item, index) in data" :key="index">
            <q-card class="bordes q-pa-sm row justify-between text-primary text-bold text-caption" style="width: 100%">
                <div class="col-5 text-center ellipsis">{{type === 2 ? item.type_name : item.examen_name}}</div>
                <div class="col-3 text-center">{{item.fecha}}</div>
                <div class="col-4 text-center">{{item.correctas}} / {{type === 2 ? item.total_quest : item.all_quest}}</div>
            </q-card>
        </div>
      </div>
  </div>
</template>

<script>
export default {
  name: 'Statistics',
  data () {
    return {
      courseId: '',
      type: 2,
      thumbStyle: {
        right: '5px',
        borderRadius: '8px',
        backgroundColor: '#027be3',
        width: '8px',
        opacity: 0
      },
      rutinaExamen: [],
      rutinaGym: [],
      data: [],
      types: [
        // { value: 1, label: 'Tests' },
        { value: 2, label: 'Rutinas de Entrenamiento' },
        { value: 3, label: 'Mis Exámenes' }
      ]
    }
  },
  mounted () {
    this.courseId = localStorage.getItem('course_id')
    this.getRutinas()
  },
  methods: {
    async getRutinas () {
      await this.$api.get('mis_examenes/' + this.courseId).then(v => {
        if (v) {
          this.rutinaExamen = v
        }
      })
      await this.$api.get('mis_rutinas/' + this.courseId).then(v => {
        if (v) {
          this.rutinaGym = v
        }
      })
      this.selecType(this.type)
    },
    selecType (val) {
      this.type = val
      if (val === 2) {
        this.data = this.rutinaGym
      } else if (val === 3) {
        this.data = this.rutinaExamen
      }
    }
  }
}
</script>

<style scoped lang="scss">
.bordes {
  border: 1px solid $primary;
  border-radius: 10px;
}
</style>
