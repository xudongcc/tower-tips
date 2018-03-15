<template>
  <div class="home">
    <NotificationItem v-for="(notification, index) in notifications"
    :key="index"
    :notification="notification" />
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
  @Provide() public notifications: any[] = [];

  public async mounted() {
    this.notifications = await Notification.getNotifications(this.teamId);
    // this.notifications = mock;
  }
}
</script>
