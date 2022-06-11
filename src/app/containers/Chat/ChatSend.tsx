import Button from "app/ui/Button/Button"
import { useState } from "react"
import { inputValue } from "utils/common"

import ChooseImage from "../ChooseImage/ChooseImage"

interface ChatSendProps {
  onSend: (message: string, attachments: File[]) => void
}

function ChatSend(props: ChatSendProps) {
  const [message, setMessage] = useState("")
  const [attachments, setAttachments] = useState<File[]>([])
  function onSubmit() {
    setMessage("")
    props.onSend(message, attachments)
  }
  return (
    <div className="chat-send">
      <input
        className="chat-send__message"
        placeholder="Enter message of your own ^_^"
        value={message}
        onChange={inputValue(setMessage)}
      />
      <ChooseImage onChange={setAttachments} />
      <Button className="chat-send__submit" onClick={onSubmit}>Send</Button>
    </div>
  )
}

export default ChatSend
