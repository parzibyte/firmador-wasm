<script setup lang="ts">
import { onMounted, type Ref, ref } from "vue"
import { type Cliente } from "@/Clases"
import { useRouter } from "vue-router";
const clientes: Ref<Array<Cliente>> = ref([]);
import CustomButton from '@/components/Forms/CustomButton.vue'
import { useDatabaseStore } from "@/stores/db";
import DetalleCliente from "./DetalleCliente.vue";
const dbStore = useDatabaseStore();
const router = useRouter();
const navegarAClientes = () => {
    router.push({ name: "crearCliente" });
}
const init = async () => {
    clientes.value = await dbStore.exec(`SELECT id, nombre, correo, claveApi, fechaRegistro FROM clientes`, []);
}

onMounted(() => {
    init()
})
</script>
<template>
    <div class="flex flex-col">
        <CustomButton @click="navegarAClientes()">Nuevo</CustomButton>
        <DetalleCliente v-for="cliente in clientes" :cliente></DetalleCliente>
    </div>
</template>