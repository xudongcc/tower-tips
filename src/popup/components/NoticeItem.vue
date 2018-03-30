<template>
  <div class="noticeItem">
    <div class="noticeItem__status" :class="{ 'noticeItem__status--unread': notice.unread }"></div>
    <img class="noticeItem__avatar" :src="notice.member.avatar" @click="openMemberPage(notice.member.id)" />
    <div class="noticeItem__body" @click="openNoticePage(notice.id)">
      <div class="noticeItem__meta">
        <span class="noticeItem__name" v-html="notice.member.name"></span>
        <span class="noticeItem__action" v-html="notice.action"></span>
      </div>
      <div class="noticeItem__target" v-if="notice.target" v-html="notice.target"></div>
      <div class="noticeItem__content" v-if="notice.content" v-html="notice.content"></div>
    </div>
    <div class="noticeItem__date">
      <template v-if="Math.floor(new Date().getTime() / 1000 - new Date(notice.createdAt).getTime() / 1000) < 60 * 60 * 24 * 3">
        {{ friendlyDate(new Date(notice.createdAt)) }}
      </template>
      <template v-else>
        {{ moment(new Date(notice.createdAt)).format("YYYY年") }}<br/>
        {{ moment(new Date(notice.createdAt)).format("MM月DD日") }}
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import moment from "moment";
import { Component, Prop, Provide, Vue } from "vue-property-decorator";
import { State } from "vuex-class";
import { Notice } from "../../services/Notice";
import { Team } from "../../services/Team";

@Component
export default class NoticeItem extends Vue {
  @Prop()
  public notice?: Notice;

  @State("team")
  public team?: Team;

  @Provide()
  public moment = moment;

  public friendlyDate(date: Date) {
    const timestamp = date.getTime() / 1000;
    const currentTimestamp = new Date().getTime() / 1000;
    const diffTimestamp = currentTimestamp - timestamp;

    if (diffTimestamp < 60) {
      return "刚刚";
    } else if (diffTimestamp < 60 * 60) {
      return `${Math.floor(diffTimestamp / 60)}分钟前`;
    } else if (diffTimestamp < 60 * 60 * 24) {
      return `${Math.floor(diffTimestamp / 60 / 60)}小时前`;
    } else {
      return `${Math.floor(diffTimestamp / 60 / 60 / 24)}天前`;
    }
  }

  public openMemberPage(memberId: string) {
    window.open(`https://tower.im/members/${memberId}`);
  }

  public openNoticePage(noticeId: string) {
    if (this.team) {
      window.open(`https://tower.im/teams/${this.team.guid}/notifications/${noticeId}`);
    }
  }
}
</script>

<style scoped lang="scss">
  .noticeItem {
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
