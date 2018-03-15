<template>
  <div class="notificationItem">
    <div class="notificationItem__status notificationItem__status--unread"></div>
    <img class="notificationItem__avatar" :src="notification.member.avatar" @click="openMemberPage(notification.member.id)" />
    <div class="notificationItem__body" @click="openNotificationPage(notification.id)">
      <div class="notificationItem__meta">
        <div class="notificationItem__name" v-html="notification.member.name"></div>
        <div class="notificationItem__action" v-html="notification.action"></div>
        <div class="notificationItem__date">{{ moment(Date(notification.createdAt)).format("YYYY.MM.DD") }}</div>
      </div>
      <div class="notificationItem__content" v-html="notification.content">
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import moment from "moment";
import { Component, Prop, Provide, Vue } from "vue-property-decorator";

@Component
export default class NotificationItem extends Vue {
  @Prop()
  private notification: any;

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
    height: 70px;
    align-items: center;

    &:not(:last-child) {
      border-bottom: 1px #ddd solid;
    }

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
      justify-content: space-around;
      height: 50px;
      margin-right: 10px;
      width: 320px;
      cursor: pointer;
    }

    &__meta {
      display: flex;
      width: 100%;
    }

    &__name {
      margin-right: 5px;
    }

    &__action {
      flex: 1;
    }

    &__date {
      font-size: 12px;
    }

    &__content {
      width: 100%;
      text-overflow: ellipsis;
      overflow: hidden;
	    white-space: nowrap;
    }
  }
</style>
