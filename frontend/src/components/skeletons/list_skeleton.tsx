import { Header, Section } from "../chat_app"
import { Skeleton } from "../ui/skeleton"
import { UserSekeleton } from "./user_skeleton"

export function ListSkeleton() {
  return (
    <Section>
      <Header>
        <Skeleton className="h-4 w-[120px]" />
      </Header>
      <div className="space-y-4 p-6">
        <UserSekeleton size="lg" />
        <UserSekeleton />
        <UserSekeleton size="lg" />
        <UserSekeleton />
      </div>
    </Section>
  )
}
