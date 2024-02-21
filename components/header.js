import React from 'react';
import { Menu, Button } from 'semantic-ui-react'

const Header = () => {
    return ( 
        <Menu style={{marginTop: '10px'}}>
            <Menu.Item>
                Tolicoins
            </Menu.Item>
            <Menu.Menu position="right">
                <Menu.Item>
                    Campaigns
                </Menu.Item>
                <Menu.Item>
                    <Button 
                        icon="add circle"
                        secondary
                    />
                </Menu.Item>
            </Menu.Menu>
        </Menu>
    )
}

export default Header;