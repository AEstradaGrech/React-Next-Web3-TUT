import React, { Component } from 'react';
import { Card } from 'semantic-ui-react'
import Campaign from '../../../ethereum/campaign.js'
import Layout from '../../../components/layout.js';
import { Link } from '../../../routes.js'
class RequestsIndex extends Component {

    static async getInitialProps(props)
    {
        const campaign = Campaign(props.query.address);
        const reqs = await campaign.methods.getRequests().call();
        console.log('REQS:',reqs);
        return { 
            address: props.query.address,
            requests: reqs ?? []
        }
    }

    renderCards(){
        const items = this.props.requests.map(req => {
            return {
                header: req.name,
                meta: req.description,
                description: <Link route={`/campaigns/${this.props.address}/requests/${req.name}`}>View Details</Link>,
                fluid: true
            }
        });

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