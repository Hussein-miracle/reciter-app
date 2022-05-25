import SongItem from '@/components/SongItem.vue';
import { shallowMount, RouterLinkStub } from '@vue/test-utils';

describe('SongItem.vue', () => {
  // test('render song.display_name', () => {
  //   const song = {
  //     display_name: 'test',
  //   };
  //   const wrapper = shallowMount(SongItem, {
  //     propsData: {
  //       song,
  //     },
  //     global: {
  //       components: {
  //         'router-link': RouterLinkStub,
  //       },
  //     },
  //   });
  //   const compositionAuthor = wrapper.find('.text-gray-500');
  //   expect(compositionAuthor.text() === song.display_name).toBe(false);
  // });
  test('renders song.id', () => {
    const song = {
      id: 'abc',
    };
    const wrapper = shallowMount(SongItem, {
      propsData: {
        song,
      },
      global: {
        components: {
          'router-link': RouterLinkStub,
        },
      },
    });

    // expect(wrapper.attributes().id).toBe(`song-id-${song.id}`);

    expect(wrapper.classes()).toContain(`song-id-${song.id}`);
  });
});
