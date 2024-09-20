<template>
  <span class="tooltip-container">
    <slot name="trigger"></slot>
    <span class="info-icon" v-if="!$slots.trigger">ⓘ</span>
    <span class="tooltip">
      <slot></slot>
    </span>
  </span>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'InfoTooltip',
});
</script>

<style scoped>
.tooltip-container {
  position: relative;
  display: inline-block;
}

.info-icon {
  font-size: 0.8em;
  color: #00823E;
  cursor: help;
  margin-left: 0.25rem;
}

.tooltip {
  visibility: hidden;
  width: 200px;
  background-color: #555;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px;
  position: absolute;
  z-index: 1;
  bottom: 125%;
  left: 50%;
  margin-left: -100px;
  opacity: 0;
  transition: opacity 0.3s;
}

.tooltip-container:hover .tooltip {
  visibility: visible;
  opacity: 1;
}
</style>