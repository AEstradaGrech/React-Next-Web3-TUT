import React from 'react';
import { Menu, Button } from 'semantic-ui-react'

const Header = () => {
    return ( 
        <Menu>
            <Menu.Item>
                Tolicoins
            </Menu.Item>
            <Menu.Menu position="right">
                <Menu.Item>
                    <Button 
                        content="Campaigns"
                        primary
                    />
                </Menu.Item>
                <Menu.Item>
                    <Button 
                        content="+"
                        secondary
                    />
                </Menu.Item>
            </Menu.Menu>
        </Menu>
    )
}

export default Header;