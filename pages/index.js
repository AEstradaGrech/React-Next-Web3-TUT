import React, { Component } from 'react';
import { Card } from 'semantic-ui-react';
import factory from '../ethereum/factory.js'
import Layout from '../components/layout.js';
import { Button } from 'semantic-ui-react';

class CampaignIndex extends Component{

    //next js initialization lifecycle hook
    // adds any required data to nextJs's 'props' object
    static async getInitialProps() {
        let campaigns = await factory.methods.getDeployedCampaigns().call();
        console.log(campaigns);
        let manager = await factory.methods.getCreatorAddress().call();

        console.log(' :: CAMPAIGN MANAGER ADDRESS :: ', manager);

        return { campaigns };
    }

    // async componentDidMount(){
    //     console.log(':: INDEX DID MOUNT');

    //     let campaigns = await factory.methods.getDeployedCampaigns().call();
    //     console.log(campaigns);
    //     let manager = await factory.methods.getCreatorAddress().call();

    //     console.log(' :: CAMPAIGN MANAGER ADDRESS :: ', manager);
    // }

    renderCampaigns()
    {
        const items = this.props.campaigns.map(address => {
            return {
                header: <a>Campain Name</a>,
                description: address,
                fluid:true
            };
        });

        return <Card.Group items={items}></Card.Group>
    }
    render() {
        return <Layout>
            <div> 
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.5.0/semantic.min.css" integrity="sha512-KXol4x3sVoO+8ZsWPFI/r5KBVB/ssCGB5tsv2nVOKwLg33wTFP3fmnXa47FdSVIshVTgsYk/1734xSk9aFIa4A==" crossorigin="anonymous" referrerpolicy="no-referrer" />
                <hr />
                {this.renderCampaigns()}
                <Button 
                    content="Create Campaign"
                    icon="add circle"
                    primary
                />
            </div> 
        </Layout> 
    }
}

export default CampaignIndex;