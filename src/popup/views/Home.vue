<template>
  <div class="home">
    <NotificationItem v-for="(notification, index) in notifications"
    :key="index"
    :notification="notification" />
    <div class="more" @click="openNotificationsPage">更多通知</div>
  </div>
</template>

<script lang="ts">
import { Component, Provide, Vue } from "vue-property-decorator";
import { Notification } from "../../services/Notification";
import NotificationItem from "../components/NotificationItem.vue";

@Component({
  components: {
    NotificationItem,
  },
})
export default class Home extends Vue {
  @Provide() public teamId: string = "ac7af4421cc94b51bc19b553448b2c42";
  @Provide() public notifications: Notification[] = [];

  public async mounted() {
    this.notifications = await Notification.getNotifications(this.teamId);
  }

  public async openNotificationsPage() {
    window.open(`https://tower.im/teams/${this.teamId}/notifications/`);
  }
}
</script>

<style lang="scss">
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

