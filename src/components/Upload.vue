<template>
          <div class="bg-white rounded border border-gray-200 relative flex flex-col">
          <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
            <span class="card-title">Upload</span>
            <i class="fas fa-upload float-right text-green-400 text-2xl"></i>
          </div>
          <div class="p-6">
            <!-- Upload Dropbox -->
            <div
              class="w-full px-10 py-20 rounded text-center cursor-pointer border border-dashed
                border-gray-400 text-gray-400 transition duration-500 hover:text-white
                hover:bg-green-400 hover:border-green-400 hover:border-solid"
                :class="{ 'bg-green-400 border-green-400 border-solid': is_dragover}"
                @drag.prevent.stop=""
                @dragstart.prevent.stop=""
                @dragend.prevent.stop="is_dragover = false"
                @dragover.prevent.stop="is_dragover = true"
                @dragenter.prevent.stop="is_dragover = true"
                @dragleave.prevent.stop="is_dragover = false"
                @drop.prevent.stop="upload"
                >
              <h5>Drag and drop your files here</h5>
            </div>
            <label for="file_input">Click to add your file/s</label>
            <input type="file" id="file_input" multiple @change="upload"/>
            <hr class="my-6" />
            <!-- Progess Bars -->
            <div class="mb-4" v-for="song in uploads" :key="song.name">

                  <!-- File Name -->
                  <div class="font-bold text-sm" :class="song.text_class">
                    <i :class="song.icon"></i>{{song.name}}</div>
                  <div class="flex h-4 overflow-hidden bg-gray-200 rounded">
                    <!-- Inner Progress Bar -->
                    <div class="transition-all progress-bar " :class="song.variant" :style="{ 'width': song.upload_progress + '%' }"></div>
                  </div>

            </div>
          </div>
        </div>
</template>

<script>
import fireFunctions from '@/includes/firebase';

const {
  storage, ref, uploadBytesResumable, getDownloadURL, auth, songsCollection, addDoc, onSnapshot,
} = fireFunctions;
export default {
  name: 'Upload',
  props: {
    addSong: {
      type: Function,
      require: true,
    },
  },
  data() {
    return {
      uploads: [],
      is_dragover: false,
    };
  },
  methods: {
    cancelUploads() {
      this.uploads.forEach((upload) => {
        upload.uploadTask.cancel();
      });
    },

    async upload(e) {
      // console.log(e, 'upload/file input  event');
      this.is_dragover = false;
      const files = e.dataTransfer ? [...e.dataTransfer.files] : [...e.target.files];
      console.log(files, 'files');
      files.forEach((file) => {
        if (file.type !== 'audio/mpeg') return;

        // console.log(file, 'file');

        // const storageRef = ref(storage, 'songs');
        // Upload file and metadata to the object 'songs/High.mp3'

        const songsRef = ref(storage, `songs/${file.name}`);
        // NOTE: using the uploadBytes function wont give up access to the individual progress of the uploads
        // uploadBytes(songsRef, file).then((snapshot) => {
        //   console.log(snapshot, 'Uploaded a blob or file!');
        // }).catch((err) => console.log(err, 'error unexpec'));

        const metadata = {
          contentType: 'audio/mpeg',
        };
        const uploadTask = uploadBytesResumable(songsRef, file, metadata);

        const uploadsLength = this.uploads.push({
          name: file.name,
          uploadTask,
          upload_progress: 0,
          icon: 'fas fa-spinner fa-spin',
          variant: 'bg-blue-400',
          text_class: 'text-black-400',
          srcUrl: '',
        });
        const uploadIndex = uploadsLength - 1;
        // Note: here using the Array.prototype.find method isn't very scalable as it's a loop function,so using an access method of O(1) is better;
        // const uploadItem = this.uploads.find((_, index) => index === uploadIndex);
        // console.log(uploadItem, 'item upload');

        // Listen for state changes, errors, and completion of the upload.
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            this.uploads[uploadIndex].upload_progress = progress;
            console.log(`Upload is ${progress}% done`);
            switch (snapshot.state) {
              case 'paused':
                this.uploads[uploadIndex].upload_running = false;
                console.log('Upload is paused');
                break;
              case 'running':
                this.uploads[uploadIndex].upload_running = true;
                console.log(`${file.name} Upload is running`);
                break;
              default:
                break;
            }
          },
          (error) => {
            this.uploads[uploadIndex].variant = 'bg-red-400';
            this.uploads[uploadIndex].icon = 'fas fa-times';
            this.uploads[uploadIndex].text_class = 'text-red-400';
            // A full list of error codes is available at
            // https://firebase.google.com/docs/storage/web/handle-errors
            switch (error.code) {
              case 'storage/unauthorized':
                // User doesn't have permission to access the object
                console.log('User can\'t upload more than 10mb file');
                break;
              case 'storage/canceled':
                // User canceled the upload
                console.log('User canceled the upload');
                break;

                // ...

              case 'storage/unknown':
                // Unknown error occurred, inspect error.serverResponse
                console.log('Unknown error occurred, inspect error.serverResponse');
                break;
              default:
                break;
            }
          },
          async () => {
            const song = {
              uid: auth.currentUser.uid,
              display_name: auth.currentUser.displayName,
              original_name: uploadTask.snapshot.ref.name,
              modified_name: uploadTask.snapshot.ref.name,
              genre: '',
              comment_count: 0,
              url: '',
            };
            // console.log(song, 'song data');

            // console.log('upload success');
            // Upload completed successfully, now we can get the download URL

            song.url = await getDownloadURL(uploadTask.snapshot.ref);

            const songRef = await addDoc(songsCollection, song);

            this.uploads[uploadIndex].variant = 'bg-green-400';
            this.uploads[uploadIndex].icon = 'fa fa-check-square';
            this.uploads[uploadIndex].text_class = 'text-green-400';
            onSnapshot(songRef, (docSnap) => {
              this.addSong(docSnap);
              // console.log(this.song, 'current song update');
            });
          },
        );
      });
    },
    beforeUnmount() {
      this.uploads.forEach((upload) => {
        upload.uploadTask.cancel();
      });
    },
  },
};
</script>
