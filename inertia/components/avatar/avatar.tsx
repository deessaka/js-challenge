import { Avatar, AvatarFallback, AvatarImage } from '#components/ui/components/ui/avatar'

interface AvatarProps {
  src: string
}
function AvatarComponent({ src }: AvatarProps) {
  return (
    <Avatar className="w-10 h-10">
      <AvatarImage src={src} />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  )
}

export default AvatarComponent
