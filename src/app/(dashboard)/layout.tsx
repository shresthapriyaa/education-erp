
import SideBar from '@/core/components/app-sidebar'
import React from 'react'

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <SideBar>{children}</SideBar>
    </div>
  )
}

export default layout





