import React, { Component } from 'react';
import Layout from '../../../components/layout';
import Campaign from '../../../ethereum/campaign.js';

class RequestDetail extends Component{
    static async getInitialProps(props)
    {
        const contract = Campaign(props.query.address);
        const request = await contract.methods.requests(props.query.request).call();
        return { 
            address: props.query.address, 
            requestName: props.query.request,
            description: request.description
        }
    }
    render(){
        return(
            <Layout>
                <h3>{this.props.requestName}</h3>
                <h5>{this.props.description}</h5>
            </Layout>
        )
    }
}

export default RequestDetail;