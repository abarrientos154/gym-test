<template>
  <div class="window-height window-width column">
    <div class="absolute-bottom full-width column no-wrap">
      <q-img src="study 1.png"/>
      <q-img src="gymtest 1.png" style="margin-bottom: -100px"/>
      <q-img src="fondo 2.png"/>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      form: {},
      timer: ''
    }
  },
  mounted () {
  },
  methods: {
    ejecutar () {
      this.$router.push('/pagina-principal')
    }
  },
  beforeDestroy () {
    clearInterval(this.timer)
  },
  created () {
    this.timer = setInterval(this.ejecutar, 8000)
  },
  cancelAutoUpdate () { clearInterval(this.timer) }
}
</script>
