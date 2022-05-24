<template>

  <app-header/>
  <router-view v-slot="{ Component }">
    <transition name="fade" mode="out-in">
    <component :is="Component"></component>
    </transition>
  </router-view>
  <music-player/>
  <auth-modal/>

</template>
<script>
import AppHeader from './components/Header.vue';
import AuthModal from './components/Auth.vue';
import MusicPlayer from './components/Player.vue';

export default {
  name: 'App',
  components: {
    AppHeader,
    AuthModal,
    MusicPlayer,
  },
  created() {
    this.$store.dispatch('init_login');
    // console.log(this.$store, 'store in app');
  },
};
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}

.fade-enter-from{
  opacity: 0;
}

.fade-enter-active{
  transition: all .5s linear;
}

.fade-leave-to{
  transition: all .5s linear;
  opacity: 0;
}
</style>
