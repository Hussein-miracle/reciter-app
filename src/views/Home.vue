<template>
  <main>
  <!-- Introduction -->
  <section class="mb-8 py-20 text-white text-center relative">
    <div class="absolute inset-0 w-full h-full bg-contain introduction-bg"
      style="background-image: url(assets/img/header.png)"></div>
    <div class="container mx-auto">
      <div class="text-white main-header-content">
        <h1 class="font-bold text-5xl mb-5">Listen to the Holy Quran Chapters by Naseer Al-Qatami.</h1>
        <p class="w-full md:w-8/12 mx-auto">
          This is an act of ibadah may Allah SWT accept it.
          Thanks for visiting too,i really appreciate and enjoin you to use it more  and ask me to upload if there's a chapter you need.
        </p>
      </div>
    </div>

    <img class="relative block mx-auto mt-5 -mb-20 w-auto max-w-full"
      src="assets/img/introduction-music.png" alt="intro-music-img" />
  </section>

  <!-- Main Content -->
  <section class="container mx-auto">
    <div class="bg-white rounded border border-gray-200 relative flex flex-col">
      <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200" v-icon.yellow="'headphones-alt'">
        <span class="card-title">Songs</span>
        <!-- ICONS -->
      </div>
      <!-- Playlist -->
      <ol id="playlist">
        <song-item v-for="song in songs" :song="song" :key="song.id"/>
      </ol>
      <!-- .. end Playlist -->
    </div>
  </section>
  </main>
</template>
<script>
import fireFunctions from '@/includes/firebase';
import SongItem from '@/components/SongItem.vue';
// import { startAfter } from '@firebase/firestore';

const {
  songsCollection, getDocs, query, limit, startAfter, orderBy, getDoc, doc,
  // onSnapshot,
} = fireFunctions;
export default {
  name: 'Home',
  components: {
    SongItem,
  },
  data() {
    return {
      songs: [],
      maxPerPage: 5,
      pendingRequests: false,
    };
  },
  // eslint-disable-next-line no-empty-function
  async created() {
    await this.getSongs();
    window.addEventListener('scroll', this.handleScroll);
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    async getSongs() {
      if (this.pendingRequests) {
        return;
      }

      let querySnapshot;

      if (this.songs.length > 0) {
        const lastDoc = await getDoc(doc(songsCollection, this.songs[this.songs.length - 1].id));
        // console.log(lastDoc, 'lastDoc');

        querySnapshot = await getDocs(query(songsCollection, orderBy('modified_name'), startAfter(lastDoc), limit(this.maxPerPage)));
      } else {
        querySnapshot = await getDocs(query(songsCollection, orderBy('modified_name'), limit(this.maxPerPage)));
      }

      querySnapshot.forEach((docSnap) => {
        const song = { ...docSnap.data(), id: docSnap.id };
        this.songs.push(song);
      });
    },
    handleScroll() {
      // console.log(e, 'scroll event');
      const { scrollTop, offsetHeight } = document.documentElement;
      const { innerHeight } = window;

      const bottomOfWindow = Math.round(scrollTop) + innerHeight === offsetHeight;
      if (bottomOfWindow) {
        this.getSongs();
      }
    },
  },
};
</script>
