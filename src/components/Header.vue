<template>
      <!-- Header -->
  <header id="header" class="bg-gray-700">
    <nav class="container mx-auto flex justify-start items-center py-5 px-4">
      <!-- App Name -->
      <router-link class="text-white font-bold uppercase text-2xl mr-4" exact-active-class="no-active" :to="{name:'home'}">Reciter</router-link>

      <div class="flex flex-grow items-center">
        <!-- Primary Navigation -->
        <ul class="flex flex-row mt-1">
          <!-- Navigation Links -->
          <li v-if="!user">
            <a class="px-2 text-white" href="#" @click.prevent="toggleAuthModal">Login / Register</a>
          </li>
          <template v-else>
            <li >
            <router-link class="px-2 text-white" :to="{name:'manage'}">Manage</router-link>
          </li>
            <li >
            <a class="px-2 text-white" href="#" @click.prevent="signout">Log Out</a>
          </li>
          </template>

        </ul>
      </div>
    </nav>
  </header>
</template>

<script>
import { mapMutations, mapState } from 'vuex';
// import { mapMutations, mapState, mapActions } from 'vuex';

export default {
  name: 'Header',
  computed: {
    ...mapState({
      user: 'userLoggedIn',
    }),
    // ...mapState(['authModalShow']),
  },
  methods: {
    // this is the way to change a state in vuex using the mutations funct directly without having to create another funct to call the functions in the mutations object
    ...mapMutations(['toggleAuthModal']),
    // this is the way to change a state in vuex using the mutations funct and committing a mutation
    // toggleAuth() {
    //   this.$store.commit('toggleAuthModal');
    // },
    // this is the way to change a state in vuex by access the state directly
    // toggleMod() {
    //   this.$store.state.authModalShow = !this.$store.state.authModalShow;
    //   console.log(this.$store.state.authModalShow, 'store');
    // },
    // async signout() {
    //   await this.$store.dispatch('signout');
    // },
    // ...mapActions(['signout']),
    signout() {
      this.$store.dispatch('signout', {
        router: this.$router,
        route: this.$route,
      });
      // console.log(this.$route, 'in header');

      // if (this.$route.meta.requiresAuth) {
      //   this.$router.push({ name: 'home' });
      // }
    },
  },
};
</script>

<style>

</style>
