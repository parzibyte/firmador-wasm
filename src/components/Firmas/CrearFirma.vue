<script setup lang="ts">
import type { Clave, Cliente } from '@/Clases';
import { useDatabaseStore } from '@/stores/db';
import { computed, onMounted, ref, type Ref } from 'vue';
import SelectWithAutocomplete from '../Forms/SelectWithAutocomplete.vue';
import SelectWithoutAutocomplete from '../Forms/SelectWithoutAutocomplete.vue';
import { diferenciaEnDiasDeDosFechas, fechaISO8601ADate, obtenerFechaActualAjustada, obtenerFechaActualComoISO8601, obtenerFechaFuturoComoISO8601 } from '@/fechas';
import CustomInput from '../Forms/CustomInput.vue';
import CustomButton from '../Forms/CustomButton.vue';
import { generarMensaje } from '@/utiles';
const meses = ref(0);
const fechaInicio: Ref<string> = ref(obtenerFechaActualComoISO8601())
const fechaFin: Ref<string> = ref(obtenerFechaActualComoISO8601())
const clienteSeleccionado: Ref<Cliente> = ref({
    claveApi: "",
    correo: "",
    fechaRegistro: "",
    id: 0,
    nombre: "",
});
const claveSeleccionada: Ref<Clave> = ref({
    costoMensual: 0,
    nombre: "",
    plantillaFirma: "",
    separador: "",
    plantilla: "",
    privada: "",
    publica: "",
    id: 0,
});
const dbStore = useDatabaseStore();
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
    claves.value = await dbStore.exec(`SELECT id, nombre, privada,
    publica, costoMensual, plantilla, plantillaFirma, separador
     FROM claves`, []);
    aumentarMeses();
}

const mensajeGenerado = () => {
    if (!clienteSeleccionado.value) {
        return "";
    }
    if (!claveSeleccionada.value.plantillaFirma) {
        return "";
    }
    if (!clienteSeleccionado.value.id) {
        return "";
    }
    return claveSeleccionada.value.plantillaFirma
        .replace("{claveApiCliente}", clienteSeleccionado.value.claveApi)
        .replace("{fechaInicio}", fechaInicio.value)
        .replace("{fechaFin}", fechaFin.value);

}
onMounted(init)
const aumentarMeses = () => {
    meses.value++;
    refrescarFechaFin()
}
const disminuirMeses = () => {
    meses.value--;
    refrescarFechaFin()
}

const refrescarFechaFin = () => {
    fechaFin.value = obtenerFechaFuturoComoISO8601(meses.value * 30, fechaISO8601ADate(fechaInicio.value));
}
const firmar = async () => {
    const { datos, error } = await dbStore.firmar(claveSeleccionada.value.privada, mensajeGenerado(), claveSeleccionada.value.separador);
    if (error) {
        alert("Error firmando: " + error);
        return;
    }

    console.log({ datos });
    // La firma está en datos
    const firmasInsertadas = await dbStore.exec(`INSERT INTO firmas
    (id_cliente, id_clave, firma, fecha_inicio, fecha_fin, monto, fecha_generacion)
    VALUES
    (?, ?, ?, ?, ?, ?, ?)
    RETURNING *
    `, [
        clienteSeleccionado.value.id,
        claveSeleccionada.value.id,
        datos,
        fechaInicio.value,
        fechaFin.value,
        claveSeleccionada.value.costoMensual,
        obtenerFechaActualComoISO8601(),
    ]);
    const firmaInsertada = firmasInsertadas[0];
    console.log({ firmaInsertada });
    const mensaje = generarMensaje(claveSeleccionada.value.plantilla, firmaInsertada.firma, clienteSeleccionado.value, fechaInicio.value, fechaFin.value)
    await navigator.clipboard.writeText(mensaje)
    console.log(mensaje)
}
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
        <strong>{{ mensajeGenerado() }}{{ claveSeleccionada.separador }}AQUÍ LA FIRMA</strong>
        <CustomInput @change="refrescarFechaFin()" type="date" label="Fecha inicio" v-model="fechaInicio"></CustomInput>
        {{ diferenciaEnDiasDeDosFechas(fechaISO8601ADate(fechaFin), fechaISO8601ADate(fechaInicio)) }} días desde {{
            fechaInicio }}
        <div class="flex flex-row items-center w-full">
            <CustomButton v-if="meses > 1" @click="disminuirMeses">-</CustomButton>
            <CustomInput class="w-full" v-model="fechaFin" type="date" label="Fecha fin"></CustomInput>
            <CustomButton @click="aumentarMeses">+</CustomButton>
        </div>
        <CustomButton @click="firmar()">Firmar</CustomButton>
    </div>
</template>