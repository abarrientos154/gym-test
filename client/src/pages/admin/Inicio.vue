<template>
  <div>
    <div style="background: linear-gradient(to right, #002938, #004e6d); height: 200px; width: 100%;"></div>
    <div class="column q-pa-lg no-wrap" style="margin-top: -200px">
      <q-card class="q-mb-md full-width row" style="border-radius: 20px">
        <q-card-section horizontal class="full-width justify-between">
          <q-card-section>
            <div class="row">
              <div class="text-h5 q-mr-xs">Bienvenido de nuevo</div>
              <div class="text-h5 text-bold text-primary">Admin</div>
            </div>
          </q-card-section>
          <q-card-section>
            <q-img src="study 1.png" class="q-pa-md" style="height: 200px; width: 300px;"/>
          </q-card-section>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
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
  border-left: 6px solid $primary;
  background-color: rgba(202, 202, 202, 0.474);
  border-radius: 12px;
}
</style>
