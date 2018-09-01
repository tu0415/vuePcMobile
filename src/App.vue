<template>
  <div id="app">
    <!-- 头部 -->
    <headerContent v-if="!$route.meta.hide"></headerContent>
    <!-- 内容 -->
    <div class="container">
      <transition :name="transitionName">
        <router-view></router-view>
      </transition>
    </div>
    <!-- 底部 -->
    <footerContent v-if="!$route.meta.hide"></footerContent>
  </div>
</template>

<script>
  import headerContent from './components/headerContent.vue'
  import footerContent from './components/footerContent.vue'
  export default {
    name: 'App',
    data(){
      return {
	    transitionName: "slide-left"
      }
    },
    components: {
      headerContent,
      footerContent
    }
  }
</script>

<style scoped>
  #app{
    position:relative;
    width:100%;
    min-width: 1120px;
    min-height: 100vh;
    flex-direction: column;
    display: -webkit-flex;
    display: flex;
    display: -webkit-box;
    display: -moz-box;
    display: -ms-flexbox;
  }
  .container{
    flex: 1;
    -webkit-flex: 1;
    -ms-flex: 1;
    -webkit-box-flex: 1;
    -moz-box-flex: 1;
    width: 100%;
    background: #eeeeee;
  }
</style>
