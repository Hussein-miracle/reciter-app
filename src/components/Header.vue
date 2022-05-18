<template>
      <!-- Header -->
  <header id="header" class="bg-gray-700">
    <nav class="container mx-auto flex justify-start items-center py-5 px-4">
      <!-- App Name -->
      <a class="text-white font-bold uppercase text-2xl mr-4" href="#">Music</a>

      <div class="flex flex-grow items-center">
        <!-- Primary Navigation -->
        <ul class="flex flex-row mt-1">
          <!-- Navigation Links -->
          <li>
            <a class="px-2 text-white" href="#" @click.prevent="toggleAuthModal">Login / Register</a>
          </li>
          <li>
            <a class="px-2 text-white" href="#">Manage</a>
          </li>
        </ul>
      </div>
    </nav>
  </header>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
  name: 'Header',
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
  },
};
</script>

<style>

</style>
