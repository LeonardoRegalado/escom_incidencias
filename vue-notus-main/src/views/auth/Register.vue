<template>
  <div class="container mx-auto px-4 h-full">
    <div class="flex content-center items-center justify-center h-full">
      <div class="w-full lg:w-6/12 px-4">
        <div class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200 border-0">
          <div class="rounded-t mb-0 px-6 py-6">
            <div class="text-center mb-3">
              <h6 class="text-blueGray-500 text-sm font-bold">Sign up with</h6>
            </div>
            <div class="btn-wrapper text-center">
              <button class="bg-white text-blueGray-700 px-4 py-2 rounded mr-2 mb-1 shadow" type="button">
                <img alt="Github" class="w-5 mr-1" :src="github" />
                Github
              </button>
              <button class="bg-white text-blueGray-700 px-4 py-2 rounded mr-1 mb-1 shadow" type="button">
                <img alt="Google" class="w-5 mr-1" :src="google" />
                Google
              </button>
            </div>
            <hr class="mt-6 border-b-1 border-blueGray-300" />
          </div>
          <div class="flex-auto px-4 lg:px-10 py-10 pt-0">
            <div class="text-blueGray-400 text-center mb-3 font-bold">
              <small>Or sign up with credentials</small>
            </div>
            <form @submit.prevent="registrarUsuario">
              <div class="relative w-full mb-3">
                <label class="block text-blueGray-600 text-xs font-bold mb-2">Name</label>
                <input v-model="nombre" type="text" class="input" placeholder="Name" />
              </div>

              <div class="relative w-full mb-3">
                <label class="block text-blueGray-600 text-xs font-bold mb-2">Email</label>
                <input v-model="correo" type="email" class="input" placeholder="Email" />
              </div>

              <div class="relative w-full mb-3">
                <label class="block text-blueGray-600 text-xs font-bold mb-2">Password</label>
                <input v-model="password" type="password" class="input" placeholder="Password" />
              </div>

              <div class="text-sm text-red-600 mb-2" v-if="error">{{ error }}</div>
              <div class="text-sm text-green-600 mb-2" v-if="mensaje">{{ mensaje }}</div>

              <div class="text-center mt-6">
                <button class="bg-blueGray-800 text-white px-6 py-3 rounded shadow w-full" type="submit">
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import github from "@/assets/img/github.svg";
import google from "@/assets/img/google.svg";

export default {
  data() {
    return {
      nombre: '',
      correo: '',
      password: '',
      rol: 'usuario', // Fijo por ahora
      mensaje: '',
      error: '',
      github,
      google,
    };
  },
  methods: {
    async registrarUsuario() {
      this.mensaje = '';
      this.error = '';
      try {
        const res = await axios.post('http://localhost:3000/usuarios', {
          nombre: this.nombre,
          correo: this.correo,
          contraseña: this.password,
          rol: this.rol,
        });
        this.mensaje = res.data.mensaje;
        this.nombre = '';
        this.correo = '';
        this.password = '';
      } catch (err) {
        if (err.response?.data?.error) {
          this.error = err.response.data.error;
        } else {
          this.error = 'Error al registrar usuario';
        }
      }
    }
  }
};
</script>

<style>
.input {
  border: none;
  padding: 0.75rem;
  background: white;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  width: 100%;
}
</style>
