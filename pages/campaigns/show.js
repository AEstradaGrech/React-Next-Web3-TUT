import React, { Component } from 'react';
import { Card } from 'semantic-ui-react';
import web3 from '../../ethereum/web3.js'
import Campaign from '../../ethereum/campaign.js'
import Layout from '../../components/layout';

class CampaignShowComponent extends Component{

    static async getInitialProps(props) //<-- este props object NO es el mismo que se devuelve, es por haber hecho toda la movida de los routes
    {
        console.log(':: ATTEMPTING TO CREATE INSTANCE OF CAMPAIGN FOR ADDRESS --> ',props.query.address);
        const campaign = Campaign(props.query.address);

        const summary = await campaign.methods.getSummary().call();
        console.log(summary);
        return{
            managerAddress: summary.manager,
            title: summary.description, 
            minContribution: web3.utils.fromWei(summary.minContribution, 'ether'),
            totalContribution: web3.utils.fromWei(summary.balance, 'ether'),
            contributors: parseInt(summary.contributors) 
        }
    }

    renderCards(){
        const {
            managerAddress,
            title,
            minContribution,
            totalContribution,
            contributors
        } = this.props;

        const items = [
            {
                header: managerAddress,
                meta: 'Address of campaign creator',
                description: 'The wallet address that deployed the campaign',
                style: { overflowWrap: 'break-word'}
            },
            {
                header: title,
                meta: 'Campaign description',
                description: 'whatever the fuck the manager wants to pay with your money'
            },
            {
                header: minContribution,
                meta: 'Minimum contribution (ETH)',
                description: 'The minimum amount you have to pay to become an approver'
            },
            {
                header: totalContribution,
                meta: 'Total contribution (ETH)',
                description: 'The actual amount of ETH available for this campaign'
            },
            {
                header: contributors,
                meta: 'Total contributors',
                description: 'The actual number of contributors who have joined this campaign '
            }
        ]

        return <Card.Group items={items}/>
  
        
    }
    render(){
        return(
            <Layout>
                <h3>{this.props.title}</h3>
                {this.renderCards()} 
            </Layout>
        )
    }
}

export default CampaignShowComponent;