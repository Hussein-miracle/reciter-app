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
            <hr class="my-6" />
            <!-- Progess Bars -->
            <div class="mb-4" v-for="song in uploads" :key="song.name">

                  <!-- File Name -->
                  <div class="font-bold text-sm" :class="upload.text_class">
                    <i :class="{ song.icon:upload_running}"></i>{{song.name}}</div>
                  <div class="flex h-4 overflow-hidden bg-gray-200 rounded">
                    <!-- Inner Progress Bar -->
                    <div class="transition-all progress-bar bg-blue-500" :class="song.variant" :style="{ 'width': song.upload_progress + '%' }"></div>
                  </div>

            </div>
          </div>
        </div>
</template>

<script>
import fireFunctions from '@/includes/firebase';

const {
  storage, ref, uploadBytesResumable, getDownloadURL,
} = fireFunctions;
export default {
  name: 'Upload',
  data() {
    return {
      uploads: [],
      is_dragover: false,
    };
  },
  methods: {
    async upload(e) {
      // console.log(e, 'upload event');
      this.is_dragover = false;
      const files = [...e.dataTransfer.files];
      console.log(files, 'files');

      files.forEach((file) => {
        if (file.type !== 'audio/mpeg') return;

        console.log(file, 'file');

        // const storageRef = ref(storage, 'songs');
        // Upload file and metadata to the object 'images/mountains.jpg'

        const songsRef = ref(storage, `songs/${file.name}`);

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
          upload_running: '',
          text_class: '',
        });
        const uploadIndex = uploadsLength - 1;

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
                this.uploads[uploadIndex].upload_running = !true;
                console.log('Upload is paused');
                break;
              case 'running':
                this.uploads[uploadIndex].upload_running = true;
                console.log('Upload is running');
                break;
              default:
                break;
            }
          },
          (error) => {
             this.uploads[uploadIndex].variant = 'bg-red-500';
             this.uploads[uploadIndex].icon = 'fas fatimes';
             this.uploads[uploadIndex].text_class = 'text-red-500';
          // A full list of error codes is available at
          // https://firebase.google.com/docs/storage/web/handle-errors
            switch (error.code) {
              // User doesn't have permission to access the object
               
              // User canceled the upload
                
              // Unknown error occurred, inspect error.serverResponse
                
          () => {
          // Upload completed successfully, now we can get the download URL
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              console.log('File available at', downloadURL);
              this.uploads[uploadIndex].srcUrl = downloadURL;
            });
          },
        );
      });
    },

  },
};
</script>
