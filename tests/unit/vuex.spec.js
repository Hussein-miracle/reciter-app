import { createStore } from 'vuex';
import auth from '@/store/modules/auth';
import player from '@/store/modules/player';

jest.mock('@/includes/firebase', () => {});
describe('Vuex Store', () => {
  test('toggleAuth mutation sets userLoggedIn to true', () => {
    const store = createStore({
      modules: {
        auth,
        player,
      },
    });

    expect(store.state.auth.userLoggedIn).not.toBe(!false);
    store.commit('toggleAuth');
    expect(store.state.auth.userLoggedIn).not.toBe(false);
  });
});
