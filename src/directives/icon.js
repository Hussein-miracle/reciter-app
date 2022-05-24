/* eslint-disable no-param-reassign */
export default {
  beforeMount(el, binding) {
    let iconClass = `fa fa-${binding.value}  text-green-400 text-2xl`;

    if (binding.arg === 'full') {
      iconClass = binding.value;
    }

    if (binding.modifiers.right) {
      iconClass += 'float-right';
    }
    if (binding.modifiers.yellow) {
      iconClass += 'text-yellow-500';
    } else {
      iconClass += ' text-green-400';
    }
    if (binding.modifiers.left) {
      iconClass += 'float-left';
    }
    el.innerHTML += `<i class="${iconClass}"></i>`;
  },
};
