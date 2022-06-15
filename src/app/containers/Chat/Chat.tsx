import "./Chat.scss"

import useAttach from "infrastructure/persistence/socket/useAttach"
import useTransmit from "infrastructure/persistence/socket/useTransmit"
import { useEffect, useRef, useState } from "react"
import { FileToURLDataBase64 } from "utils/common"
import { encrypt } from "utils/crypto"

import { ChatMessageType } from "./Chat.types"
import ChatMessage from "./ChatMessage"
import ChatSend from "./ChatSend"

interface ChatProps {
  userId: number
  defaultMessages?: ChatMessageType[]
  /**
   * Secret is used to encrypt and decrypt the messages.
   */
  secret?: string
}

function Chat(props: ChatProps) {
  const messagesRef = useRef<HTMLDivElement | null>(null)
  const [messages, setMessages] = useState<ChatMessageType[]>(props.defaultMessages ?? [])

  useAttach("CHAT_RECEIVE_MESSAGE", onChatReceiveMessage)
  const transmitChatMessage = useTransmit("CHAT_SEND_MESSAGE")

  async function onSend(message: string, attachments: File[]) {
    if (message.length === 0 && attachments.length === 0) {
      alert("Text a message or attach a file")
      return
    }

    const totalSize = attachments.reduce((result, next) => result + next.size, 0)
    if (totalSize >= (2 ** 25)) {
      alert(`Files in total should not be bigger than ${2 ** 25} bytes`)
      return
    }

    transmitChatMessage({
      message: props.secret ? encrypt(message, props.secret).toString() : message,
      attachments: await Promise.all(attachments.map(FileToURLDataBase64))
    })
  }
  function onChatReceiveMessage(message: ChatMessageType) {
    setMessages(messages => [...messages, message])
  }

  useEffect(() => {
    if (messagesRef.current == null) return

    messagesRef.current.scrollTop = messagesRef.current.scrollHeight
  }, [messages])

  return (
    <div className="chat">
      <div className="chat__body">
        <div className="chat__messages" ref={messagesRef}>
          {messages.map((message, index) => (
            <ChatMessage {...message} onRight={props.userId === message.user.id} secret={props.secret} key={index} />
          ))}
        </div>
      </div>
      <div className="chat__footer">
        <ChatSend onSend={onSend} />
      </div>
    </div>
  )
}

export async function getFileFromURL(url: string) {
  const fileName = url.slice(url.lastIndexOf("/") + 1)

  const response = await fetch(url)
  const Uint8Array = (await response.body?.getReader()?.read())?.value

  return new File(Uint8Array ? [Uint8Array] : [], fileName, { type: response.headers.get("content-type") || "image" })
}

export default Chat
