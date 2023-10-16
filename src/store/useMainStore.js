import { defineStore } from "pinia";

export const useMainStore = defineStore("main", {
    state: () => ({
        currentModelState: true,
    }),
    actions: {
        toggleModelState(state) {
            this.currentModelState = state;
        }
    },
});

// If you need to process data before returning it use getters: {}
