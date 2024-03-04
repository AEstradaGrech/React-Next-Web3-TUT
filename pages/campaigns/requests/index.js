import React, { Component } from 'react';
import { Card } from 'semantic-ui-react'
import Campaign from '../../../ethereum/campaign.js'
import Layout from '../../../components/layout.js';
class RequestsIndex extends Component {

    static async getInitialProps(props)
    {
        const campaign = Campaign(props.query.address);

        const summary = await campaign.methods.getSummary().call();

        console.log('CAMPAIGN SUMMARY:',summary);
        return { address: props.query.address }
    }

    renderCards(){
        const items = [
            {
                header:'Request 1',
                description: 'ReqDesc',
                fluid: true
            },
            {
                header: 'Request 2',
                description: 'Req2Desc',
                fluid:true
            }
        ]

        return <Card.Group items={items}/>
    }
    render(){
        return(
            <Layout>
                <h3>Active Requests</h3>
                {this.renderCards()}
            </Layout>
            
        )
    }
}

export default RequestsIndex;