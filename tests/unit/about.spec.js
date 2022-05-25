import { mount } from '@vue/test-utils';
import About from '@/views/About.vue';

describe('About.vue', () => {
  test('should render inner text', () => {
    const wrapper = mount(About);
    expect(wrapper.text()).toContain('about');
  });
});
