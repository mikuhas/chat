<template>
  <article class="c-chat_main__message" :class="{ 'edit-mode': isEdit }">
    <div class="row-flex">
      <p class="user">
        {{ message.userName }}
      </p>
      <p class="date">
        {{ formatDate(message.date) }}
      </p>
    </div>
    <p class="message" v-html="formatMessage(message.message)"></p>

    <div class="edit">
      <div class="edit_button" ref="edit" @click="openMenu">
        <i class="edit_button_icon fa-solid fa-ellipsis-vertical"></i>
      </div>
      <div class="edit_cancel" v-show="isEdit">キャンセル</div>
    </div>

    <div ref="toolTip" class="menu" v-show="isShowToolTip">
      <ul class="menu_list">
        <li class="toolTip menu_list__item" @click="editMessage">編集する</li>
        <li class="toolTip menu_list__item" @click="cancelMessage">送信取消</li>
      </ul>
    </div>
  </article>
</template>

<script lang="ts">
import { Timestamp } from 'firebase/firestore/lite'
import { Component, Prop, Vue } from 'vue-property-decorator'
import { createPopper } from '@popperjs/core'
import { MessageList } from '~/type/view/chat/message'

@Component
export default class Message extends Vue {
  /*******************
   ** props
   ******************/
  @Prop({})
  message!: MessageList

  @Prop({ default: false })
  isEdit!: boolean

  /*******************
   ** data
   ******************/
  isShowToolTip = false

  /*******************
   ** method
   ******************/
  formatDate(timestamp: Timestamp) {
    if (!timestamp) return '00:00:00'
    return new Date(timestamp.seconds * 1000)
  }

  formatMessage(message: string) {
    return message.replace(/\n/g, '<br />')
  }

  openMenu() {
    if (this.isShowToolTip === false) {
      this.isShowToolTip = true
      const popcorn = this.$refs.edit as Element
      const tooltip = this.$refs.toolTip as HTMLElement

      createPopper(popcorn, tooltip, {
        placement: 'left',
        modifiers: [
          {
            name: 'offset',

            options: {
              offset: [0, 20],
            },
          },
        ],
      })
    } else this.isShowToolTip = false
  }

  // メッセージを編集
  editMessage() {
    this.$emit('edit-message', this.message)
    this.isShowToolTip = false
  }

  // 送信取消
  cancelMessage() {
    this.$emit('cancel-message', this.message)
    this.isShowToolTip = false
  }
}
</script>

<style lang="scss" scoped>
@import url(http://fonts.googleapis.com/earlyaccess/notosansjp.css);

.c-chat_main__message {
  width: 100%;
  box-sizing: border-box;
  padding: 20px 20px 40px 20px;
  position: relative;
}

.user {
  font-weight: 800;
  font-size: 14px; // TODO
}
.date {
  font-weight: 300;
  font-size: 12px;
}

.message {
  border-radius: 20px;
  display: inline-flex;
}

.edit {
  &_button {
    position: absolute;
    right: 20px;
    top: 20px;
    width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    &:hover {
      cursor: pointer;
    }
  }
  &_cancel {
    position: absolute;
    bottom: 10px;
    right: 40px;
  }
}

.edit-mode {
  background: #ccc;
}

.menu {
  width: 300px;
  background: #ffffff;
  border-radius: 4px;
  box-shadow: 1px 1px 2px 1px #ccc;
  border: 1px solid #ccc;
  font-size: 14px;
  &_list {
    margin: 0;
    padding: 0;
    transition: 0.2s;
    &__item {
      list-style: none;
      padding: 10px;
      user-select: none;
    }
    &:hover {
      cursor: pointer;
      background: #dddddd;
    }
  }
}
</style>