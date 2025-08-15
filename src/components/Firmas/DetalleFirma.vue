<script setup lang="ts">
import type { Firma } from '@/Clases';
import ContentCopy from "vue-material-design-icons/ContentCopy.vue";
import CustomButton from '../Forms/CustomButton.vue';
import { useFilterStore } from '@/stores/filter';
import { diferenciaEnDiasDeDosFechas, fechaISO8601ADate, obtenerFechaActualAjustada } from '@/fechas';
import { computed } from 'vue';
import { generarMensaje } from '@/utiles';
import { useToastStore } from '@/stores/toast';
const filterStore = useFilterStore();
const toastStore = useToastStore();
interface Props {
    firma: Firma,
}
const emit = defineEmits(["eliminar"]);
const props = withDefaults(defineProps<Props>(), {
    firma: () => ({
        firma: "",
        claveJson: "",
        clave: {
            costoMensual: 0,
            id: 0,
            nombre: "",
            plantilla: "",
            plantillaFirma: "",
            privada: "",
            publica: "",
            separador: "",
            tipo: "Local",
        },
        cliente: {
            claveApi: "",
            correo: "",
            fechaRegistro: "",
            id: 0,
            nombre: "",
        },
        clienteJson: "",
        fecha_fin: "",
        fecha_generacion: "",
        fecha_inicio: "",
        id: 0,
        id_clave: 0,
        id_cliente: 0,
        monto: 0,
    })
});
const copiar = async (texto: string) => {
    await navigator.clipboard.writeText(texto);
    toastStore.mostrarToast("Copiado", "success", 500);
}

const copiarMensaje = async () => {
    const mensaje = generarMensaje(props.firma.clave.plantilla, props.firma.firma, props.firma.cliente, props.firma.fecha_inicio, props.firma.fecha_fin)
    await copiar(mensaje);
}

const copiarSoloFirma = async () => {
    await copiar(props.firma.firma);
}

const diasParaExpirar = computed(() => {
    const dias = diferenciaEnDiasDeDosFechas(
        fechaISO8601ADate(props.firma.fecha_fin), obtenerFechaActualAjustada())
    return Math.ceil(dias);
});

const meses = computed(() => {
    return diferenciaEnDiasDeDosFechas(fechaISO8601ADate(props.firma.fecha_fin), fechaISO8601ADate(props.firma.fecha_inicio)) / 30;
});
const eliminar = () => {
    if (!confirm(`¿Eliminar firma? esto no se puede deshacer`)) {
        return;
    }
    emit("eliminar", props.firma);
}
</script>
<template>
    <div class="flex flex-col shadow-sm p-1 rounded-md">
        <div class="flex flex-row justify-between">

            <p>
                <strong>{{ props.firma.cliente.nombre }} ({{ props.firma.cliente.correo }})</strong> para <strong>{{
                    props.firma.clave.nombre }}</strong>
            </p>
            <p class="text-xl text-green-500">{{ filterStore.dinero(props.firma.monto) }}</p>
        </div>
        <p>Generada <strong>{{ filterStore.fechaSinHoraDesdeCadenaISO8601(props.firma.fecha_generacion) }}</strong>.
            Desde {{ filterStore.fechaSinHoraDesdeCadenaISO8601(props.firma.fecha_inicio) }} hasta {{
                filterStore.fechaSinHoraDesdeCadenaISO8601(props.firma.fecha_fin) }} ({{ meses }} meses)</p>
        <strong>Expira en {{ diasParaExpirar }} días</strong>
        <div class="flex flex-row">
            <CustomButton tipo="success" @click="copiarMensaje()">
                <ContentCopy></ContentCopy>
                Mensaje
            </CustomButton>
            <CustomButton tipo="info" @click="copiarSoloFirma()">
                <ContentCopy></ContentCopy>
                Firma
            </CustomButton>
            <CustomButton @click="eliminar()" tipo="danger">Eliminar</CustomButton>
        </div>
    </div>
</template>