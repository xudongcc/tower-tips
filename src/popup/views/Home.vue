<template>
  <div class="home">
    <div class="loading" v-if="loading">
      <van-loading color="black" size="40px" />
    </div>

    <template v-else>
      <NoticeItem v-for="(notice, index) in notices"
        :key="index"
        :notice="notice" />
      <div class="more" @click="openNoticesPage">更多通知</div>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Provide, Vue, Watch } from "vue-property-decorator";
import { State } from "vuex-class";
import { Notice } from "../../services/Notice";
import { Team } from "../../services/Team";
import NoticeItem from "../components/NoticeItem.vue";

@Component({
  components: {
    NoticeItem
  }
})
export default class Home extends Vue {
  @State("team") public team?: Team;

  @Provide() public notices: Notice[] = [];

  public loading: boolean = false;

  public async getNotices() {
    if (this.team) {
      this.loading = true;
      this.notices = await Notice.getNotices(this.team.guid);
      this.loading = false;
    }
  }

  @Watch("team")
  public onTeamIdChanged(team: Team) {
    this.getNotices();
  }

  public async mounted() {
    this.getNotices();
  }

  public async openNoticesPage() {
    if (this.team instanceof Team) {
      window.open(`https://tower.im/teams/${this.team.guid}/notices/`);
    }
  }
}
</script>

<style lang="scss">
.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.more {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 40px;
  color: #76c1c5;
  cursor: pointer;
}
</style>

