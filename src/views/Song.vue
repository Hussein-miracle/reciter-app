/* eslint-disable vuejs-accessibility/form-control-has-label */
<template>
  <main>
    <!-- Music Header -->
  <section class="w-full mb-8 py-14 text-center text-white relative">
    <div class="absolute inset-0 w-full h-full box-border bg-contain music-bg"
      style="background-image: url(/assets/img/song-header.png)">
    </div>
    <div class="container mx-auto flex items-center">
      <!-- Play/Pause Button -->
      <button type="button" class="z-50 h-24 w-24 text-3xl bg-white text-black rounded-full
        focus:outline-none" @click.prevent="newSong(song)">
        <i class="fas fa-play"></i>
      </button>
      <div class="z-50 text-left ml-8">
        <!-- Song Info -->
        <div class="text-3xl font-bold">{{song.modified_name}}</div>
        <div>{{song.genre}}</div>
      </div>
    </div>
  </section>
  <!-- Form -->
  <section class="container mx-auto mt-6">
    <div class="bg-white rounded border border-gray-200 relative flex flex-col">
      <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
        <!-- Comment Count -->
        <span class="card-title">Comments ({{song.comment_count}})</span>
        <i class="fa fa-comments float-right text-green-400 text-2xl"></i>
      </div>
      <div class="p-6">
        <div class="text-white text-center font-bold p-5 mb-4" v-if="comment_show_alert" :class="comment_alert_variant">
          {{comment_alert_msg}}
        </div>
        <VeeForm  :validation-schema="commentSchema" @submit="addComment" v-if="userLoggedIn">
          <VeeField as="textarea" name="comment" ref="comment_ref"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
              duration-500 focus:outline-none focus:border-black rounded mb-4"
            placeholder="Your comment here..."></VeeField>
            <ErrorMessage class="text-red-600"  name="comment"/>
          <button type="submit"
          :disabled='comment_in_submission' class="py-1.5 px-3 rounded text-white bg-green-600 block">
            Submit
          </button>
        </VeeForm>
        <!-- Sort Comments -->
        <select v-model="sort"
          class="block mt-4 py-1.5 px-3 text-gray-800 border border-gray-300 transition
          duration-500 focus:outline-none focus:border-black rounded">
          <option value="1">Latest</option>
          <option value="2">Oldest</option>
        </select>
      </div>
    </div>
  </section>
  <!-- Comments -->
  <ul class="container mx-auto" id="#comments">
    <comment v-for="item in sortedComments" :key="item.datePosted" :comment="item"/>
  </ul>
  </main>
</template>

<script>
import fireFunctions from '@/includes/firebase';
import { mapState, mapActions } from 'vuex';
import Comment from '@/components/Comment.vue';
// import { where } from '@firebase/firestore';

const {
  songsCollection, getDoc, doc, auth,
  // firestoreDb,
  updateDoc,
  commentsCollection, addDoc, query, getDocs, where,
  // onSnapshot,
} = fireFunctions;
export default {
  name: 'Song',
  components: {
    Comment,
  },
  data() {
    return {
      song: {},
      commentSchema: {
        comment: 'required|min:3',
      },
      comment_in_submission: false,
      comment_alert_msg: 'Please wait your comment is being submitted 👌',
      comment_alert_variant: 'bg-blue-500',
      comment_show_alert: false,
      comments: [],
      sort: '1',
    };
  },
  // eslint-disable-next-line no-empty-function
  async created() {
    const songDoc = await getDoc(doc(songsCollection, this.$route.params.id));
    if (!songDoc.exists()) {
      this.$router.push({ name: 'home' });
      return;
    }

    await this.getComments();

    const { sort } = this.$route.query;
    this.sort = sort === '1' || sort === '2' ? sort : 1;

    this.song = { ...songDoc.data(), id: songDoc.id };
    // console.log(this.song, 'song in route');
  },
  methods: {
    ...mapActions(['newSong']),
    async addComment(value, context) {
      const { resetForm } = context;
      this.comment_in_submission = true;
      this.comment_show_alert = true;
      this.comment_alert_variant = 'bg-blue-500';
      this.comment_alert_msg = 'Please wait your comment is being submitted';
      console.log(context, 'context in comment form');

      const comment = {
        content: value.comment,
        songId: this.$route.params.id,
        datePosted: new Date().toString(),
        name: auth.currentUser.displayName,
        uid: auth.currentUser.uid,
      };

      // consovuele.log(comment, 'comment data');

      try {
        await addDoc(commentsCollection, comment);
        this.song.comment_count += 1;
        await updateDoc(doc(songsCollection, `${this.$route.params.id}`), {
          comment_count: this.song.comment_count,
        });
        await this.getComments();
      } catch (err) {
        this.comment_in_submission = !true;
        this.comment_show_alert = true;
        this.comment_alert_variant = 'bg-red-500';
        this.comment_alert_msg = 'Unable to send comment';
        console.error(err, 'No!,unable can\'t  comment');
        return;
      }

      this.comment_in_submission = !true;
      this.comment_show_alert = true;
      this.comment_alert_variant = 'bg-green-500';
      this.comment_alert_msg = 'Your comment has been submitted successfully ✨';

      resetForm();

      // console.log(this.$refs.comment_ref, 'comment Rfe');
    },
    async getComments() {
      // console.log(this.comments, 'comments');
      this.comments = [];

      const commentSnapshots = await getDocs(query(commentsCollection, where('songId', '==', this.$route.params.id)));

      commentSnapshots.forEach((document) => {
        const comment = { ...document.data(), id: document.id };
        this.comments.push(comment);
      });

      // console.log(this.comments);
    },

  },
  computed: {
    ...mapState(['userLoggedIn']),
    sortedComments() {
      return this.comments.slice().sort((a, b) => {
        if (this.sort === '1') {
          const value = new Date(b.datePosted) - new Date(a.datePosted);
          return value;
        }

        const value = new Date(a.datePosted) - new Date(b.datePosted);

        return value;
      });
    },
  },
  watch: {
    sort(newVal) {
      if (newVal === this.$route.query.sort) {
        return;
      }
      this.$router.push({
        query: {
          sort: newVal,
        },
      });
    },
  },
};
</script>
