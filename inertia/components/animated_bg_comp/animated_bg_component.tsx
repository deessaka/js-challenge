import React from 'react'
import { cn } from '~/lib/utils'

interface AnimatedBackgroundProps {
  children: React.ReactNode
  videoSrc?: string
  className?: string
}

const AnimatedBackground = ({ children, videoSrc, className }: AnimatedBackgroundProps) => {
  return (
    <div className={cn('relative w-full h-full overflow-hidden', className)}>
      {videoSrc ? (
        <video
          autoPlay
          loop
          muted
          className="absolute top-0 left-0 min-w-full min-h-full object-cover z-0"
        >
          <source src={videoSrc} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ) : (
        <div className="absolute top-0 left-0 w-full h-full animate-gradient-x" />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  )
}

export default AnimatedBackground
