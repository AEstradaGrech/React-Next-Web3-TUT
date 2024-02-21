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

        return <Card.Group items={items}> 
           
        </Card.Group>
    }
    render() {
        return (
            <Layout>
                <h3> Open Campaigns </h3>
                <Button 
                    floated='right'
                    content="Create Campaign"
                    icon="add circle"
                    primary
                />
                {this.renderCampaigns()}
            </Layout>
        ) 
    }
}

export default CampaignIndex;