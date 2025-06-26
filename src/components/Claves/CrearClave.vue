<script setup lang="ts">
import { useDatabaseStore } from '@/stores/db';
import CustomTextarea from '../Forms/CustomTextarea.vue';
import CustomButton from '../Forms/CustomButton.vue';
import { ref, type Ref } from 'vue';
import CustomInput from '../Forms/CustomInput.vue';
import type { Clave } from '@/Clases';
import { useToastStore } from '@/stores/toast';
const cargando = ref(false);
const toastStore = useToastStore();
const dbStore = useDatabaseStore();
const detalles: Ref<Clave> = ref({
    privada: "",
    publica: "",
    nombre: "",
    costoMensual: 0,
    plantilla: "",
    plantillaFirma: "",
    separador: "",
    id: 0,
});
const guardarClave = async () => {
    cargando.value = true;
    await dbStore.exec(`INSERT INTO claves
    (nombre, privada, publica, costoMensual, plantilla, plantillaFirma, separador)
     VALUES 
     (?, ?, ?, ?, ?, ?, ?) RETURNING *`,
        [
            detalles.value.nombre,
            detalles.value.privada,
            detalles.value.publica,
            detalles.value.costoMensual,
            detalles.value.plantilla,
            detalles.value.plantillaFirma,
            detalles.value.separador,
        ]);
    cargando.value = false;
    toastStore.mostrarToast("Clave creada", "success", 500);
}
</script>
<template>
    <div class="flex flex-col">
        <CustomInput label="Nombre" v-model="detalles.nombre"></CustomInput>
        <CustomInput type="number" label="Costo mensual" v-model.number="detalles.costoMensual"></CustomInput>
        <CustomTextarea v-model="detalles.privada" label="Clave privada"></CustomTextarea>
        <CustomTextarea v-model="detalles.publica" label="Clave pública"></CustomTextarea>
        <CustomTextarea v-model="detalles.plantillaFirma" label="Plantilla para generar solo la firma"></CustomTextarea>
        <p>Variables disponibles: <code>claveApiCliente</code>, <code>fechaInicio</code>, <code>fechaFin</code>. Usa
            {variable} dentro del texto para usarlas. Por ejemplo: <code>{fechaInicio}</code></p>
        <CustomTextarea v-model="detalles.separador" label="Separador de mensaje plano y firma"></CustomTextarea>
        <CustomTextarea v-model="detalles.plantilla" label="Plantilla para generar mensaje que se envía al cliente">
        </CustomTextarea>
        <p>Variables disponibles: <code>correoCliente</code>, <code>firma</code>, <code>fechaInicio</code>,
            <code>fechaFin</code>. Usa
            {variable} dentro del texto para usarlas. Por ejemplo: <code>{fechaInicio}</code>
        </p>
        <CustomButton :loading="cargando" @click="guardarClave">Guardar</CustomButton>
    </div>
</template>