import React from 'react'

export const PanelContent = ({ children }: { children: React.ReactNode }) => (
  <div className="flex h-[calc(100vh-100px)] p-6">{children}</div>
)
