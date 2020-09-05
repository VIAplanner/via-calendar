import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        events: []
    },
    mutations: {
        addEvent(state, payload) {
            state.events.push(payload);
        },
        deleteEvent(state, payload) {
            Vue.delete(state.events, payload)
        }
    },
    getters: {
        getEventList: (state) => {
            return state.events;
        }
    }


});

