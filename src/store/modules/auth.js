import firebaseData from '@/includes/firebase';

const {
  auth, createUserWithEmailAndPassword, usersCollection, addDoc, serverTimestamp, updateProfile, signInWithEmailAndPassword, signOut,
} = firebaseData;
export default {
  // namespaced: true,
  state: {
    authModalShow: false,
    userLoggedIn: false,
  },
  mutations: {
    toggleAuthModal: (state) => {
      state.authModalShow = !state.authModalShow;
      // console.log(state.authModalShow, 'store');
    },
    toggleAuth: (state) => {
      state.userLoggedIn = !state.userLoggedIn;
    },
  },
  actions: {
    register: async (context, payload) => {
      const { commit } = context;
      // console.log(context, 'context data');
      // console.log(payload, 'patload data');
      const {
        email, password, name, age, country,
      } = payload;
      const userCredentials = await createUserWithEmailAndPassword(auth, email, password);

      const userData = {
        email,
        name,
        age,
        country,
        time: serverTimestamp(),
      };

      // userCredentials.user.
      await updateProfile(userCredentials.user, {
        displayName: name,
      });

      // console.log(userData, 'userData');
      // Add a new document with a generated id.
      await addDoc(usersCollection, userData);
      commit('toggleAuth');
      // console .log('Document written with ID: ', docRef);
      commit('toggleAuthModal');
    },
    init_login({ commit }) {
      const user = auth.currentUser;
      // console.log(user, 'user');
      // console.log(auth, 'auth');

      if (user) {
        commit('toggleAuth');
      }
    },
    async login(context, payload) {
      const { commit } = context;
      const { email, password } = payload;
      try {
        await signInWithEmailAndPassword(auth, email, password);
      } catch (err) {
        // console.log(err);
      }

      commit('toggleAuth');
      commit('toggleAuthModal');
    },
    signout: async ({ commit }) => {
      // const { route, router } = payload;
      try {
        await signOut(auth);
        commit('toggleAuth');
        // if (route.meta.requiresAuth) {
        //   router.push({ name: 'home' });
        // }
      } catch (err) {
        // console.log(err);
      }
    },
  },
};
