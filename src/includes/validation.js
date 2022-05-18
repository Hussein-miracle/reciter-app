import {
  Form as VeeForm, Field as VeeField, defineRule, ErrorMessage,
} from 'vee-validate';
import { required } from '@vee-validate/rules';

export default {
  install(app, options) {
    console.log(options, 'option in validation.js');
    // This is how to create global components in vue;
    app.component('VeeForm', VeeForm);
    app.component('VeeField', VeeField);
    app.component('ErrorMessage', ErrorMessage);

    defineRule('required', required);
  },
};
