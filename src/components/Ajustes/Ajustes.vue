<script setup lang="ts">
import { onMounted, ref, type Ref } from 'vue';
import CustomInput from '../Forms/CustomInput.vue';
import type { Ajustes } from '@/Clases';
import { useDatabaseStore } from '@/stores/db';
import CustomButton from '../Forms/CustomButton.vue';
const dbStore = useDatabaseStore();
const ajustes: Ref<Ajustes> = ref({
    id: 0,
    id_chat_telegram: "",
    token_telegram: "",
});

const guardar = async () => {
    if (ajustes.value.id) {
        // ya había datos
        await dbStore.exec(`UPDATE ajustes SET id_chat_telegram = ?, token_telegram = ?`, [ajustes.value.id_chat_telegram, ajustes.value.token_telegram])
    } else {
        await dbStore.exec(`INSERT INTO ajustes (id_chat_telegram, token_telegram) VALUES (?, ?)`, [ajustes.value.id_chat_telegram, ajustes.value.token_telegram])
    }
}

const init = async () => {
    const ajustesRecuperados = await dbStore.exec(`SELECT id, id_chat_telegram, token_telegram FROM ajustes`, []);
    if (ajustesRecuperados.length > 0) {
        ajustes.value = ajustesRecuperados[0];
    }
}

onMounted(() => {
    init();
})
</script>

<template>
    <div class="flex flex-col">
        <CustomInput label="Token Telegram" v-model="ajustes.token_telegram"></CustomInput>
        <CustomInput label="Id chat Telegram" v-model="ajustes.id_chat_telegram"></CustomInput>
        <CustomButton @click="guardar">Guardar</CustomButton>
    </div>
</template>