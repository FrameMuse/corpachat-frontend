import { URLDataBase64 } from "types"

export interface ChatMessageType {
  user: {
    id: number
    name: string
    username: string
  }
  message: string
  created_at: string
  attachments?: URLDataBase64[]
}