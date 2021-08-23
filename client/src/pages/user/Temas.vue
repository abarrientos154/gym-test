<template>
  <div>
    <q-btn class="absolute-top" round flat color="white" icon="arrow_back" @click="$router.go(-1)" />
    <q-img src="image 5.png" style="height: 350px; width: 100%; border-bottom-right-radius: 10px; border-bottom-left-radius: 10px">
        <div class="row items-center q-mb-xl absolute-bottom bg-transparent">
          <img src="balance 3.png" style="width: 50px" >
          <div class="text-h4 text-bold q-pl-sm">Test</div>
        </div>
    </q-img>

    <div class="q-mx-md q-pa-md bg-white" style="position:relative; top: -40px;border-top-left-radius: 20px; border-top-right-radius: 20px">
        <div class="text-bold text-primary">Temas</div>
        <div class="text-caption text-grey-8">Listado de temas disponibles</div>
        <q-scroll-area v-if="temas.length" horizontal class="q-my-md" :thumb-style="thumbStyle" style="height: 110px; width: 100%;">
          <div class="row no-wrap q-gutter-sm">
            <q-card flat style="width: 100px; height: 100px" clickable v-ripple v-for="(item, index) in temas" :key="index"
            >
              <q-img src="materia1 1.png" style="height: 100%; width: 100%;">
              </q-img>
            </q-card>
          </div>
        </q-scroll-area>

        <div class="text-bold text-primary">Sub temas</div>
        <div class="text-caption text-grey-8">Listado de sub temas disponibles</div>
        <q-scroll-area v-if="temas.length" horizontal class="q-my-md" :thumb-style="thumbStyle" style="height: 40px; width: 100%;">
          <div class="row no-wrap q-gutter-sm">
            <div v-for="(item, index) in 5" :key="index">
                <q-btn no-caps :outline="selecSub === item ? false : true" color="primary" label="Sub tema" style="width:140px" class="no-wrap"
                @click="selecSub = item" />
            </div>
          </div>
        </q-scroll-area>

        <div class="text-bold text-primary">Examenes</div>
        <div class="text-caption text-grey-8">Listado total de examenes</div>
        <div class="row q-mt-lg q-mb-xs">
            <div class="col-6 text-grey-8 text-caption">NOMBRE DEL EXAMEN</div>
            <div class="col-6 text-grey-8 text-caption">MEJOR CALIFICACIÓN</div>
        </div>
        <div v-for="(item, index) in 4" :key="index">
            <div class="row">
                <div class="col-6 text-grey-7 text-caption row no-wrap q-pr-md">
                    <div>{{index}}</div>
                    <div class="q-px-xs ellipsis">Examen</div>
                    <div>{{index}}</div>
                </div>
                <div class="col-6 text-grey-7 text-caption row no-wrap">
                    <div class="q-pr-xs ellipsis">10ptos/10ptos</div>
                    <q-card clickable v-ripple class="bg-primary q-px-sm">
                        <div class="text-center text-white text-caption"
                        @click="$router.push('/tema/idtema')">Realizar</div>
                    </q-card>
                </div>
            </div>
            <q-separator color="primary" class="q-my-xs" />
        </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      selecSub: null,
      thumbStyle: {
        right: '5px',
        borderRadius: '8px',
        backgroundColor: '#027be3',
        width: '8px',
        opacity: 0
      },
      temas: [1, 2, 3, 4, 5, 6]
    }
  },
  mounted () {
  },
  methods: {
  }
}
</script>

<style scoped lang="scss">
.bordes {
  border: 1px solid $primary;
}
</style>
