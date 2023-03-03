<template>
  <div id="app">
    <nav style="word-wrap: break-word;">

      <router-link style="margin:5px" :to="item.url" :key="index" v-for="item,index in pages">{{item.page}}</router-link>

    </nav>
    <router-view />
  </div>
</template>
<script>
export default {
  data(){
    return {
      pages:[]
    }
  },
  mounted() {
    const pages = []
    for (var i = 0; i <= 51; i++) {
      var page = i.toString();
      if (page.length < 2) {
        page = `0${page}`
      }
      pages.push({
        page,
        url:`/${page}`
      })
    }
    this.pages = pages
  }
}
</script>