<template>
  <div class="c-room">
    <div class="c-room-list">
      <div class="c-room-list_item"></div>
      <div class="c-room-list_item"></div>
      <div class="c-room-list_item"></div>
      <div class="c-room-list_item"></div>
      <div class="c-room-list_item"></div>
      <div class="c-room-list_item"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class Rooms extends Vue {
  mounted() {
    console.log('aaa')
  }
}
</script>

<style lang="scss" scoped>
</style>