import OuterLink from "app/ui/OuterLink/OuterLink"
import { Dispatch, DragEvent } from "react"
import { getFileId } from "utils/common"

interface ChatAttachmentsProps {
  files: File[]
  onChange: Dispatch<File[]>
}

function ChatAttachments(props: ChatAttachmentsProps) {
  function onDrop(event: DragEvent<HTMLInputElement>) {
    event.preventDefault()

    const files = [...event.dataTransfer.files]
    props.onChange(files)
  }
  return (
    <div className="chat-attachments">
      <div className="chat-attachment" onDragOver={event => event.preventDefault()} onDrop={onDrop}>
        <div className="chat-attachment__type">Drop</div>
      </div>
      {props.files.map(file => (
        <div className="chat-attachment" key={getFileId(file)}>
          {file.type.includes("image") && (
            <>
              <img src={URL.createObjectURL(file)} alt="attachment" className="chat-attachment__image" />
              <OuterLink className="ghost" to={URL.createObjectURL(file)} />
            </>
          )}
          <div className="chat-attachment__type">{file.name}</div>
        </div>
      ))}
    </div>
  )
}

export default ChatAttachments
