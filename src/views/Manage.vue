/* eslint-disable no-alert no-restricted-globals */
/* eslint-disable no-alert */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-alert no-restricted-globals */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-restricted-globals */
<template>
  <section class="container mx-auto mt-6">
    <div class="md:grid md:grid-cols-3 md:gap-4">
      <div class="col-span-1">
        <upload ref="upload_ref" :addSong='addSong'/>
      </div>
      <div class="col-span-2">
        <div class="bg-white rounded border border-gray-200 relative flex flex-col">
          <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
            <span class="card-title">My Songs</span>
            <i class="fa fa-compact-disc float-right text-green-400 text-2xl"></i>
          </div>
          <div class="p-6">
            <composition-item v-for="(song,i) in songs" :key="song.id"
            :music="song"
            :updateSongs="updateSongs"
            :index='i'
            :handleDeleteSong='handleDeleteSong'
            :updateUnsavedFlag="updateUnsavedFlag"/>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Upload from '@/components/Upload.vue';
import CompositionItem from '@/components/CompositionItem.vue';
import fireFunctions from '@/includes/firebase';

const {
  songsCollection, getDocs, where, query, auth,
} = fireFunctions;
// import store from '@/store';

export default {
  name: 'Manage',
  data() {
    return {
      songs: [],
      unsavedFlag: false,
    };
  },
  components: {
    Upload,
    CompositionItem,
  },
  // beforeRouteEnter(to, from, next) {
  //   console.log('guards in manage comp');
  //   console.log(to, from);
  //   console.log(store.state.userLoggedIn, 'user in?');
  //   if (store.state.userLoggedIn) {
  //     next();
  //   } else {
  //     next({ name: 'home' });
  //   }
  // },
  // beforeRouteLeave(_, _, next) {
  //   this.$refs.upload_ref.cancelUploads();
  //   console.log(this.$refs.upload_ref, 'upload ref');
  //   next();
  // },
  beforeRouteLeave(to, from, next) {
    if (this.unsavedFlag === true) {
      // to
      // eslint-disable-next-line no-restricted-globals
      // eslint-disable-next-line no-alert
      // eslint-disable-next-line no-restricted-globals
      // eslint-disable-next-line no-alert
      const leave = window.confirm('You have unsaved changes.Are you sure you want to leave ?');
      next(leave);
    } else {
      next();
    }
  },
  async created() {
    const q = query(songsCollection, where('uid', '==', auth.currentUser.uid));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(this.addSong);
    // querySnapshot.forEach((doc) => {
    //   this.addSong(doc);
    //   // doc.data() is never undefined for query doc snapshots
    //   // const song = { ...doc.data(), id: doc.id };
    //   // // console.log(song, 'song to  be rendered');
    //   // this.songs.push(song);
    //   // // console.log(this.songs, 'songs to be mapped');
    //   // // console.log(doc.id, ' => ', doc.data());
    // });
  },
  methods: {
    updateSongs(i, values) {
      this.songs[i].modified_name = values.modified_name;
      this.songs[i].genre = values.genre;
    },
    handleDeleteSong(i) {
      this.songs.splice(i, 1);
    },
    addSong(songRef) {
      const newSong = {
        ...songRef.data(),
        id: songRef.id,
      };
      this.songs.push(newSong);
    },
    updateUnsavedFlag(value) {
      this.unsavedFlag = value;
    },
  },
};
</script>
