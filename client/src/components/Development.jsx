import React from 'react'
import HeaderDynamic from './HeaderDynamic'
import SidebarNav from './SidebarNav'

const Development = ({ setAuth }) => {






  return (
    <div>
        <HeaderDynamic pushAuth={boolean => setAuth(boolean)} />
        <SidebarNav />
        <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">






        </main>
    </div>
  )
}

export default Development