<template>
            <!-- Login Form -->
          <vee-form v-show="tab === 'login'" @submit="login" :validation-schema="loginSchema">
            <div v-if="login_show_alert"  class="text-white text-center font-bold p-5 mb-4" :class="login_alert_variant">{{login_alert_msg}}</div>
            <!-- Email -->
            <div class="mb-3">
              <label class="inline-block mb-2" for="email">Email</label>
              <VeeField type="email" id="email" name="email"
                class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
                  duration-500 focus:outline-none focus:border-black rounded"
                placeholder="Enter Email" />
                <ErrorMessage class="text-red-600" name='email'/>
            </div>
            <!-- Password -->
            <div class="mb-3">
              <label class="inline-block mb-2" for="password">Password</label>
              <vee-field type="password" id="password" name="password"
                class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
                  duration-500 focus:outline-none focus:border-black rounded"
                placeholder="Password" />
                <ErrorMessage class="text-red-600" name='password'/>
            </div>
            <button type="submit" :disabled="login_in_submission"
              class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition
                hover:bg-purple-700">
              Submit
            </button>
          </vee-form>
</template>

<script>
// import * as yup from 'yup';

export default {
  name: 'Login',
  props: {
    tab: {
      type: String,

    },
  },
  data() {
    return {
      // schema: yup.object().shape({
      //   email: yup.string().email().required(),
      //   password: yup.string().required().min(8).max(20),
      // }),
      loginSchema: {
        email: 'required|email|min:3|max:100',
        password: 'required|min:3|max:32',
      },
      login_in_submission: false,
      login_show_alert: false,
      login_alert_variant: 'bg-blue-600',
      login_alert_msg: 'please wait you are being logged in',
    };
  },
  methods: {
    login(values) {
      this.login_show_alert = !false;
      this.login_in_submission = !false;
      this.login_alert_variant = 'bg-blue-600';

      this.login_alert_variant = 'bg-green-600';

      this.login_alert_msg = 'Success! You are logged in.';
      console.log(values, 'login form values');
    },
  },
};
</script>

<style>

</style>
