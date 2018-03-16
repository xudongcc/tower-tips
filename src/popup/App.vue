<template>
  <div id="app">
    <van-nav-bar
      class="tips-header"
      @click-left="readAll"
      @click-right="openSettingPopup">
      <span class="tips-header__title" slot="title">Tower.im Tips</span>
      <van-icon class="tips-header__icon" name="success" slot="left" />
      <van-icon class="tips-header__icon" name="setting" slot="right" />
    </van-nav-bar>
    <router-view class="tips-main" />

    <!-- 选择团队面板 -->
    <van-actionsheet
      class="tips-selectPanel"
      v-model="showSelectTeam"
      :actions="actions" />
  </div>
</template>

<script lang="ts">
import { Toast } from "vant";
import { Component, Vue } from "vue-property-decorator";
import { Action, State } from "vuex-class";
import { Notification } from "../services/Notification";
import { Team } from "../services/Team";

@Component({})
export default class Home extends Vue {
  @State("teamId")
  public teamId?: string;

  @Action("setTeamId")
  public setTeamId?: (teamId: string) => void;

  public showSelectTeam: boolean = false;
  public teams: Team[] = [];

  get actions() {
    return this.teams.map((team) => {
      return {
        ...team,
        callback: () => {
          if (this.setTeamId) {
            this.setTeamId(team.id);
          }

          this.showSelectTeam = false;
          Toast(`切换团队为 ${team.name}`);
        },
        className: this.teamId === team.id ? "active" : "",
      };
    });
  }

  public async mounted() {
    if (!this.teamId) {
      this.teams = await Team.getTeams();
      if (
        this.teams.length > 0 &&
        this.teams[0].id &&
        this.setTeamId
      ) { this.setTeamId(this.teams[0].id); }
    }
  }

  public async readAll() {
    if (this.teamId) {
      try {
        await Notification.readAll(this.teamId);
        Toast("成功标记全部通知为已读。");
      } catch (err) {
        Toast("标记全部通知为已读操作失败。");
        throw err;
      }
    }
  }

  public async openSettingPopup() {
    this.teams = await Team.getTeams();
    this.showSelectTeam = true;
  }
}
</script>


<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  display: flex;
  flex-direction: column;
  width: 400px;
  height: 600px;
}

.tips {
  &-header {
    background-color: rgb(118, 193, 197);

    &__icon,
    &__title {
      color: #fff !important;
    }
  }

  &-main {
    flex: 1;
    overflow: auto;
  }

  &-selectPanel {
    color: #555;

    .active {
      color: #5bc4c7;
    }
  }
}

</style>
