<script setup lang="ts">
import type { Clave, Cliente } from '@/Clases';
import { useDatabaseStore } from '@/stores/db';
import { onMounted, ref, type Ref } from 'vue';
import SelectWithAutocomplete from '../Forms/SelectWithAutocomplete.vue';
import SelectWithoutAutocomplete from '../Forms/SelectWithoutAutocomplete.vue';
const clienteSeleccionado: Ref<Cliente> = ref({
    claveApi: "",
    correo: "",
    fechaRegistro: "",
    id: 0,
    nombre: "",
});
const claveSeleccionada: Ref<Clave> = ref({
    costo: 0,
    nombre: "",
    plantilla: "",
    privada: "",
    publica: "",
});
const dbStore = useDatabaseStore();
const clientes: Ref<Array<Cliente>> = ref([]);
const claves: Ref<Array<Clave>> = ref([]);
const filtrarClientes = async (busqueda: string) => {
    return await dbStore.exec(`SELECT 
    id, nombre, correo, claveApi, fechaRegistro 
    FROM clientes 
    WHERE clientes.nombre LIKE ? OR clientes.correo LIKE ?`, [
        `%${busqueda}%`,
        `%${busqueda}%`,
    ]);
}
const init = async () => {
    clientes.value = await dbStore.exec(`SELECT id, nombre, correo, claveApi, fechaRegistro FROM clientes`, []);
    claves.value = await dbStore.exec(`SELECT id, nombre, privada, publica, costoMensual, plantilla FROM claves`, []);
}
onMounted(init)
</script>
<template>
    <div class="flex flex-col">
        <SelectWithAutocomplete v-model="clienteSeleccionado" :get-items-function="filtrarClientes" label="Cliente"
            :display-item-function="(cliente: Cliente) => cliente.nombre">
            <template #item="{ item, index }">
                {{ item.nombre }} <strong>{{ item.correo }}</strong>
            </template>
        </SelectWithAutocomplete>
        <SelectWithoutAutocomplete label="Clave" v-model="claveSeleccionada" :elementos="claves"
            :to-string="(clave: Clave) => clave.nombre">
        </SelectWithoutAutocomplete>
        <strong>CLiente:</strong>
        {{ clienteSeleccionado }}
        <strong>Claves</strong>
        {{ claveSeleccionada }}
    </div>
</template>