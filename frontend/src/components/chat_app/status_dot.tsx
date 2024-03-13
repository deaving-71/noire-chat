type StatusDotProps = {
  status: boolean
}

export function StatusDot({ status }: StatusDotProps) {
  return (
    <span className="absolute bottom-0 right-1 block size-2 rounded-full bg-green-500"></span>
  )
}
