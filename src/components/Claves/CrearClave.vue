<script setup lang="ts">
import { useDatabaseStore } from '@/stores/db';
import CustomTextarea from '../Forms/CustomTextarea.vue';
import CustomButton from '../Forms/CustomButton.vue';
import { ref, type Ref } from 'vue';
import CustomInput from '../Forms/CustomInput.vue';
import type { Clave } from '@/Clases';
const dbStore = useDatabaseStore();
const detalles: Ref<Clave> = ref({
    privada: "",
    publica: "",
    nombre: "",
    costo: 0,
    plantilla: "",
});
const guardarClave = async () => {
    const r = await dbStore.exec("INSERT INTO claves (nombre, privada, publica, costoMensual, plantilla) VALUES (?, ?, ?, ?, ?) RETURNING *",
        [
            detalles.value.nombre,
            detalles.value.privada,
            detalles.value.publica,
            detalles.value.costo,
            detalles.value.plantilla,
        ]);
    console.log({ r })
}
</script>
<template>
    <div class="flex flex-col">
        <CustomInput label="Nombre" v-model="detalles.nombre"></CustomInput>
        <CustomInput type="number" label="Costo mensual" v-model.number="detalles.costo"></CustomInput>
        <CustomTextarea v-model="detalles.privada" label="Clave privada"></CustomTextarea>
        <CustomTextarea v-model="detalles.publica" label="Clave pública"></CustomTextarea>
        <CustomTextarea v-model="detalles.plantilla" label="Plantilla"></CustomTextarea>
        <CustomButton @click="guardarClave">Guardar</CustomButton>
    </div>
</template>