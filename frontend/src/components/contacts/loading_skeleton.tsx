import { ListSkeleton, UserListSkeleton } from "../skeletons"

export function LoadingSkeleton() {
  return (
    <>
      <UserListSkeleton />
      <ListSkeleton />
    </>
  )
}
