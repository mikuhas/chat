import { Timestamp } from 'firebase/firestore/lite'

export type addMessageRequest = {
  message: string
  userId: string
  userName: string
  date: Timestamp
  isDelete: boolean
}

export type getMessagesResponse = {
  message: string
  userId: string
  userName: string
  date: Timestamp
  isDelete: boolean
}
