<script setup lang="ts">
import { useDatabaseStore } from '@/stores/db';
import CustomTextarea from '../Forms/CustomTextarea.vue';
import CustomButton from '../Forms/CustomButton.vue';
import { onMounted, ref, type Ref } from 'vue';
import CustomInput from '../Forms/CustomInput.vue';
import type { Clave } from '@/Clases';
import { useRoute, useRouter } from 'vue-router';
const router = useRouter();
const route = useRoute()
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
    const r = await dbStore.exec(`UPDATE claves SET
    nombre = ?,
    privada = ?,
    publica = ?,
    costoMensual = ?,
    plantilla = ?,
    plantillaFirma = ?,
    separador = ?
    WHERE id = ? RETURNING *`,
        [
            detalles.value.nombre,
            detalles.value.privada,
            detalles.value.publica,
            detalles.value.costoMensual,
            detalles.value.plantilla,
            detalles.value.plantillaFirma,
            detalles.value.separador,
            detalles.value.id,
        ]);
    console.log({ r })
    volver();
}
const init = async () => {
    const idClave = route.params.id;
    const claves = await dbStore.exec(`SELECT id, nombre, privada, publica, costoMensual, plantilla, plantillaFirma, separador FROM claves WHERE id = ?`, [idClave]);
    if (claves.length <= 0) {
        return;
    }
    detalles.value = claves[0];
}
onMounted(() => { init() });

const volver = () => {
    router.push({ name: "claves" });
}
</script>
<template>
    <div class="flex flex-col">
        <CustomButton @click="volver">Volver</CustomButton>
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
        <CustomButton @click="guardarClave">Guardar</CustomButton>
    </div>
</template>