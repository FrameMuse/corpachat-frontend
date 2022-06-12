import "./Chat.scss"

import { classWithModifiers } from "utils/common"
import { humanizeDate } from "utils/date"

import { ChatMessageType } from "./Chat.types"

export interface ChatMessageProps extends ChatMessageType {
  onRight?: boolean
}

function ChatMessage(props: ChatMessageProps) {
  const createdAt = new Date(props.created_at)
  return (
    <div className={classWithModifiers("chat-message", props.onRight && "on-right")}>
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
        <p className="chat-message__text">{props.message}</p>
        <time className="chat-message__datetime" datatype={createdAt.toISOString()}>{(humanizeDate(createdAt))}</time>
      </div>
    </div>
  )
}

export default ChatMessage