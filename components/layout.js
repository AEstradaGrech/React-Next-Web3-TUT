import React from 'react'
import Head from 'next/head'
import Header from './header'
import { Container } from 'semantic-ui-react'
const Layout = (props) => {
    return <Container>
        <Head>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.5.0/semantic.min.css" integrity="sha512-KXol4x3sVoO+8ZsWPFI/r5KBVB/ssCGB5tsv2nVOKwLg33wTFP3fmnXa47FdSVIshVTgsYk/1734xSk9aFIa4A==" crossorigin="anonymous" referrerpolicy="no-referrer" />
        </Head>
        <Header />
        { props.children }
        {/* <h1> App Footer </h1> */}
    </Container>
}

export default Layout;