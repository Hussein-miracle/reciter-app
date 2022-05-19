import {
  Form as VeeForm, Field as VeeField, defineRule, ErrorMessage, configure,
} from 'vee-validate';

import {
  required, min, max, alpha_spaces as alphaSpaces, confirmed, not_one_of as excluded, min_value as minVal, max_value as maxVal, email,
} from '@vee-validate/rules';

export default {
  install(app, options) {
    console.log(options, 'option in validation.js');
    // This is how to create global components in vue;
    app.component('VeeForm', VeeForm);
    app.component('VeeField', VeeField);
    app.component('ErrorMessage', ErrorMessage);

    defineRule('required', required);
    defineRule('email', email);
    defineRule('tos', required);
    defineRule('min', min);
    defineRule('max', max);
    defineRule('alpha_spaces', alphaSpaces);
    defineRule('min_value', minVal);
    defineRule('max_value', maxVal);
    defineRule('passwords_mismatch', confirmed);
    defineRule('excluded', excluded);
    defineRule('country_excluded', excluded);

    configure({
      generateMessage: (context) => {
        // console.log(context, 'context error object');

        const messages = {
          required: `The field ${context.field} is required.`,
          min: `The field ${context.field} is  too small`,
          max: `The field ${context.field} is  too long`,
          alpha_spaces: `The field ${context.field} may only contain alphabets,characters and spaces`,
          email: `The field ${context.field} must be a valid email`,
          min_value: `The field ${context.field} is  too low`,
          max_value: `The field ${context.field} is  too high`,
          excluded: `You are not allowed to use this value for the field ${context.field}.`,
          country_excluded: 'Due to restrictions, we do not accept users from this location.',
          passwords_mismatch: "The passwords don't match.",
          tos: 'You must accept the Terms of Service.',
        };

        const message = messages[context.rule.name] ? messages[context.rule.name] : `The field ${context.field} is invalid`;

        return message;
      },
      validateOnBlur: !false,
      validateOnChange: !false,
      validateOnInput: false,
      validateOnModelUpdate: !false,

    });
  },
};
