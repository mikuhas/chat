<template>
  <div class="c-drawer"></div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class Rooms extends Vue {
  state = { stack: [] } //各ページエレメントの格納場所
  componentStack = [] // 各ページのコンポーネントを格納

  mounted() {
    console.log(this.$router)
    // this.state.stack.push('Rooms')
  }
}
</script>
<style lang="scss" scoped>
</style>