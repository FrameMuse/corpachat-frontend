import "./Header.scss"

import { ReactNode } from "react"

interface HeaderProps {
  children?: ReactNode
}

function Header(props: HeaderProps) {
  return (
    <header className="header">{props.children}</header>
  )
}

export default Header
