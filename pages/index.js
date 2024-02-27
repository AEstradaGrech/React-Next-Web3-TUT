import React, { Component } from 'react';
import { Card } from 'semantic-ui-react';
import factory from '../ethereum/factory.js'
import Layout from '../components/layout.js';
import { Button } from 'semantic-ui-react';
import { Link } from '../routes.js';

class CampaignIndex extends Component{

    //next js initialization lifecycle hook
    // adds any required data to nextJs's 'props' object
    static async getInitialProps() {
        let campaigns = await factory.methods.getCampaigns().call();
        
        let factoryManager = await factory.methods.getCreatorAddress().call();
        return { campaigns, factoryManager };
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
        const items = this.props.campaigns.map(data => {
            return {
                header: (
                    <Link route={`/campaigns/${data.campaignAddress}`}>
                        {data.name}
                    </Link>
                ),
                description: data.campaignAddress,
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
                <Link route='/campaigns/new'>
                    <Button 
                        floated='right'
                        content="Create Campaign"
                        icon="add circle"
                        primary
                    />
                </Link>
                {this.renderCampaigns()}
            </Layout>
        ) 
    }
}

export default CampaignIndex;