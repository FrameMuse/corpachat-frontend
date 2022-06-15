import "./PopupLayout.scss"

import Icon from "app/ui/Icon/Icon"
import { useModal } from "modules/modal/hook"
import { ReactNode } from "react"
import { classWithModifiers } from "utils/common"

interface PopupLayoutProps {
  width?: string
  centered?: boolean
  pushLeft?: boolean
  pushRight?: boolean
  children: ReactNode
}

function PopupLayout(props: PopupLayoutProps) {
  const { close } = useModal()

  const modifiers: string[] = []
  if (props.centered) modifiers.push("centered")
  if (props.pushLeft) modifiers.push("push-left")
  if (props.pushRight) modifiers.push("push-right")
  return (
    <div className="popup-layout" style={{ "--popup-width": props.width }}>
      <div className="popup-layout__container">
        <button className="popup-layout__close" type="button" onClick={close}>
          <Icon name="cross" />
        </button>
        <div className={classWithModifiers("popup-layout__inner", ...modifiers)}>{props.children}</div>
      </div>
    </div>
  )
}

export default PopupLayout
