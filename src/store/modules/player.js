import { Howl } from 'howler';
import helper from '@/includes/helper';

export default {
  state: {
    currentSong: {},
    sound: {},
    seek: '00:00',
    duration: '00:00',
    playerProgress: '0%',
  },
  mutations: {
    // must be synchronous always
    newSong(state, payload) {
      state.currentSong = payload;
      state.sound = new Howl({
        src: [payload.url],
        html5: true,
      });
    },
    updatePosition(state) {
      state.seek = helper.formatTime(state.sound.seek());
      state.duration = helper.formatTime(state.sound.duration());
      state.playerProgress = `${(state.sound.seek() / state.sound.duration()) * 100}%`;
    },
  },
  getters: {
    // modalShow: (state) => state.authModalShow,
    playing: (state) => {
      if (state.sound.playing) {
        return state.sound.playing();
      }

      return false;
    },
  },
  actions: {
    // can be async or synchronous
    async newSong(context, payload) {
      const { commit, state, dispatch } = context;
      // console.log(commit, 'commit');
      // console.log(context, 'new song context in store');
      // console.log(payload, 'new song payload in store');
      if (state.sound instanceof Howl) {
        state.sound.unload();
      }

      commit('newSong', payload);
      state.sound.play();
      // console.log(state.sound, 'state.sound');

      state.sound.on('play', () => {
        requestAnimationFrame(() => {
          dispatch('progress');
        });
      });
    },
    async toggleAudio({ state }) {
      // eslint-disable-next-line no-useless-return
      if (!state.sound.playing) {
        return;
      }

      if (state.sound.playing()) {
        state.sound.pause();
      } else {
        state.sound.play();
      }
    },
    progress({ commit, state, dispatch }) {
      commit('updatePosition');
      if (state.sound.playing()) {
        requestAnimationFrame(() => {
          dispatch('progress');
        });
      }
    },
    updateSeek({ state }, payload) {
      if (!state.sound.playing) return;

      const { x, width } = payload.currentTarget.getBoundingClientRect();
      const clickX = payload.clientX - x;
      // const width = 560;

      const percentage = (clickX / width);
      // console.log(clickX, 'clickX');
      // console.log(x, 'x');
      this.playerProgress = `${percentage * 100}%`;

      const seconds = state.sound.duration() * percentage;
      state.sound.seek(seconds);
      state.sound.once('seek', () => {
        this.dispatch('progress');
      });
    },
  },
};
