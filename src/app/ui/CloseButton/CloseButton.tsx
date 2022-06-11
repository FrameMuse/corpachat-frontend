import "./CloseButton.scss"

import { classWithModifiers } from "utils/common"

import Icon from "../Icon/Icon"

interface CloseButtonProps {
  size?: "small"
  onClick?(): void
}

function CloseButton(props: CloseButtonProps) {
  return (
    <button className={classWithModifiers("close-button", props.size)} type="button" onClick={props.onClick}>
      <Icon className="close-button__icon" name="plus" />
    </button>
  )
}

export default CloseButton
