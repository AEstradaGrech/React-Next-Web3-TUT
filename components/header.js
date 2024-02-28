import React from 'react';
import { Menu, Button } from 'semantic-ui-react'
import { Link } from '../routes'

const Header = () => {
    return ( 
        <Menu style={{marginTop: '10px'}}>
            <Menu.Item>
                <h5>Tolicoins, a sure SCAM</h5>
            </Menu.Item>
            <Menu.Menu position="right">
                <Menu.Item>
                <Link route='/'>
                    Campaigns
                </Link>
                </Menu.Item>
                <Menu.Item>
                    <Link route='/campaigns/new'>
                        <Button 
                            icon="add circle"
                            secondary
                            style={{
                                background: 'white',
                                color: 'black'
                            }}
                        />
                    </Link>
                </Menu.Item>
            </Menu.Menu>
        </Menu>
    )
}

export default Header;