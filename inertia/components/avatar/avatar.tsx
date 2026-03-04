import { Avatar, AvatarFallback, AvatarImage } from '#components/ui/avatar'

interface AvatarProps {
  src?: string
  fallback?: string
}

function AvatarComponent({ src, fallback = 'U' }: AvatarProps) {
  return (
    <Avatar className="w-10 h-10">
      {src ? (
        <AvatarImage src={src} alt="Avatar" />
      ) : (
        <AvatarFallback className="bg-gray-700">
          {fallback}
        </AvatarFallback>
      )}
    </Avatar>
  )
}

export default AvatarComponent
