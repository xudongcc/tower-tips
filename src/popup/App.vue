<template>
  <div id="app">
    <van-nav-bar
      class="tips-header"
      @click-left="readAll"
      @click-right="() => showSelectTeam = true">
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
import _ from "lodash";
import { Toast } from "vant";
import { Component, Vue } from "vue-property-decorator";
import { Action, State } from "vuex-class";
import { Notice } from "../services/Notice";
import { Team } from "../services/Team";

@Component({})
export default class Home extends Vue {
  @State("team")
  public team?: Team;

  @State("teams")
  public teams?: { [guid: string]: Team };

  @Action("setTeam")
  public setTeam?: (team: Team) => void;

  public showSelectTeam: boolean = false;

  get actions() {
    return _.map(this.teams, (team) => {
      return {
        ...team,
        callback: () => {
          if (typeof this.setTeam === "function") {
            this.setTeam(team);
            this.showSelectTeam = false;
            Toast(`切换团队为 ${team.name}`);
          }
        },
        className: (this.team && this.team.guid) === team.guid ? "active" : "",
      };
    });
  }

  public async readAll() {
    if (this.team) {
      try {
        await Notice.readAll(this.team.guid);
        Toast("成功标记全部通知为已读。");
      } catch (err) {
        Toast("标记全部通知为已读操作失败。");
        throw err;
      }
    }
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
