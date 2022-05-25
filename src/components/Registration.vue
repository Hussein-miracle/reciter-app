<template>
 <!-- Registration Form -->
        <div class="text-white text-center font-bold p-5 mb-4" v-if="reg_show_alert" :class="reg_alert_variant">
          {{reg_alert_msg}}
        </div>
          <VeeForm v-show="tab === 'register'"  :validation-schema='schema' @submit="register" :initial-values="userData" >
            <!-- Name -->
            <div class="mb-3">
              <label class="inline-block mb-2"  for="name">Name</label>
              <VeeField  type="text" id="name"  name='name'
                class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
                  duration-500 focus:outline-none focus:border-black rounded"
                placeholder="Enter Name" />
                <ErrorMessage class="text-red-600" name='name'/>
            </div>
            <!-- Email -->
            <div class="mb-3">
              <label class="inline-block mb-2" for="reg-email">Email</label>
              <vee-field type="email" id="reg-email" name="email"
                class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
                  duration-500 focus:outline-none focus:border-black rounded"
                placeholder="Enter Email" />
                <ErrorMessage class="text-red-600" name='email'/>
            </div>
            <!-- Age -->
            <div class="mb-3">
              <label class="inline-block mb-2"  for="age">Age</label>
              <VeeField type="number" id="age" name="age"
                class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
                  duration-500 focus:outline-none focus:border-black rounded" />
                  <ErrorMessage class="text-red-600" name='age'/>
            </div>
            <!-- Password -->
            <div class="mb-3">
              <label class="inline-block mb-2" for="reg-password">Password</label>
              <VeeField  name='password'
                :bails="false" v-slot="{field , errors}" >
                  <input class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
                  duration-500 focus:outline-none focus:border-black rounded"
                placeholder="Password" type="password" id="reg-password" v-bind="field"/>
                <div class="text-red-600" v-for="err in errors" :key='err'>{{err}}</div>
                </VeeField>
                <ErrorMessage class="text-red-600" name='password'/>
            </div>
            <!-- Confirm Password -->
            <div class="mb-3">
              <label class="inline-block mb-2" for="reg-password-confirm">Confirm Password</label>
              <vee-field type="password" id="reg-password-confirm" name="confirm_password"
                class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
                  duration-500 focus:outline-none focus:border-black rounded"
                placeholder="Confirm Password"  />
                <ErrorMessage class="text-red-600" name="confirm_password" />
            </div>
            <!-- Country -->
            <div class="mb-3">
              <label class="inline-block mb-2"  for="country">Country</label>
              <vee-field as="select" name="country"
              id="country"
                class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
                  duration-500 focus:outline-none focus:border-black rounded">
                <option value="Nigeria" select>Nigeria</option>
                <option value="USA">USA</option>
                <option value="Mexico">Mexico</option>
                <option value="Germany">Germany</option>
              </vee-field>
              <ErrorMessage class="text-red-600" name="country" />
            </div>
            <!-- TOS -->
            <div class="mb-3 pl-6">
              <VeeField type="checkbox" class="w-4 h-4 float-left -ml-6 mt-1 rounded"  id="service" name="tos" value="1"/>
              <label class="inline-block" for="service"  >Accept terms of service</label>
              <ErrorMessage class="text-red-600" name="tos" />
            </div>
            <button type="submit" :disabled="reg_in_submission"
              class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition
                hover:bg-purple-700">
              Submit
            </button>

          </VeeForm>

</template>

<script>
// import * as yup from 'yup';
// import { useStore } from 'vuex';
// import { useStore,mapMutations } from 'vuex';

// const {
//   auth, createUserWithEmailAndPassword, usersCollection, addDoc, serverTimestamp,
// } = firebase;
// const store = useStore();
// console.log(store, 'store');
export default {
  name: 'Registration',
  props: ['tab', 'modalToggle'],
  data() {
    return {
      schema: {
        name: 'required|min:3|max:100|alpha_spaces',
        email: 'required|min:3|max:100|email',
        age: 'required|min_value:18|max_value:100',
        password: 'required|min:3|max:100',
        confirm_password: 'passwords_mismatch:@password',
        country: 'required|country_excluded:Germany',
        tos: 'tos',
      },
      // schema: yup.object().shape({
      //   name: yup.string().required().min(3).max(100),
      //   email: yup.string().email().required(),
      //   age: yup.number().required().positive().integer(),
      //   password: yup.string().required().min(8)
      //     .max(20),
      //   confirm_password: yup.string().oneOf([yup.ref('password'), 'Confirm password is different!']).required().min(8)
      //     .max(20),
      //   country: yup.string().required(),
      //   tos: yup.string().required(),
      // }),
      userData: {
        country: 'Nigeria',
      },
      reg_in_submission: false,
      reg_show_alert: false,
      reg_alert_variant: 'bg-blue-500',
      reg_alert_msg: 'please wait your account is being submitted',
    };
  },
  methods: {
    async register(values) {
      // debugger;
      this.reg_show_alert = true;
      this.reg_in_submission = true;
      this.reg_alert_variant = 'bg-blue-500';
      this.reg_alert_msg = 'Please wait your account is being created...';
      try {
        // console.log(userCredentials, 'user creds');
        await this.$store.dispatch('register', values);
        // console.log(userCredentials.user.currentUser, 'current user');
        // if (userCredentials.user) {
        //   this.$store.commit('setCurrentUser', userCredentials);

        // }
      } catch (err) {
        this.reg_alert_variant = 'bg-red-500';
        this.reg_in_submission = !true;
        this.reg_alert_msg = 'There was an unexpected error creating your account,Please try again later.';
        // console.log(err, 'error creating your account');
        return;
      }

      this.reg_alert_variant = 'bg-green-500';
      this.reg_alert_msg = 'Success! Your account has been created👍.';
      window.location.reload();
    },

  },
};
</script>
