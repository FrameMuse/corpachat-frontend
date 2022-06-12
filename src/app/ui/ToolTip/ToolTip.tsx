import "./ToolTip.scss"

import { ReactNode } from "react"

interface ToolTipProps {
  children: ReactNode
}

function ToolTip(props: ToolTipProps) {
  return (
    <div className="tool-tip" role="tooltip">
      <div className="tool-tip__container">
        <div className="tool-tip__inner">{props.children}</div>
      </div>
    </div>
  )
}

export default ToolTip
