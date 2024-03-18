export function Count({ count }: { count: number }) {
  return (
    <>
      &nbsp;
      <span>
        {"("}
        {count}
        {")"}
      </span>
    </>
  )
}
