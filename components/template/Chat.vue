<template>
  <div class="c-chat">
    <div class="c-chat_header">
      <button>戻る</button>
      <div class="c-chat_header__talking-persons">相手</div>
      <input
        type="text"
        class="user-name"
        v-model="userName"
        placeholder="ユーザー名"
      />
    </div>
    <div class="c-chat_main">
      <div class="c-chat_main_message" ref="main">
        <Message
          v-for="data in messages"
          :key="data.messageId"
          :message="data"
          @edit-message="editMessage($event)"
          @cancel-message="cancelMessage($event)"
          @edit-cancel="editCancel()"
          :is-edit="isEdit && selectedMessageId === data.messageId"
          :is-delete="selectedMessageId === data.messageId"
        />
      </div>
    </div>
    <div class="c-chat_input">
      <div class="c-chat_input__text">
        <textarea
          ref="messageBox"
          type="text"
          class="g-input"
          placeholder="メッセージを入力"
          v-model="sendMessage"
          @keydown="pressSendButton"
          :style="{
            height: messageBoxHeight,
          }"
        ></textarea>
      </div>
      <div class="c-chat_input__send" @click="registMessage()">
        <i class="fa-solid fa-paper-plane"></i>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { MessageList } from '~/type/view/chat/message'
import {
  requestAddMessage,
  requestGetMessages,
  requestUpdateMessage,
} from '~/api/firebase/request'
import { addMessageRequest } from '~/type/api/firebase/firebase'
import { db } from '~/libs/firestore'
import { updateDoc, Timestamp, doc } from 'firebase/firestore/lite'

@Component
export default class MainChat extends Vue {
  /*******************
   ** data
   ******************/
  sendMessage = ''
  userName = 'anonymous'
  messages: MessageList[] = []
  isEdit = false
  selectedMessageId = ''

  /*******************
   ** computed
   ******************/
  get messageBoxHeight() {
    return (
      (this.sendMessage?.split('\n').length * 24).toString() + 'px' || '24px'
    )
  }

  get userId() {
    return '001'
  }

  /*******************
   ** lifecycle
   ******************/
  mounted() {
    this.getMessage()
  }

  /*******************
   ** method
   ******************/
  // 送信コマンド押下時処理
  async pressSendButton(event: any) {
    if (this.isSendCommand(event) && this.sendMessage) {
      this.registMessage()
    }
  }

  // メッセージを登録
  async registMessage() {
    // TODOユーザーIDが同じ場合の条件分を追加
    if (this.isEdit && this.sendMessage != '') {
      await this.updateMessage()
    } else {
      await this.addMessage()
    }
    this.getMessage()
  }

  // メッセージを追加
  async addMessage() {
    const data = {
      message: this.sendMessage,
      userId: this.userId,
      userName: this.userName,
      date: Timestamp.now(),
      isDelete: false,
    } as addMessageRequest

    await requestAddMessage(data).then(() => {
      this.sendMessage = ''
    })
  }

  // メッセージを更新
  async updateMessage() {
    await requestUpdateMessage(this.selectedMessageId, this.sendMessage).then(
      () => {
        this.sendMessage = ''
        this.isEdit = false
      }
    )
  }

  // メッセージ一覧を取得
  async getMessage() {
    const response = await requestGetMessages('messages')
    const messageList = response.docs.map((doc) => {
      return {
        messageId: doc.id,
        message: doc.data().message,
        userId: doc.data().userId,
        userName: doc.data().userName,
        date: doc.data().date,
        isDelete: doc.data().isDelete,
      }
    })
    this.messages = Object.assign(messageList)
    this.messages.sort((a, b) => {
      if (a.date < b.date) return -1
      if (a.date > b.date) return 1
      return 0
    })
    this.$nextTick(function () {
      const target = this.$refs.main as HTMLElement
      target.parentElement?.scrollTo(0, target.clientHeight)
    })
  }

  // 選択対象メッセージを編集
  editMessage(message: MessageList) {
    this.sendMessage = message.message
    this.selectedMessageId = message.messageId
    this.isEdit = true
  }

  // 送信取消
  async cancelMessage(message: MessageList) {
    this.selectedMessageId = message.messageId
    const washingtonRef = doc(db, 'messages', this.selectedMessageId)
    await updateDoc(washingtonRef, { isDelete: true })

    this.getMessage()
  }

  // メッセージ編集をキャンセル
  editCancel() {
    this.isEdit = false
    this.selectedMessageId = ''
    this.sendMessage = ''
  }

  // 送信コマンドを入力
  isSendCommand(event: any): boolean {
    return event.ctrlKey && event.keyCode === 13
  }
}
</script>

<style lang="scss" scoped>
@import url(http://fonts.googleapis.com/earlyaccess/notosansjp.css);

.c-chat {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  &_header {
    display: inline-flex;
    width: 100%;
    height: 5%;
    flex-shrink: 0;
    background: #333333;
    &__talking-persons {
      font-size: 18px;
      align-items: center;
      display: inline-flex;
      color: #fff;
    }
    .user-name {
      margin-left: auto;
      margin-right: 20px;
    }
  }
  &_main {
    flex-grow: 1;
    overflow-y: scroll;
    background: #fff;
    width: 100%;
    height: auto;
    align-items: flex-start;
    transition: 0.5s;
    &::-webkit-scrollbar {
      display: none;
    }
    &_message {
      display: flex;
      flex-direction: column;
      width: 100%;
    }
  }
  &_input {
    background: #333333;
    bottom: 0;
    min-height: 50px;
    height: auto;
    width: 100%;
    display: flex;
    align-items: flex-end;
    flex-shrink: 0;

    &__text {
      box-sizing: border-box;
      padding: 20px;
      display: flex;
      width: 80%;
      height: 100%;
      justify-content: flex-end;
      align-items: center;

      textarea {
        min-height: 24px;
        min-width: 200px;
        max-height: 500px;
        height: 16px;
        padding: 10px 20px;
        font-size: 16px;
        width: 80%;
        background: #cccccc;
        border-radius: 16px;
      }
    }
    &__send {
      border-radius: 50%;
      padding: 10px;
      margin: 0 0 18px 0;
      transition: 0.2s;
      background: #9a9a9a;
      i {
        color: #aaaaaa;
        font-size: 20px;
        height: 100%;
        height: 100%;
        transition: 0.2s;
        color: #fff;
      }
      &:hover {
        cursor: pointer;
      }
    }
  }
}
</style>