<script setup lang="ts">
import { useDatabaseStore } from '@/stores/db';
import CustomTextarea from '../Forms/CustomTextarea.vue';
import CustomButton from '../Forms/CustomButton.vue';
import { ref, type Ref } from 'vue';
import CustomInput from '../Forms/CustomInput.vue';
const dbStore = useDatabaseStore();
const detalles: Ref<{ privada: string, publica: string, nombre: string }> = ref({
    privada: "",
    publica: "",
    nombre: "",
});
const guardarClave = async () => {
    const r = await dbStore.exec("INSERT INTO claves (nombre, privada, publica) VALUES (?, ?, ?) RETURNING *",
        [
            detalles.value.nombre,
            detalles.value.privada,
            detalles.value.publica,
        ]);
    console.log({ r })
}
</script>
<template>
    <div class="flex flex-col">
        <CustomInput label="Nombre" v-model="detalles.nombre"></CustomInput>
        <CustomTextarea v-model="detalles.privada" label="Clave privada"></CustomTextarea>
        <CustomTextarea v-model="detalles.publica" label="Clave pública"></CustomTextarea>
        <CustomButton @click="guardarClave">Guardar</CustomButton>
    </div>
</template>