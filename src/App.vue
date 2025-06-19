<script setup lang="ts">
import IconoMenu from "vue-material-design-icons/Menu.vue";
import MenuOpen from "vue-material-design-icons/MenuOpen.vue";
import { ref } from 'vue';
import { RouterLink, RouterView } from 'vue-router'
import Menu from "./Menu.vue";
const mostrarMenu = ref(true);
</script>

<template>
  <div class="h-full flex flex-col">
    <header>
      <nav class="bg-blue-500 text-white p-4 font-semibold flex flex-row items-center">
        <button @click="mostrarMenu = !mostrarMenu" class="mr-4 p-1 hover:bg-blue-600">
          <IconoMenu v-show="!mostrarMenu"></IconoMenu>
          <MenuOpen v-show="mostrarMenu"></MenuOpen>
        </button>
        <p>Administrador</p>
      </nav>
    </header>

    <div class="flex md:flex-row flex-col">
      <Menu :mostrarMenu></Menu>
      <div class="flex-grow">
        <RouterView />
      </div>
    </div>
  </div>

</template>
