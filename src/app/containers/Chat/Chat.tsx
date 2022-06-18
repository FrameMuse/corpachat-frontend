import "./Chat.scss"

import useAttach from "infrastructure/persistence/socket/useAttach"
import useTransmit from "infrastructure/persistence/socket/useTransmit"
import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { FileToURLDataBase64 } from "utils/common"
import { encrypt } from "utils/crypto"

import { ChatMessageType } from "./Chat.types"
import ChatMessage from "./ChatMessage"
import ChatSend from "./ChatSend"

interface ChatProps {
  userId: number
  hash?: string
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
      attachments: (await Promise.all(attachments.map(FileToURLDataBase64))).map(file => props.secret ? encrypt(file, props.secret).toString() : file),
    })
  }
  function onChatReceiveMessage(message: ChatMessageType) {
    setMessages(messages => [...messages, message])
  }

  useEffect(() => {
    if (messagesRef.current == null) return

    messagesRef.current.scrollTop = messagesRef.current.scrollHeight
  }, [messages])

  if (props.secret?.length === 0) {
    return (
      <h2>
        Emmm? You just ignore the fact that you need a key to know the truth. <br /> <br />
        I guess you're just no care about the real truthiness, you have no idea what you're trying to observe. <br /> <br />
        You might need to check your psychotherapist, call they right the moment you leave this page. <br /> <br />
        WAIT, YOU KEEP READING THIS, I'M SURE OUT OF SANE.
      </h2>
    )
  }

  return (
    <div className="chat">
      <div className="chat__body">
        <div className="chat-header">
          <div className="chat-header__hash">
            <span>Hash:</span>
            <Link className="weak" to="/about/hash" title={props.hash}>{props.hash?.slice(0, 5)} ... {props.hash?.slice(-5)}</Link>
          </div>
          <div className="chat-header__online">17</div>
        </div>
        <div className="chat__messages" ref={messagesRef}>
          {messages.map((message, index) => (
            <ChatMessage {...message} onRight={props.userId === message.user.id} secret={props.secret} key={index} />
          ))}
        </div>
        <div className="chat__footer">
          <ChatSend onSend={onSend} />
        </div>
      </div>
      <div className="chat-sidebar">
        <div className="chat-sidebar__header">
          <div className="chat-sidebar__title">Chat participants</div>
        </div>
        <div className="chat-sidebar__container">123</div>
      </div>
    </div>
  )
}


// interface ChatParticipantProps {
//   id: number
//   name: string
// }

// function ChatParticipant(props: ChatParticipantProps) {

// }

export async function getFileFromURL(url: string) {
  const fileName = url.slice(url.lastIndexOf("/") + 1)

  const response = await fetch(url)
  const Uint8Array = (await response.body?.getReader()?.read())?.value

  return new File(Uint8Array ? [Uint8Array] : [], fileName, { type: response.headers.get("content-type") || "image" })
}

export default Chat
