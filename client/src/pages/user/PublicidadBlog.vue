<template>
  <div>
    <q-btn class="absolute-top" round flat color="white" icon="arrow_back" @click="$router.go(-1)" />
    <q-img src="articulo 1.png" style="height: 300px; width: 100%; border-bottom-right-radius: 10px; border-bottom-left-radius: 10px">
        <div class="absolute-full column justify-end">
            <div class="row no-wrap items-center" style="padding-bottom: 60px">
                <img src="balance 3.png" style="width: 50px" >
                <div class="text-h5 text-bold q-pl-sm">Nombre del blog </div>
            </div>
        </div>
    </q-img>

    <div class="q-mx-md q-pa-md bg-white" style="position:relative; top: -60px;border-top-left-radius: 20px; border-top-right-radius: 20px">
        <div class="text-grey-8 q-mb-lg q-mt-sm">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </div>

        <div class="text-h6 text-bold text-primary q-mt-sm">Más de nuestro Blog</div>
        <div class="row justify-between">
          <div class="col text-caption text-grey-8">Lee nuestro blog para potenciar tu aprendizaje</div>
          <div class="col-2 text-caption text-primary cursor-pointer"
          @click="$router.push('/blog_user')">Ver todo</div>
        </div>
        <q-scroll-area v-if="publicidades.length" horizontal class="q-mt-md" :thumb-style="thumbStyle" style="height: 270px; width: 100%;">
          <div class="row no-wrap q-gutter-md">
            <q-card flat style="width: 200px; height: 200px" clickable v-ripple v-for="(item, index) in publicidades" :key="index"
            >
              <q-img src="materia1 1.png" style="height: 100%; width: 100%; border-radius: 10px">
                <div class="absolute-full column justify-end">
                  <div class="text-h6 text-center">Nombre del blog</div>
                </div>
              </q-img>
              <div class="text-caption text-grey-7 q-pt-sm q-px-xs ellipsis-3-lines">Descripción del blog</div>
            </q-card>
          </div>
        </q-scroll-area>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      thumbStyle: {
        right: '5px',
        borderRadius: '8px',
        backgroundColor: '#027be3',
        width: '8px',
        opacity: 0
      },
      publicidades: [1, 2, 3]
    }
  },
  mounted () {
  },
  methods: {
  }
}
</script>
