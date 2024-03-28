import {
  Check,
  Command,
  Github,
  Hash,
  Inbox,
  Loader2,
  LogOut,
  MessageSquare,
  Moon,
  Plus,
  Send,
  Settings,
  SunMedium,
  UsersRound,
  X,
} from "lucide-react"

export type IconKeys = keyof typeof icons

type IconsType = {
  [key in IconKeys]: React.ElementType
}

const icons = {
  logo: Command,
  sun: SunMedium,
  moon: Moon,
  people: UsersRound,
  inbox: Inbox,
  hashtag: Hash,
  send: Send,
  message: MessageSquare,
  tripleDot: TripleDot,
  xmark: X,
  checkmark: Check,
  load: Loader2,
  plus: Plus,
  github: Github,
  settings: Settings,
  logout: LogOut,
}

function TripleDot() {
  return (
    <div className="flex items-center gap-0.5">
      <span>&#x2022;</span>
      <span>&#x2022;</span>
      <span>&#x2022;</span>
    </div>
  )
}

export const Icons: IconsType = icons
