import "./Chat.scss"

import { classWithModifiers, getFileId } from "utils/common"

export interface ChatMessageProps {
  onRight?: boolean
  message: string
  // avatar: string
  // createdAt: Date | string | number
  attachments?: File[]
}

function ChatMessage(props: ChatMessageProps) {
  // const createdAt = new Date(props.createdAt)
  return (
    <div className={classWithModifiers("chat-message", props.onRight && "on-right")}>
      {/* <img src={props.avatar} alt="participant's avatar" className="chat-message__author-avatar" /> */}
      {props.attachments?.map(attachment => (
        <div className="chat-message__attachments" key={getFileId(attachment)}>
          <div className="chat-message-attachment">
            <a href={URL.createObjectURL(attachment)}>
              <img src={URL.createObjectURL(attachment)} alt="attachment" className="chat-message-attachment__image" />
            </a>
          </div>
        </div>
      ))}
      <div className="chat-message__message">
        <p className="chat-message__text">{props.message}</p>
        {/* <time className="chat-message__datetime" datatype={createdAt.toISOString()}>{createdAt.toLocaleString()}</time> */}
      </div>
    </div>
  )
}

export default ChatMessage