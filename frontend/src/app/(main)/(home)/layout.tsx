import { Header } from "@/components/common"

type LayoutProps = React.PropsWithChildren
export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <Header />
      {children}
    </>
  )
}
