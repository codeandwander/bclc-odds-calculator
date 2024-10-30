<template>
  <span class="group relative -top-1 inline-block">
    <slot name="trigger"></slot>
    <span v-if="!$slots.trigger" class="w-[13px] h-[13px] inline-flex items-center justify-center bg-[#001941] rounded-full cursor-help ml-1">
      <span class="text-[10px] font-bold text-white">?</span>
    </span>
    <span class="invisible opacity-0 w-64 bg-[#001941] text-white text-center leading-snug text-[11px] rounded-md py-1 px-2 absolute z-10 bottom-full left-1/2 -translate-x-1/2 transition-opacity duration-300 group-hover:visible group-hover:opacity-100">
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