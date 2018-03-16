import Vue from "vue";
import Vuex from "vuex";

const backgroundPage = chrome.extension.getBackgroundPage();

let background: any;
if (backgroundPage) {
    background = (backgroundPage.window as any).background;
}

Vue.use(Vuex);

export default new Vuex.Store({
    actions: {
        setTeamId({ commit }, teamId) {
            commit("setTeamId", teamId);
        },
    },
    mutations: {
        setTeamId(state, teamId) {
            state.teamId = teamId;
            background.teamId = teamId;
        },
    },
    state: {
        teamId: background.teamId,
    },
});
