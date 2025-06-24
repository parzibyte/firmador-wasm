<script lang="ts" setup>
import { computed, ref, type Ref } from 'vue';
import CustomButton from './CustomButton.vue';
import FileMultiple from "vue-material-design-icons/FileMultiple.vue";
type Props = {
    modelValue: File[],
    label: string,
    cleanOnChange?: boolean,
};

const props = withDefaults(defineProps<Props>(), {
    modelValue: () => {
        return [];
    },
    label: "",
    cleanOnChange: false,
})

const emit = defineEmits(["change", "update:modelValue"]);
const fileList = computed({
    set(value) {
        emit("update:modelValue", value);
    },
    get() {
        return props.modelValue;
    },
});

const inputReference: Ref<HTMLInputElement> = ref(document.createElement("input") as HTMLInputElement);

const handleClick = () => {
    inputReference.value.click()
}

const onActualInputChange = (e: Event) => {
    if (e.target === null) {
        return;
    }
    const input = e.target as HTMLInputElement;
    const files = input.files;
    if (files === null) {
        return;
    }
    fileList.value = files;
    if (files.length <= 0) {
        return;
    }
    emit("change", files);
    if (props.cleanOnChange) {
        input.value = "";
    }
}
</script>
<template>
    <CustomButton @click="handleClick">
        <FileMultiple class="mr-2"></FileMultiple>
        {{ props.label }}
    </CustomButton>
    <div>
        <span class="mr-2 mt-1 mb-1 inline-block text-white bg-indigo-500 p-1 font-semibold rounded-md text-xs"
            v-for="file in props.modelValue">{{ file.name }}</span>
        <p v-if="props.modelValue.length <= 0">No has seleccionado ningún archivo</p>
        <input v-bind="$attrs" @change="onActualInputChange" ref="inputReference" class="hidden" type="file">
    </div>
</template>