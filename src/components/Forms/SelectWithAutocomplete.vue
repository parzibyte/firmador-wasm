<script setup lang="ts">
import { ref, onBeforeMount, watch, defineProps, withDefaults, computed, defineExpose } from "vue"
import type { Ref } from 'vue'
import Backspace from 'vue-material-design-icons/Backspace.vue';

type MyComponentProps<T> = {
    label?: string;
    displayItemFunction: (item: T) => string;
    modelValue: T;
    getItemsFunction: (criteria: string) => Promise<Array<T>>;

};
const props = withDefaults(defineProps<MyComponentProps<any>>(), {
    label: "Select an option",
    displayItemFunction: (item: any) => {
        return item.toString();
    },
    getItemsFunction: async () => {
        return [];
    }
});
const emit = defineEmits(['update:modelValue', "change"])
const selectedItem = computed<MyComponentProps<any>["modelValue"]>({
    get() {
        return props.modelValue
    },
    set(value) {
        emit('update:modelValue', value)
    }
})

const filteredItems: Ref<Array<MyComponentProps<any>["modelValue"]>> = ref([]);
const inputValue: Ref<string> = ref("");
const isInputFocused: Ref<boolean> = ref(false);
const input: Ref<any> = ref(null);
const keyboardIndex: Ref<number> = ref(-1);

const refreshRealInputValue = () => {
    if (selectedItem.value !== null) {
        inputValue.value = props.displayItemFunction(selectedItem.value);
    } else {
        inputValue.value = "";
    }
}


watch(selectedItem, (newValue, previousValue) => {
    refreshRealInputValue();
})

onBeforeMount(() => {
    filteredItems.value = [];
    refreshRealInputValue();
})

const onItemSelected = (item: MyComponentProps<any>["modelValue"]) => {
    selectedItem.value = item;
    keyboardIndex.value = -1;
    filteredItems.value = [];
    emit("change", item);
}

const onKeyup = (event: KeyboardEvent) => {
    switch (event.key) {
        case "ArrowDown":
            if (keyboardIndex.value < filteredItems.value.length - 1) {
                keyboardIndex.value++;
            } else {
                keyboardIndex.value = 0;
            }
            break;
        case "ArrowUp":
            if (keyboardIndex.value > 0) {
                keyboardIndex.value--;
            } else {
                keyboardIndex.value = filteredItems.value.length - 1;
            }
            break;
        case "Enter":
            if (keyboardIndex.value >= 0 && keyboardIndex.value < filteredItems.value.length) {
                onItemSelected(filteredItems.value[keyboardIndex.value])
            }
            break;
        default:
            filterItems();
    }
}

const filterItems = async () => {
    filteredItems.value = await props.getItemsFunction(inputValue.value);
}


const onInputFocus = () => {
    isInputFocused.value = true;
}

const onInputBlur = () => {
    isInputFocused.value = false;
}

const shouldShowClearButton = () => {
    return (inputValue.value !== "");
}

const clearSelectedItem = (focus: boolean) => {
    selectedItem.value = null;
    emit("change", null);
    inputValue.value = "";
    if (focus) {
        input.value.focus();
    }
}
defineExpose({ clearSelectedItem });



const additionalClassesForClearButton = () => {
    if (isInputFocused.value) {
        return "border-2 border-t-blue-500 border-b-blue-500 border-r-blue-500"
    }
    return "";
};
const additionalClassesForInput = () => {
    return {
        "border-2 border-t-blue-500 border-b-blue-500 border-l-blue-500 ": isInputFocused.value,
        "border border-l-gray-200 border-t-gray-200 border-b-gray-200 ": !isInputFocused.value,
        "border-r-blue-500": !shouldShowClearButton() && isInputFocused.value,
        "border-r-0": shouldShowClearButton(),
        "rounded-l-md": shouldShowClearButton(),
        "rounded-md": !shouldShowClearButton(),
    };
};
</script>
<template>
    <div class="flex flex-col p-1">
        <strong class="text-md font-semibold mb-1">{{ label }}</strong>
        <div class="flex flex-col relative">
            <div class="flex">
                <input ref="input" @focus="onInputFocus" @blur="onInputBlur" @keyup="onKeyup" v-model="inputValue"
                    :placeholder="label" type="input"
                    class="focus:outline-none text-xl w-full h-10 p-2"
                    :class="additionalClassesForInput()">
                <button v-if="shouldShowClearButton()" @click="clearSelectedItem(true)"
                    class="focus:outline-none text-gray-300 p-1 bg-white border border-l-0 rounded-r-md"
                    :class="additionalClassesForClearButton()">
                    <Backspace />
                </button>
            </div>
            <Transition>
                <div class="w-full border border-gray-200 border-t-0 absolute mt-10 z-10"
                    v-show="filteredItems.length > 0 && isInputFocused">
                    <div @click="onItemSelected(opcion)" v-for="(opcion, index) in filteredItems"
                        class="p-2  hover:bg-zinc-200 hover:cursor-pointer "
                        :class="{ 'bg-zinc-200': index === keyboardIndex, 'bg-white': index !== keyboardIndex }">
                        <slot :item="opcion" :index="index" name="item">
                            {{ opcion }}
                        </slot>
                    </div>
                </div>
            </Transition>
        </div>
    </div>
</template>
<style>
.v-enter-active,
.v-leave-active {
    transition: opacity 0.2s ease;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
}
</style>