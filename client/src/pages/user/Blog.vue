<template>
  <div>
    <q-btn class="absolute-top" round flat color="white" icon="arrow_back" @click="$router.go(-1)" />
    <q-img src="blog_user.png" style="height: 280px; width: 100%; border-bottom-right-radius: 10px; border-bottom-left-radius: 10px">
        <div class="row items-center absolute-bottom bg-transparent" style="padding-bottom: 100px">
          <img src="balance 3.png" style="width: 50px" >
          <div class="text-h4 text-bold q-pl-sm">Blog</div>
        </div>
    </q-img>

    <div class="q-mx-md q-pa-md bg-white" style="position:relative; top: -70px;border-top-left-radius: 20px; border-top-right-radius: 20px">
        <div class="text-bold text-primary">Publicaciones recientes</div>
        <div class="text-caption text-grey-8">Últimos artículos agregados</div>
        <q-scroll-area v-if="ultimos.length" horizontal class="q-my-md" :thumb-style="thumbStyle" style="height: 180px; width: 100%;">
          <div class="row no-wrap q-gutter-sm">
            <q-card flat style="width: 150px; height: 170px" clickable v-ripple v-for="(item, index) in ultimos" :key="index"
            @click="$router.push('/publicidad/' + item)">
              <q-img src="materia1 1.png" style="height: 100%; width: 100%;">
                <div class="absolute-full column justify-end">Nombre del blog</div>
              </q-img>
            </q-card>
          </div>
        </q-scroll-area>

        <div class="text-bold text-primary">Nuestras publicaciones</div>
        <div class="text-caption text-grey-8">Todas nuestras publicaciones</div>
        <div v-if="publicidades.length" class="q-pt-md">
          <q-card v-for="(item, index) in publicidades" :key="index" class="q-mb-md" style="width:100%; border-top-left-radius: 7px; border-top-right-radius: 7px">
            <q-img src="materia1 1.png" style="height: 130px; width: 100%; border-top-left-radius: 7px; border-top-right-radius: 7px" >
              <div class="absolute-full column justify-end items-end">
                Nombre del blog
              </div>
            </q-img>
            <div class="row items-center no-wrap q-pa-sm">
              <div class="col-4">
                <q-btn no-caps dense rounded color="primary" label="Ver más" class="q-px-md"
                @click="$router.push('/publicidad/' + item)" />
              </div>
              <div class="col-8 text-caption self-start q-pl-sm text-grey-8 ellipsis-2-lines">Descripción</div>
            </div>
          </q-card>
        </div>
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
      ultimos: [1, 2, 3, 4, 5, 6],
      publicidades: [1, 2, 3]
    }
  },
  mounted () {
  },
  methods: {
  }
}
</script>
