import {
  addDoc,
  collection,
  doc,
  getDocs,
  updateDoc,
} from 'firebase/firestore/lite'
import { db } from '~/libs/firestore'
import { addMessageRequest } from '~/type/api/firebase/firebase'

// 取得
export const requestGetMessages = async (collectionId: string) => {
  const citiesCol = collection(db, collectionId)
  const response = await getDocs(citiesCol)
  return response
}

// 追加
export const requestAddMessage = async (request: addMessageRequest) => {
  await addDoc(collection(db, 'messages'), request)
}

// 更新(メッセージを編集)
export const requestUpdateMessage = async (
  messageId: string,
  updatedMessage: string
) => {
  const washingtonRef = doc(db, 'messages', messageId)
  await updateDoc(washingtonRef, { message: updatedMessage })
}
