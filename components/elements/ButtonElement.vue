<template>
  <a class="button" :href="href">
    <span>
      <slot></slot>
    </span>
  </a>
</template>

<script>
export default {
  props: {
    href: {
      type: String,
      required: false
    }
  }
}
</script>

<style>
</style>

