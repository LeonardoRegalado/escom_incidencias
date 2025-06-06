<template>
  <div class="container mx-auto px-4 h-full">
    <div class="flex content-center items-center justify-center h-full">
      <div class="w-full lg:w-4/12 px-4">
        <div class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200 border-0">
          <div class="rounded-t mb-0 px-6 py-6">
            <div class="text-center mb-3">
              <h6 class="text-blueGray-500 text-sm font-bold">Sign in with</h6>
            </div>
            <div class="btn-wrapper text-center">
              <button class="...">
                <img alt="..." class="w-5 mr-1" :src="github" /> Github
              </button>
              <button class="...">
                <img alt="..." class="w-5 mr-1" :src="google" /> Google
              </button>
            </div>
            <hr class="mt-6 border-b-1 border-blueGray-300" />
          </div>
          <div class="flex-auto px-4 lg:px-10 py-10 pt-0">
            <div class="text-blueGray-400 text-center mb-3 font-bold">
              <small>Or sign in with credentials</small>
            </div>
            <form @submit.prevent="login">
              <div class="relative w-full mb-3">
                <label class="block uppercase text-blueGray-600 text-xs font-bold mb-2">Email</label>
                <input
                  v-model="correo"
                  type="email"
                  class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                  placeholder="Email"
                  required
                />
              </div>

              <div class="relative w-full mb-3">
                <label class="block uppercase text-blueGray-600 text-xs font-bold mb-2">Password</label>
                <input
                  v-model="password"
                  type="password"
                  class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                  placeholder="Password"
                  required
                />
              </div>

              <div>
                <label class="inline-flex items-center cursor-pointer">
                  <input id="customCheckLogin" type="checkbox" class="form-checkbox border-0 rounded text-blueGray-700 ml-1 w-5 h-5" />
                  <span class="ml-2 text-sm font-semibold text-blueGray-600">Remember me</span>
                </label>
              </div>

              <p v-if="error" class="text-red-500 text-sm mt-3 text-center">{{ error }}</p>

              <div class="text-center mt-6">
                <button
                  type="submit"
                  class="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg w-full"
                >
                  Sign In
                </button>
              </div>
            </form>
          </div>
        </div>
        <div class="flex flex-wrap mt-6 relative">
          <div class="w-1/2">
            <a href="javascript:void(0)" class="text-blueGray-200"><small>Forgot password?</small></a>
          </div>
          <div class="w-1/2 text-right">
            <router-link to="/auth/register" class="text-blueGray-200">
              <small>Create new account</small>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import github from "@/assets/img/github.svg";
import google from "@/assets/img/google.svg";
import axios from "axios";

export default {
  data() {
    return {
      github,
      google,
      correo: "",
      password: "",
      error: ""
    };
  },
  methods: {
    async login() {
      this.error = "";
      try {
        await axios.post("http://localhost:3000/login", {
          correo: this.correo,
          contraseña: this.password
        });

        // Login correcto, redirige a /landing
        this.$router.push("/landing");
      } catch (err) {
        console.error(err);
        this.error = err.response?.data?.error || "Error del servidor";
      }
    }
  }
};
</script>
