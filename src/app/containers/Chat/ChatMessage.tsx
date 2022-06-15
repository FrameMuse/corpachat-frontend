import "./Chat.scss"

import _ from "lodash"
import { ReactNode, useEffect, useState } from "react"
import { classWithModifiers } from "utils/common"
import { decrypt } from "utils/crypto"
import { humanizeDate } from "utils/date"

import { ChatMessageType } from "./Chat.types"

const FAKE_MESSAGE_FLICKER_INTERVAL = 25
// code symbols string with special characters
const CHARS = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ`~!@#$%^&*()_+-=[]{}|;':,./<>?"

export interface ChatMessageProps extends ChatMessageType {
  onRight?: boolean
  /**
   * Secret is used to encrypt and decrypt the messages.
   */
  secret?: string
}

function ChatMessage(props: ChatMessageProps) {
  const createdAt = new Date(props.created_at)
  const message = props.secret ? decrypt(props.message, props.secret) : props.message

  const stillInSecret = props.secret != null && message === null
  return (
    <div className={classWithModifiers("chat-message", props.onRight && "on-right", stillInSecret && "still-in-secret")}>
      {/* <img src={props.avatar} alt="participant's avatar" className="chat-message__author-avatar" /> */}
      {props.attachments?.map((attachment, index) => (
        <div className="chat-message__attachments" key={index}>
          <div className="chat-message-attachment">
            <a href={attachment}>
              <img src={attachment} alt="attachment" className="chat-message-attachment__image" />
            </a>
          </div>
        </div>
      ))}
      <span className="chat-message__username">{props.user.name}</span>
      <div className="chat-message__message">
        <p className="chat-message__text">
          <FakeChatMessage hidden={stillInSecret}>
            {message}
          </FakeChatMessage>
        </p>
        <time className="chat-message__datetime" datatype={createdAt.toISOString()}>{(humanizeDate(createdAt))}</time>
      </div>
    </div>
  )
}

function FakeChatMessage(props: { hidden: boolean; children: ReactNode }) {
  const [fakeMessage, setFakeMessage] = useState("")

  useEffect(() => {
    const interval = setInterval(() => {
      setFakeMessage(_.shuffle([...CHARS]).slice(0, 10).join(""))
    }, FAKE_MESSAGE_FLICKER_INTERVAL)
    return () => {
      clearInterval(interval)
    }
  }, [props.hidden])
  return <>{props.hidden ? fakeMessage : props.children}</>
}

export default ChatMessage