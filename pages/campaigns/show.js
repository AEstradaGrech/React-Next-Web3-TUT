import React, { Component } from 'react';
import { Card, Grid, Button, Form, Message } from 'semantic-ui-react';
import web3 from '../../ethereum/web3.js';
import Campaign from '../../ethereum/campaign.js';
import Layout from '../../components/layout';
import ContributeForm from '../../components/contributeForm.js';
import AddFundsForm from '../../components/addFundsForm.js';
import { Link, Router } from '../../routes.js';

class CampaignShow extends Component{

    state = {
        loadingClaimFunds: false,
        claimErrorMessage: '',
        claimSuccessMessage: ''
    }
    static async getInitialProps(props) //<-- este props object NO es el mismo que se devuelve, es por haber hecho toda la movida de los routes
    {
        const campaign = Campaign(props.query.address);

        const summary = await campaign.methods.getSummary().call();
        console.log(summary);
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
            requests: parseInt(summary.totalRequests),
            isCancelled: summary.isCancelled,
            cancelReason: 'The manager has cancelled the campaign for some reason (TODO: deploy updated contract)'
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
    renderCancelledCard(){
        const items = [
            {
                header:'Cancelled!',
                meta: 'This campaign has been cancelled and the contributors can claim their funds',
                description: `Reason:\n${this.props.cancelReason}`,
                fluid: true,
                color:'red'
            }
        ]

        return <Card.Group items={items} style={{fontWeight: 600}}/>
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

    onClaimFunds = async () => {
        if(this.props.managerAddress === this.props.connectedAccount) return;

        this.setState({loadingClaimFunds: true, claimErrorMessage: ''});
        let bShouldRefresh = false;
        try{
            const campaign = Campaign(this.props.address);
            await campaign.methods.claimFunds(this.props.title).send({from: this.props.connectedAccount});
            this.setState({loadingClaimFunds: false, claimSuccessMessage: 'Get your dirty money, you prick'})
            bShouldRefresh = true;
        }catch(error){
            this.setState({loadingClaimFunds: false, claimErrorMessage: error.message});
        }

        setTimeout(() => {
            this.setState({claimErrorMessage: '', claimSuccessMessage: ''});
            if(bShouldRefresh){
                Router.replaceRoute(`/campaigns/${this.props.address}`);
            }
        }, 5000);
    }

    render(){
        return(
            <Layout>
                {this.renderHeaderCard()}
                {this.props.isCancelled ? this.renderCancelledCard() : null}
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
                            <AddFundsForm address={this.props.address} isCancelled={this.props.isCancelled} /> :
                            this.props.isCancelled ? 
                            (
                                <Form error={!!this.state.claimErrorMessage} success={!!this.state.claimSuccessMessage}>
                                    <Button basic color='red' floated='right' onClick={this.onClaimFunds} loading={this.state.loadingClaimFunds}>Claim Funds</Button>
                                    <Message error header='Oops!' content={this.state.claimErrorMessage}/>
                                    <Message success header='OK!' content={this.state.claimSuccessMessage}/>
                                </Form>
                            ) :
                            <ContributeForm address={this.props.address} isCancelled={this.props.isCancelled} minContribution={this.props.minContribution}/>
                        }
                    </Grid.Column>
                </Grid>
            </Layout>
        )
    }
}

export default CampaignShow;