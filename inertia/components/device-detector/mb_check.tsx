import React from 'react'

/**
 * The interface is responsive and can be used on desktop, tablet and mobile.
 * Keep this wrapper as a compatibility boundary for existing layouts.
 */
export default function DeviceDetector({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
