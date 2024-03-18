import { Icons } from "../icons"

export function LoadingSpinner() {
  return (
    <span className="animate-spin">
      <Icons.load size={24} />
    </span>
  )
}
