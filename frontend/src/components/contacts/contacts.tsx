import { Header, Section } from "../chat_app"
import { ContactList } from "./contact_list"

export function Contacts() {
  return (
    <Section>
      <Header className="sticky top-0 z-10 saturate-150 backdrop-blur-lg">
        <h1 className="text-lg font-bold lg:text-xl">Contacts</h1>
      </Header>

      <ContactList />
    </Section>
  )
}
