import { defineStore } from 'pinia'
export const useToastStore = defineStore('toast', () => {
    function mostrarToast(mensaje: string, tipo: 'info' | 'success' | 'error' = 'info', duracionEnMilisegundos: number = 3000) {
        const toast = document.createElement('div');

        toast.className = `
    fixed inset-x-0 mx-auto
    top-8
    w-fit max-w-sm md:max-w-md
    p-4 rounded-lg shadow-lg
    text-white text-center
    z-50
    transform transition-all duration-500 ease-out
    opacity-0 translate-y-full // Estado inicial para la animación de entrada
  `;

        switch (tipo) {
            case 'success':
                toast.classList.add('bg-green-600');
                break;
            case 'error':
                toast.classList.add('bg-red-600');
                break;
            case 'info':
            default:
                toast.classList.add('bg-blue-600');
                break;
        }

        toast.textContent = mensaje;

        document.body.append(toast);

        void toast.offsetWidth;

        toast.classList.remove('opacity-0', 'translate-y-full');
        toast.classList.add('opacity-100', 'translate-y-0');

        setTimeout(() => {
            toast.classList.remove('opacity-100', 'translate-y-0');
            toast.classList.add('opacity-0', 'translate-y-full'); // Vuelve al estado inicial de animación

            toast.addEventListener('transitionend', () => {
                toast.remove();
            }, { once: true });
        }, duracionEnMilisegundos);
    }
    return { mostrarToast };
});