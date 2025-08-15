<script setup lang="ts">
import { useDatabaseStore } from '@/stores/db';
import CustomTextarea from '../Forms/CustomTextarea.vue';
import CustomButton from '../Forms/CustomButton.vue';
import { ref, type Ref } from 'vue';
import CustomInput from '../Forms/CustomInput.vue';
import type { Clave, TipoDeLicencia } from '@/Clases';
import { useToastStore } from '@/stores/toast';
import SelectWithoutAutocomplete from '../Forms/SelectWithoutAutocomplete.vue';
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
    tipo: "Local",
});
const tipos: Array<TipoDeLicencia> = ["Local", "API"];
const guardarClave = async () => {
    cargando.value = true;
    await dbStore.exec(`INSERT INTO claves
    (nombre, privada, publica, costoMensual, plantilla, plantillaFirma, separador, tipo)
     VALUES 
     (?, ?, ?, ?, ?, ?, ?, ?) RETURNING *`,
        [
            detalles.value.nombre,
            detalles.value.privada,
            detalles.value.publica,
            detalles.value.costoMensual,
            detalles.value.plantilla,
            detalles.value.plantillaFirma,
            detalles.value.separador,
            detalles.value.tipo,
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
        <SelectWithoutAutocomplete label="Tipo" v-model="detalles.tipo" :elementos="tipos"
            :to-string="(tipo: TipoDeLicencia) => tipo">
        </SelectWithoutAutocomplete>
        <p>Si es <strong>Local</strong> se va a generar normalmente usando el firmador WASM de Go. Si es
            <strong>API</strong>
            se tomará <i> plantilla para generar solo la firma </i>como la URL absoluta de la API a la que se le hará la
            petición HTTP para
            obtener la firma y <i>Separador de mensaje plano y firma</i> como contraseña
        </p>
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