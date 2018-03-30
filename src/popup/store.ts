import Vue from "vue";
import Vuex from "vuex";

const backgroundPage = chrome.extension.getBackgroundPage();

let background: any;
if (backgroundPage) {
    background = (window as any).background = (backgroundPage.window as any).background;
}

Vue.use(Vuex);

export default new Vuex.Store({
    actions: {
        setTeam({ commit }, teamId) {
            commit("setTeam", teamId);
        },
    },
    mutations: {
        setTeam(state, team) {
            state.team = team;
            background.team = team;
        },
    },
    state: {
        team: background.team,
        teams: background.teams,
    },
});
