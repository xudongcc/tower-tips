<template>
  <div class="home">
    <div class="loading" v-if="loading">
      <van-loading color="black" size="40px" />
    </div>

    <template v-else>
      <NotificationItem v-for="(notification, index) in notifications"
        :key="index"
        :notification="notification" />
      <div class="more" @click="openNotificationsPage">更多通知</div>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Provide, Vue, Watch } from "vue-property-decorator";
import { State } from "vuex-class";
import { Notification } from "../../services/Notification";
import NotificationItem from "../components/NotificationItem.vue";

@Component({
  components: {
    NotificationItem,
  },
})
export default class Home extends Vue {
  @State("teamId")
  public teamId?: string;

  @Provide()
  public notifications: Notification[] = [];

  public loading: boolean = false;

  public async getNotifications() {
    if (this.teamId) {
      this.loading = true;
      this.notifications = await Notification.getNotifications(this.teamId);
      this.loading = false;
    }
  }

  @Watch("teamId")
  public onTeamIdChanged(teamId: string) {
    this.getNotifications();
  }

  public async mounted() {
    this.getNotifications();
  }

  public async openNotificationsPage() {
    if (this.teamId) {
      window.open(`https://tower.im/teams/${this.teamId}/notifications/`);
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

