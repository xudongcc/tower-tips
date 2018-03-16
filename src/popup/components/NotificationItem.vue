<template>
  <div class="notificationItem">
    <div class="notificationItem__status" :class="{ 'notificationItem__status--unread': notification.unread }"></div>
    <img class="notificationItem__avatar" :src="notification.member.avatar" @click="openMemberPage(notification.member.id)" />
    <div class="notificationItem__body" @click="openNotificationPage(notification.id)">
      <div class="notificationItem__meta">
        <span class="notificationItem__name" v-html="notification.member.name"></span>
        <span class="notificationItem__action" v-html="notification.action"></span>
      </div>
      <div class="notificationItem__target" v-if="notification.target" v-html="notification.target"></div>
      <div class="notificationItem__content" v-if="notification.content" v-html="notification.content"></div>
    </div>
    <div class="notificationItem__date">
      {{ moment(Date(notification.createdAt)).format("YYYY年") }}<br/>
      {{ moment(Date(notification.createdAt)).format("MM月DD日") }}
    </div>
  </div>
</template>

<script lang="ts">
import moment from "moment";
import { Component, Prop, Provide, Vue } from "vue-property-decorator";
import { Notification } from "../../services/Notification";

@Component
export default class NotificationItem extends Vue {
  @Prop()
  private notification?: Notification;

  @Provide()
  private teamId: string = "ac7af4421cc94b51bc19b553448b2c42";

  @Provide()
  private moment = moment;

  private openMemberPage(memberId: string) {
    window.open(`https://tower.im/members/${memberId}`);
  }

  private openNotificationPage(notificationId: string) {
    window.open(`https://tower.im/teams/${this.teamId}/notifications/${notificationId}`);
  }
}
</script>

<style scoped lang="scss">
  .notificationItem {
    display: flex;
    font-size: 14px;
    padding: 10px 0;
    align-items: center;
    color: #555;
    border-bottom: 1px #ddd solid;

    &:hover {
      background-color: #eee;
    }

    &__status {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 20px;

      &--unread::after {
        display: block;
        content: "";
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: rgb(118, 193, 197);
      }
    }

    &__avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      margin-right: 10px;
      cursor: pointer;
    }

    &__body {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      margin-right: 10px;
      width: 255px;
      height: 100%;
      cursor: pointer;
    }

    &__meta {
      width: 100%;
    }

    &__target,
    &__content {
      width: 100%;
      text-overflow: ellipsis;
      overflow: hidden;
	    white-space: nowrap;
    }

    &__name {
      margin-right: 5px;
    }

    &__date {
      width: 55px;
      height: 100%;
      font-size: 12px;
      text-align: right;
      margin-right: 10px;
    }
  }
</style>
