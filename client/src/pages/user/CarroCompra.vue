<template>
  <div>
    <q-btn class="absolute-top" round flat color="white" icon="arrow_back" @click="$router.go(-1)" />
    <div class="row justify-center">
      <img src="app movil 10.png" style="height: 280px; width: 100%">
    </div>

    <div class="shadow-up-1 q-py-lg" style="border-top-left-radius: 20px; border-top-right-radius: 20px">
      <div class="text-grey-8 text-h6 q-pl-md">Mi carro de compra</div>
      <div class="text-grey-8 text-caption q-pl-md">Aquí podrás adquirir los puntos o las membresias que necesites</div>
      <div v-if="puntos" class="row items-start q-px-sm q-mt-md" style="width:100%">
        <div>
            <q-img src="app movil 33.png" style="width:100px; height: 100px; border-radius: 15px" />
        </div>
        <div class="col q-pl-md">
            <div class="text-grey-8 text-h5">Puntos</div>
            <div class="text-grey-8 text-caption">Selecciona los puntos que desees</div>
            <div class="row items-center justify-between">
                <div class="text-grey-8 text-h6"><b>Costo </b>$20</div>
                <div class="row items-center q-pr-sm">
                    <q-btn round flat dense icon="remove" color="grey-8" @click="editCantidad(false)" />
                    <q-btn round flat dense icon="add" color="grey-8" @click="editCantidad(true)" />
                    <div class="text-grey-8 text-h6">{{cantidad}}</div>
                </div>
            </div>
        </div>
      </div>

      <div v-if="membresia" class="row items-start q-px-sm q-mt-md" style="width:100%">
        <div>
            <q-img src="app movil 33.png" style="width:100px; height: 100px; border-radius: 15px" />
        </div>
        <div class="col q-pl-md">
            <div class="text-grey-8 text-h5">Membresia</div>
            <div class="text-grey-8 text-caption">Selecciona los meses que deseas pagar</div>
            <div class="row items-center justify-between">
                <div class="text-grey-8 text-h6"><b>Costo </b>$20</div>
                <div class="row items-center q-pr-sm">
                    <q-btn round flat dense icon="remove" color="grey-8" @click="editCantidad(false)" />
                    <q-btn round flat dense icon="add" color="grey-8" @click="editCantidad(true)" />
                    <div class="text-grey-8 text-h6">{{cantidad}}</div>
                </div>
            </div>
        </div>
      </div>

      <div class="row justify-center q-pt-xl">
          <q-btn no-caps color="black" label="Pagar" style="width: 90%" @click="compraExitosa = true" />
      </div>

      <q-dialog v-model="compraExitosa" persistent maximized>
          <q-card style="width:100%;">
            <img src="app movil 11.png" style="width:100%; height: 100%;" />
            <div class="absolute-bottom q-pb-md column items-center" style="width: 100%">
                <div class="q-pb-xl text-h5 text-center">Tu compra se realizó <br> con <b>Éxito</b></div>
                <q-btn no-caps color="black" label="Volver" style="width: 90%" @click="$router.go(-1)" />
            </div>
          </q-card>
      </q-dialog>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      puntos: false,
      membresia: false,
      compraExitosa: false,
      cantidad: 1,
      data: []
    }
  },
  mounted () {
    if (this.$route.params.compra === 'puntos') {
      this.puntos = true
    } else {
      this.membresia = true
    }
  },
  methods: {
    editCantidad (bool) {
      if (bool) {
        this.cantidad = this.cantidad + 1
      } else {
        if (this.cantidad > 0) {
          this.cantidad = this.cantidad - 1
        }
      }
    }
  }
}
</script>
