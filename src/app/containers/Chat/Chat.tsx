import "./Chat.scss"

import Loader from "app/ui/Loader/Loader"
import useAttach from "infrastructure/persistence/socket/useAttach"
import useClientSocket from "infrastructure/persistence/socket/useClient"
import { ReactNode, useEffect, useState } from "react"
import { URLDataBase64 } from "types"
import { FileToURLDataBase64 } from "utils/common"

import { ChatMessageType } from "./Chat.types"
import ChatMessage from "./ChatMessage"
import ChatSend from "./ChatSend"

interface ChatProps {
  userId: number
  authKey: string
}

function Chat(props: ChatProps) {
  const clientSocket = useClientSocket()
  const [messages, setMessages] = useState<ChatMessageType[]>([])

  useAttach("CHAT_RECEIVE_MESSAGE", onChatReceiveMessage)

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

    clientSocket.transmit<{
      auth_key: string
      message: string
      attachments?: URLDataBase64[]
    }>("CHAT_SEND_MESSAGE", { auth_key: props.authKey, message, attachments: await Promise.all(attachments.map(FileToURLDataBase64)) })
  }
  function onChatReceiveMessage(message: ChatMessageType) {
    setMessages(messages => [...messages, message])
  }

  return (
    <div className="chat">
      <div className="chat__body">
        <div className="chat__messages">
          {messages.map((message, index) => (
            <AwaitPromise state={Promise.all(message.attachments?.map(getFileFromURL) || [])} key={index}>
              {attachments => (
                <ChatMessage message={message.message} attachments={attachments} onRight={props.userId === message.user_id} />
              )}
            </AwaitPromise>
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

interface AwaitPromiseProps<T> {
  state: Promise<T>
  children: (result: T) => ReactNode
}

function AwaitPromise<T>(props: AwaitPromiseProps<T>) {
  const [result, setResult] = useState<T | null>(null)

  useEffect(() => {
    async function awaitPromises() {
      // if (props.state instanceof Array) {
      //   return await Promise.all(props.state)
      // }
      return await props.state
    }

    awaitPromises().then(setResult)
  }, [props.children])

  if (result === null) return <Loader />
  return <>{props.children(result)}</>
}

export default Chat

