export function Heading({ className, children }: any) {
  return (
    <h1 className={className}>
      <span className="block text-3xl font-bold">{children}</span>
    </h1>
  )
}
