import { ChatMessageType } from "app/containers/Chat/Chat.types"

import { Action } from "../client.types"

export const getUsername = (username: string): Action<{ exists: boolean }> => ({
  method: "GET",
  endpoint: `/username/${username}`,
})

export const getMessages = (hash_summ = "0", offset = 0): Action<{ messages: ChatMessageType[] }> => ({
  method: "GET",
  endpoint: `/messages/${hash_summ}`,
  params: { offset }
})

export const postUserSignup = (body: { name: string, username: string, password: string }): Action<{ auth_key: string; user_id: number }> => ({
  method: "POST",
  endpoint: `/user/signup`,
  body,
})

export const postUserSignin = (body: { username: string, password: string }): Action<{ auth_key: string; user_id: number }> => ({
  method: "POST",
  endpoint: `/user/signin`,
  body,
})

export const postChatCreate = (): Action<{ hash_summ: string }> => ({
  method: "POST",
  endpoint: `/chat/create`,
})