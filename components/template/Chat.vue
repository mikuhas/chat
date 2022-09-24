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
    <div class="c-chat_main" ref="main">
      <Message
        v-for="data in messages"
        :key="data.messageId"
        :message="data"
        @edit-message="editMessage($event)"
        :is-edit="isEdit && selectedMessageId === data.messageId"
      />
    </div>
    <div class="c-chat_input">
      <div class="c-chat_input__text">
        <textarea
          ref="messageBox"
          type="text"
          class="g-input"
          placeholder="メッセージを入力"
          v-model="sendMessage"
          @keydown="send"
          :style="{
            height: messageBoxHeight,
          }"
        ></textarea>
      </div>
      <div class="c-chat_input__send" @click="registData()">
        <i class="fa-solid fa-paper-plane"></i>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { MessageList } from '~/type/view/chat/message'

import { db } from '~/libs/firestore'
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  Timestamp,
  doc,
} from 'firebase/firestore/lite'

@Component
export default class MainChat extends Vue {
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
  async send(event: any) {
    if (this.isSendCommand(event) && this.sendMessage) {
      console.log('送信')
      this.registData()
    }
  }

  async registData() {
    // TODOユーザーIDが同じ場合の条件分を追加
    if (this.isEdit) {
      const data = {
        message: this.sendMessage,
      }
      const washingtonRef = doc(db, 'messages', this.selectedMessageId)
      await updateDoc(washingtonRef, data).then(() => (this.sendMessage = ''))
      this.isEdit = false
    } else {
      const data = {
        message: this.sendMessage,
        userId: this.userId,
        userName: this.userName,
        date: Timestamp.now(),
      }
      await addDoc(collection(db, 'messages'), data).then(
        () => (this.sendMessage = '')
      )
    }
    this.getMessage()
  }

  async getMessage() {
    const citiesCol = collection(db, 'messages')
    const citySnapshot = await getDocs(citiesCol)
    const cityList = citySnapshot.docs.map((doc) => {
      return {
        messageId: doc.id,
        message: doc.data().message,
        userId: doc.data().userId,
        userName: doc.data().userName,
        date: doc.data().date,
      }
    })
    this.messages = Object.assign(cityList)
    this.messages.sort((a, b) => {
      if (a.date < b.date) return -1
      if (a.date > b.date) return 1
      return 0
    })
  }

    // メッセージ編集
  editMessage(message: MessageList) {
    this.sendMessage = message.message
    this.selectedMessageId = message.messageId
    this.isEdit = true
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
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    &::-webkit-scrollbar {
      display: none;
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