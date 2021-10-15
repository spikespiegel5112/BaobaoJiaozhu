<template>
  <div v-show="loading===true" class="common_loading_wrapper" :style="relativeStyle">
    <div class="box">
      <div class="loader-16"></div>
      <p>{{text}}</p>
    </div>
  </div>
</template>

<script>
  export default {
    name: "common-loading",
    props: {
      loading: {
        type: Boolean,
        default: true,
        required: true
      },
      relative: {
        type: Boolean,
        default: true,
      },
      text:{
        type: String,
        default: '载入中',
        required: false
      }
    },
    computed:{
      relativeStyle(){
        return this.relative?{ position:'relative'}:{}
      }
    }
  }
</script>

<style scoped>

</style>
