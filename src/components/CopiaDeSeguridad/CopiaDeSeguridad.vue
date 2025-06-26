<script setup lang="ts">
import { computed, onMounted, ref, type Ref } from 'vue';
import CustomButton from '../Forms/CustomButton.vue';
import type { Ajustes } from '@/Clases';
import { useDatabaseStore } from '@/stores/db';
import FileSelect from '../Forms/FileSelect.vue';
import { useToastStore } from '@/stores/toast';
const archivoParaImportar: Ref<Array<File>> = ref([]);
const dbStore = useDatabaseStore();
const toastStore = useToastStore();
const cargando = ref(false);
const ajustes: Ref<Ajustes> = ref({
    id: 0,
    id_chat_telegram: "",
    token_telegram: "",
});

const obtenerApuntadorABaseDeDatos = async (): Promise<FileSystemFileHandle> => {
    const raiz = await navigator.storage.getDirectory();
    return await raiz.getFileHandle("firmador.sqlite3");
}
const obtenerBaseDeDatosComoArchivo = async (): Promise<File> => {
    const apuntador = await obtenerApuntadorABaseDeDatos();
    const archivo = await apuntador.getFile();
    return archivo;

}

const descargarComoArchivo = async () => {
    cargando.value = true;
    const blob = new Blob([await obtenerBaseDeDatosComoArchivo()], { type: "application/sqlite-3" });
    const enlace = document.createElement('a');
    const url = URL.createObjectURL(blob);
    enlace.href = url;
    enlace.download = "firmador.sqlite3";
    enlace.click();
    URL.revokeObjectURL(url);
    cargando.value = false;
}

const enviarATelegram = async () => {
    cargando.value = true;
    const url = `https://api.telegram.org/bot${ajustes.value.token_telegram}/sendDocument`;
    const fd = new FormData();
    fd.append("chat_id", ajustes.value.id_chat_telegram);
    fd.append("caption", `Hola 🤖, aquí el respaldo del firmador 🗝️`);
    fd.append("parse_mode", "html");
    fd.append("document", await obtenerBaseDeDatosComoArchivo());
    const respuestaHttp = await fetch(url, {
        method: 'POST',
        body: fd,
    });
    const respuestaTelegram = await respuestaHttp.json();
    cargando.value = false;
    if (respuestaTelegram.ok) {
        toastStore.mostrarToast("Enviado a Telegram", "success", 500)
    } else {
        toastStore.mostrarToast("Error enviando a Telegram", "error", 500)
    }
}

const puedeEnviarATelegram = computed(() => {
    return ajustes.value.id_chat_telegram && ajustes.value.token_telegram;
})

const init = async () => {
    const todosLosAjustes = await dbStore.exec(`SELECT id, id_chat_telegram, token_telegram FROM ajustes`, []);
    if (todosLosAjustes.length > 0) {
        ajustes.value = todosLosAjustes[0];
    }
}

const onArchivoSeleccionado = async (archivos: Array<File>) => {
    if (!confirm(`¿Está seguro de importar el archivo? esto va a reemplazar todos los datos existentes y no se puede deshacer`)) {
        return;
    }
    if (archivos.length <= 0) {
        return;
    }
    const baseDeDatos = archivos[0];
    const apuntador = await obtenerApuntadorABaseDeDatos();
    const escribible = await apuntador.createWritable();
    await escribible.write(await baseDeDatos.arrayBuffer())
    await escribible.close();
}

onMounted(() => {
    init();
})
</script>

<template>
    <div class="flex flex-col">
        <h2 class="text-2xl">Exportar</h2>
        <div class="flex flex-row">
            <CustomButton :loading="cargando" :disabled="!puedeEnviarATelegram" @click="enviarATelegram()">A Telegram
            </CustomButton>
            <CustomButton :loading="cargando" @click="descargarComoArchivo()">Descargar</CustomButton>
        </div>
        <h2 class="text-2xl">Importar</h2>
        <FileSelect :clean-on-change="true" label="Seleccione base de datos previamente exportada"
            v-model="archivoParaImportar" @change="onArchivoSeleccionado"></FileSelect>
    </div>
</template>