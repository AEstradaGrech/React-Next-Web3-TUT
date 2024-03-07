import React, { Component } from 'react';
import { Card, Grid, Button } from 'semantic-ui-react';
import web3 from '../../ethereum/web3.js';
import Campaign from '../../ethereum/campaign.js';
import Layout from '../../components/layout';
import ContributeForm from '../../components/contributeForm.js';
import AddFundsForm from '../../components/addFundsForm.js';
import { Link } from '../../routes.js';

class CampaignShow extends Component{

    static async getInitialProps(props) //<-- este props object NO es el mismo que se devuelve, es por haber hecho toda la movida de los routes
    {
        const campaign = Campaign(props.query.address);

        const summary = await campaign.methods.getSummary().call();
       
        const accounts = await web3.eth.getAccounts();
        return{
            address: props.query.address,
            managerAddress: summary.manager,
            connectedAccount: accounts[0],
            title: summary.name,
            description: summary.description, 
            minContribution: web3.utils.fromWei(summary.minContribution, 'ether'),
            totalContribution: web3.utils.fromWei(summary.balance, 'ether'),
            contributors: parseInt(summary.contributors),
            requests: parseInt(summary.totalRequests)
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
            contributors,
            requests
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
                meta: 'Total funds (ETH)',
                description: 'The actual amount of ETH available for this campaign'
            },
            {
                header: contributors,
                meta: 'Total contributors',
                description: 'The actual number of contributors who have joined this campaign '
            },
            {
                header: requests,
                meta: 'Total Requests',
                description: 'The actual number of funds transfer requests for this campaign '
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
                        <Link route={`/campaigns/${this.props.address}/requests`}>
                            <Button
                                style={{marginLeft:'75px', marginTop: '10px'}}
                                content="View Requests"
                                primary/>
                        </Link>
                            
                    </Grid.Column>
                    <Grid.Column width={6}>
                        { this.props.connectedAccount === this.props.managerAddress ? 
                            <AddFundsForm address={this.props.address} /> :
                            <ContributeForm address={this.props.address} minContribution={this.props.minContribution}/>
                        }
                    </Grid.Column>
                </Grid>
            </Layout>
        )
    }
}

export default CampaignShow;