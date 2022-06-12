import Button from "app/ui/Button/Button"
import Input from "app/ui/Input/Input"
import { DragEvent, useState } from "react"
import { getFileId, inputValue } from "utils/common"

import ChatAttachments from "./ChatAttachments"

interface ChatSendProps {
  onSend: (message: string, attachments: File[]) => void | PromiseLike<void>
}

function ChatSend(props: ChatSendProps) {
  const [message, setMessage] = useState("")
  const [attachments, setAttachments] = useState<File[]>([])
  function onSubmit() {
    if (message.length < 2) return

    setMessage("")
    setAttachments([])
    props.onSend(message, attachments)
  }
  function onDrop(event: DragEvent<HTMLInputElement>) {
    event.preventDefault()

    const files = [...event.dataTransfer.files]
    addAttachments(files)
  }
  async function addAttachments(filesToAdd: File[]) {
    const nextFiles: File[] = []
    // Filter by file
    for (const fileToAdd of filesToAdd) {
      if (attachments.some(file => getFileId(file) === getFileId(fileToAdd))) continue
      nextFiles.push(fileToAdd)
    }
    if (nextFiles.length === 0) return

    setAttachments([...attachments, ...nextFiles])
  }
  return (
    <>
      <form className="chat-send" onSubmit={event => event.preventDefault()}>
        <Input width="100%" pattern=".{2,}" value={message} onChange={inputValue(setMessage)} onDrop={onDrop}>Enter message of your own ^_^</Input>
        {/* <ChooseImage onChange={setAttachments} /> */}
        <Button className="chat-send__submit" type="submit" await onClick={onSubmit}>Send</Button>
      </form>
      <ChatAttachments files={attachments} onChange={addAttachments} />
    </>
  )
}

export default ChatSend
