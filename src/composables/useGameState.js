// useStorage.js (create a separate file)
import { ref } from 'vue';

export function useGameState(key, value) {
    const initialValue = localStorage.getItem(key) || value.value;

    const storedValue = ref(initialValue);

    const setValue = (newValue) => {
        storedValue.value = newValue;
        localStorage.setItem(key, newValue);
    };

    return { storedValue, setValue };
}