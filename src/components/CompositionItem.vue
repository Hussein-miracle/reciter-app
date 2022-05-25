<template>
<div class="border border-gray-200 p-3 mb-4 rounded">
              <div  v-show="!showForm">
                <h4 class="inline-block text-2xl font-bold">{{music.modified_name.split('.')[0]}}</h4>
                <button class="ml-1 py-1 px-2 text-sm rounded text-white bg-red-600 float-right" @click.prevent="deleteSong">
                  <i class="fa fa-times"></i>
                </button>
                <button class="ml-1 py-1 px-2 text-sm rounded text-white bg-blue-600 float-right" @click.prevent="showForm = true">
                  <i class="fa fa-pencil-alt"></i>
                </button>
              </div>
              <div  v-show="showForm">
              <div class="text-white text-center font-bold p-4 mb-4" v-show="show_alert" :class="alert_variant">{{alert_msg}}</div>
                <VeeForm :validation-schema="songSchema"  :initial-values='music' @submit="edit">
                  <div class="mb-3">
                    <label class="inline-block mb-2" for="song-title">Song Title</label>
                    <VeeField type="text" id="song-title" name='modified_name'
                    @input="updateUnsavedFlag(true)"
                      class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300
                        transition duration-500 focus:outline-none focus:border-black rounded"
                      placeholder="Enter Song Title" />
                      <ErrorMessage class="text-red-600"  name="modified_name"/>
                  </div>
                  <div class="mb-3">
                    <label class="inline-block mb-2" for="genre">Genre</label>
                    <VeeField type="text" id="genre"
                    @input="updateUnsavedFlag(true)"
                    name='genre'
                      class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300
                        transition duration-500 focus:outline-none focus:border-black rounded"
                      placeholder="Enter Genre" />
                      <ErrorMessage class="text-red-600"  name="genre"/>
                  </div>
                  <button type="submit" class="py-1.5 px-3 rounded text-white bg-green-600" :disabled="song_in_submission">
                    Submit
                  </button>
                  <button type="button" class="py-1.5 px-3 rounded text-white bg-gray-600" @click.prevent="showForm = false" :disabled="song_in_submission">
                    Go Back
                  </button>
                </VeeForm>
              </div>
            </div>
</template>

<script>
import fireFunctions from '@/includes/firebase';

const {
  songsCollection, doc, updateDoc, storage, ref, deleteObject, deleteDoc,
  // onSnapshot,
} = fireFunctions;
export default {
  name: 'CompositionItem',
  props: {
    music: {
      type: Object,
      required: true,
    },
    updateSongs: {
      type: Function,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
    handleDeleteSong: {
      type: Function,
      required: true,
    },
    updateUnsavedFlag: {
      type: Function,
      // required: true,
    },
  },
  data() {
    return {
      showForm: false,
      songSchema: {
        modified_name: 'required',
        genre: 'alpha_spaces',
      },
      song_in_submission: false,
      show_alert: false,
      alert_variant: 'bg-blue-500',
      alert_msg: 'Please wait! Updating song data..',
    };
  },
  methods: {
    async edit(values) {
      // console.log(values, 'song edited');
      // const { modified_name: modifiedName } = values;
      this.song_in_submission = true;
      this.show_alert = true;
      this.alert_variant = 'bg-blue-500';
      this.alert_msg = 'Please wait! Updating song data..';

      const songIdRef = doc(songsCollection, `${this.music.id}`);

      // console.log(songIdRef, 'songRef');
      try {
        // Set the "capital" field of the city 'DC'
        await updateDoc(songIdRef, {
          ...values,
        });

        // NOTE: THIS PROCESS WAS WRONG BECAUSE YOU CAN'T MUTATE A PARENT'S DATA
        // onSnapshot(songIdRef, (docSnap) => {
        //   console.log({ ...docSnap.data() }, 'doc snap when song is updated');
        //   this.song = { ...docSnap.data() };
        //   this.updateSongs(this.song);
        //   console.log(this.song, 'current song update');
        // });
      } catch (err) {
        // console.log(err, 'song update error');
        this.alert_variant = 'bg-red-500';
        this.alert_msg = 'Unable to update song data';
        return;
      }

      this.updateSongs(this.index, values);
      this.updateUnsavedFlag(false);
      this.alert_variant = 'bg-green-500';
      this.alert_msg = 'Song data updated.';
      this.song_in_submission = !true;
      setTimeout(() => {
        this.showForm = false;
      }, 800);
    },
    async deleteSong() {
      // Create a reference to the file to delete
      const desertRef = ref(storage, `songs/${this.music.original_name}`);

      try {
        // Delete the file
        await deleteObject(desertRef);

        const docRef = doc(songsCollection, `${this.music.id}`);
        await deleteDoc(docRef);
        this.handleDeleteSong(this.index);
        // console.log(`${this.music.original_name} deleted successfully`);
        // File deleted successfully
      } catch (error) {
        // console.log(error, 'error deleting the file');
        // Uh-oh, an error occurred!
      }
    },
  },
};
</script>

<style>

</style>
