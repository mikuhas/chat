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

  mounted() {}
}
</script>

<style lang="scss" scoped>
.c-frame {
  border: 2px solid black;
  border-radius: 10px;
  box-sizing: border-box;
  min-width: 400px;
  width: 100%;
  height: 800px;
  overflow: hidden;
}
</style>