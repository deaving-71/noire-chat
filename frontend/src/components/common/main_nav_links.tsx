import { useGetNotificationsQuery } from "@/hooks/notifications"

import { Icons } from "../icons"
import { NavLinkItem } from "./NavLinkItem"
import { NotificationCount } from "./notification_count"

type MainNavLinksProps = {}

export function MainNavLinks({}: MainNavLinksProps) {
  const { data: notifications } = useGetNotificationsQuery()

  return (
    <ul className="space-y-1">
      <li>
        <NavLinkItem href="/app" className="justify-between">
          <span className="flex items-center gap-2">
            <Icons.inbox size={16} />
            Inbox
          </span>
          <NotificationCount count={notifications.privateChats.length} />
        </NavLinkItem>
      </li>
      <li>
        <NavLinkItem href="/app/contacts" className="justify-between">
          <span className="flex items-center gap-2">
            <Icons.people size={16} />
            Contacts
          </span>
          <NotificationCount count={notifications.friendRequestsCount} />
        </NavLinkItem>
      </li>
    </ul>
  )
}
