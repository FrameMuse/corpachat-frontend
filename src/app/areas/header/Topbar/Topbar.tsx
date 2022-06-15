import "./Topbar.scss"

import PopupLayout from "app/layouts/Modal/PopupLayout/PopupLayout"
import Button from "app/ui/Button/Button"
import Input from "app/ui/Input/Input"
import { isValidResponse } from "infrastructure/persistence/api/client"
import { postChatCreate } from "infrastructure/persistence/api/data/actions"
import { Modal } from "modules/modal/controller"
import { useModal } from "modules/modal/hook"
import { useState } from "react"
import { useClient } from "react-fetching-library"
import { useNavigate } from "react-router"
import { inputValue } from "utils/common"

function Topbar() {
  const client = useClient()
  const navigate = useNavigate()
  async function createSecretChat() {
    const response = await client.query(postChatCreate())
    if (!isValidResponse(response)) return

    navigate("/chat/" + response.payload.hash_summ)
  }
  return (
    <div className="topbar">
      <Button onClick={() => Modal.open(PopupJoinSecretChat)}>Join secret chat</Button>
      <Button await onClick={createSecretChat}>Create secret chat</Button>
    </div>
  )
}

function PopupJoinSecretChat() {
  const modal = useModal()
  const [code, setCode] = useState("")
  const navigate = useNavigate()
  function joinSecretChat() {
    modal.close()
    navigate("/chat/" + code)
  }
  return (
    <PopupLayout>
      <form>
        <h2>Join secret chat</h2>
        <Input onChange={inputValue(setCode)}>Type chat code</Input>
        <Button onClick={joinSecretChat}>See the hidden secret secrets</Button>
      </form>
    </PopupLayout>
  )
}

export default Topbar
