import React, { Component } from 'react';
import { Card, Grid } from 'semantic-ui-react';
import web3 from '../../ethereum/web3.js'
import Campaign from '../../ethereum/campaign.js'
import Layout from '../../components/layout';
import ContributeForm from '../../components/contributeForm.js'

class CampaignShowComponent extends Component{

    static async getInitialProps(props) //<-- este props object NO es el mismo que se devuelve, es por haber hecho toda la movida de los routes
    {
        console.log(':: ATTEMPTING TO CREATE INSTANCE OF CAMPAIGN FOR ADDRESS --> ',props.query.address);
        const campaign = Campaign(props.query.address);

        const summary = await campaign.methods.getSummary().call();
        console.log(summary);
        return{
            address: props.query.address,
            managerAddress: summary.manager,
            title: summary.name,
            description: summary.description, 
            minContribution: web3.utils.fromWei(summary.minContribution, 'ether'),
            totalContribution: web3.utils.fromWei(summary.balance, 'ether'),
            contributors: parseInt(summary.contributors) 
        }
    }

    renderHeaderCard()
    {
        const items = [
            {
                header:this.props.title,
                description: this.props.description,
                fluid:true
            }
        ]

        return <Card.Group items={items}/>
    }
    renderCards(){
        const {
            managerAddress,
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
                {this.renderHeaderCard()}
                <Grid>
                    <Grid.Column width={10}>
                        {this.renderCards()} 
                    </Grid.Column>
                    <Grid.Column width={6}>
                        <ContributeForm/>
                    </Grid.Column>
                </Grid>
            </Layout>
        )
    }
}

export default CampaignShowComponent;