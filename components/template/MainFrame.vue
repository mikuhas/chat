<template>
  <div class="c-frame">
    <Chat />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class MainChat extends Vue {
  @Prop({})
  rounded!: string;

  mounted() {
    console.log('aaa')
  }
}
</script>

<style lang="scss" scoped>
.c-frame {
  border: 2px solid black;
  border-radius: 10px;
  box-sizing: border-box;
  width: 1500px;
  height: 800px;
  overflow: hidden;
}
</style>