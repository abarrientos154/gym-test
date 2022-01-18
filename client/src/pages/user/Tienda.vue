<template>
  <div>
    <div class="row justify-center">
      <img src="app movil 16.png" style="height: 280px; width: 100%">
    </div>

    <div class="shadow-up-1 q-py-lg" style="border-top-left-radius: 20px; border-top-right-radius: 20px">
      <div class="text-grey-8 text-h6 q-pl-md">Tienda</div>
      <div class="text-grey-8 text-caption q-pl-md">Conoce las mejores ofertas de productos</div>
      <q-scroll-area horizontal class="q-mt-md" style="height: 300px; width: 100%;">
        <div class="row no-wrap q-px-md q-gutter-md">
          <q-card flat style="width: 160px" clickable v-ripple v-for="(item, index) in option" :key="index"
          @click="$router.push(item.ruta)">
            <img :src="item.img" style="height: 200px; width: 100%; border-radius: 10px">
            <div class="text-h6 text-grey-8">{{item.title}}</div>
            <div class="text-caption text-grey-8">{{item.description}}</div>
          </q-card>
        </div>
      </q-scroll-area>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MainLayout',
  data () {
    return {
      option: [
        {
          img: 'app movil 19.png',
          title: 'Puntos',
          description: 'Adquiere puntos para jugar contra amigos',
          ruta: '/carro_de_compra/puntos'
        },
        {
          img: 'app movil 20.png',
          title: 'Membresia',
          description: 'Adquiere los mejores para tu perfil',
          ruta: '/carro_de_compra/membresia'
        }
      ]
    }
  },
  mounted () {
  },
  methods: {
  }
}
</script>
