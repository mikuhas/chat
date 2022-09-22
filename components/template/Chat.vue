<template>
  <div class="c-chat">
    <div class="c-chat_header">
      <input type="submit" value="戻る" />
      <div class="c-chat_header__talking-persons">相手</div>
    </div>
    <div class="c-chat_main">
      <div
        class="c-chat_main__message"
        v-for="data in messages"
        :key="data.messageId"
      >
        <div class="row-flex">
          <p class="user">
            {{ data.userName }}
          </p>
          <p class="date">
            {{ formatDate(data.date) }}
          </p>
        </div>
        <p class="message">
          {{ data.message }}
        </p>
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
          @keydown="send"
          :style="{
            height: messageBoxHeight,
          }"
        ></textarea>
      </div>
      <div class="c-chat_input__send">
        <input class="g-input" type="submit" value="送信" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { MessageList } from '~/type/view/chat/message'

import { initializeApp } from 'firebase/app'
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  addDoc,
  Timestamp,
} from 'firebase/firestore/lite'

@Component
export default class MainChat extends Vue {
  sendMessage = ''

  firebaseConfig = {
    apiKey: this.$config.apiKey,
    authDomain: this.$config.authDomain,
    projectId: this.$config.projectId,
    storageBucket: this.$config.storageBucket,
    messagingSenderId: this.$config.messagingSenderId,
    appId: this.$config.appId,
  }

  // Initialize Firebase
  app = initializeApp(this.firebaseConfig)
  db = getFirestore(this.app)

  messages: MessageList[] = []

  get messageBoxHeight() {
    return (this.sendMessage.split('\n').length * 24).toString() + 'px'
  }

  get userName() {
    return 'ログインユーザ'
  }

  get userId() {
    return '001'
  }

  mounted() {
    this.getMessage()
  }

  formatDate(timestamp: Timestamp) {
    if (!timestamp) return '00:00:00'
    return new Date(timestamp.seconds * 1000)
  }

  async send(event: any) {
    if (event.ctrlKey && event.keyCode === 13) {
      console.log('送信')
      const data = {
        message: this.sendMessage,
        userId: this.userId,
        userName: this.userName,
        date: Timestamp.now(),
      }
      await addDoc(collection(this.db, 'messages'), data).then(
        () => (this.sendMessage = '')
      )
      this.getMessage()
    }
  }

  async getMessage() {
    const citiesCol = collection(this.db, 'messages')
    const citySnapshot = await getDocs(citiesCol)
    const cityList = citySnapshot.docs.map((doc) => doc.data())
    console.log(cityList)
    this.messages = Object.assign(cityList)
    this.messages.sort((a, b) => {
      if(a.date < b.date) return -1;
      if(a.date > b.date) return 1;
      return 0
    })
  }
}
</script>

<style lang="scss" scoped>
@import url(http://fonts.googleapis.com/earlyaccess/notosansjp.css);

.c-chat {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  &_header {
    display: inline-flex;
    width: 100%;
    height: 5%;
    &__talking-persons {
      font-size: 18px;
      align-items: center;
      display: inline-flex;
    }
  }
  &_main {
    flex-grow: 1;
    overflow-y: scroll;
    background: #eee;
    width: 100%;
    height: auto;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    &::-webkit-scrollbar {
      display: none;
    }
    &__message {
      margin: 20px;
      .user {
        font-weight: 800;
        font-size: 14px; // TODO
      }
      .date {
        font-weight: 300;
        font-size: 12px;
      }
    }
  }
  &_input {
    background: #ffffff;
    position: absolute;
    bottom: 0;
    min-height: 50px;
    height: auto;
    width: 100%;
    display: flex;
    align-items: flex-start;

    &__text {
      box-sizing: border-box;
      padding: 20px;
      display: flex;
      width: 80%;
      height: 100%;
      justify-content: center;
      align-items: center;

      textarea {
        min-height: 24px;
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
      width: 20%;
      padding: 20px;
      input {
        height: 24px;
        padding: 10px;
        height: 100%;
      }
    }
  }

  // global クラスに置き換え

  * {
    font-family: 'Noto Sans JP', sans-serif;
  }

  .g-input {
    border: none;
    outline: none;
    display: block;
  }

  .message {
    border-radius: 20px;
    display: inline-flex;
  }

  .row-flex {
    display: flex;
    align-items: flex-end;
  }

  p {
    margin: 0 5px;
    letter-spacing: 0.6px;
  }

  textarea::-webkit-scrollbar {
    display: none;
  }
}
</style>