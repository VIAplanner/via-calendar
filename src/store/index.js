import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        events: [],
        dialog: false
    },
    mutations: {
        addEvent(state, payload) {
            state.events.push(payload);
        },
        removeEvent(state, payload) {
            Vue.delete(state.events, payload)
        },
        toggleDialog(state, payload) {
            state.dialog = payload
        }
    },
    actions: {
        deleteEvent(context, payload) {
            context.state.events.forEach(function (value, i) {
                if (value.uuid == payload) {
                    context.commit("removeEvent", [i])
                }
            });
        }
    },
    getters: {
        getEventList: (state) => {
            return state.events;
        },
        getDialog: (state) => {
            return state.dialog;
        }
    }


});

