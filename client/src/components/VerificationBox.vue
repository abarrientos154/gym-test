<template>
  <div>
    <input
      class="code-input"
      v-model="checkCode"
      maxlength="4"
      type="number"
      id="code"
      @keyup.13="next()"
    />
    <label for="code">
      <div class="code-box">
        <div class="code-number bg-grey-3 q-mx-xs" v-for="(item, index) in length" :key="index">
          {{ checkCode[index] }}
        </div>
      </div>
    </label>
  </div>
</template>

<script>
export default {
  name: 'CodeInput',
  props: {
    length: {
      type: Number,
      default: 4
    }
  },
  data () {
    return {
      checkCode: ''
    }
  },
  methods: {
    getCode () {
      return this.checkCode
    },
    next () {
      if (this.checkCode.length > 3 && this.checkCode.length < 5) {
        this.$emit('code', this.checkCode)
      }
    }
  },
  watch: {
    checkCode: function (newCheckCode, oldCheckcode) {
      this.next()
    }
  }
}
</script>
<style scoped>
.code-box {
  display: inline-flex;
}
.code-number {
  width: 56px;
  height: 58px;
  border-radius: 8px;
  border-right: solid #cccccc 1px;
  text-align: center;
  font-size: 30px;
  color: #1783FA;;
}
.code-number:last-child {
  border-right: 0;
}
.code-input {
  position: absolute;
  outline: none;
  color: transparent;
  text-shadow: 0 0 0 transparent;
  width: 0%;
  height: 0%;
  margin-left: 40%;
  margin-top: 29%;
}
button {
  width: 100px;
  height: 60px;
}
</style>
