import React from 'react'
import Header from './header'

const Layout = (props) => {
    return <div>
        <Header />
        { props.children }
        {/* <h1> App Footer </h1> */}
    </div>
}

export default Layout;