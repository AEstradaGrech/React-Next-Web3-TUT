import React, {Component} from 'react';
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
            contributors: summary.contributors
        }
    }

    render(){
        return(
            <Layout>
                <h3>{this.props.title}</h3>
            </Layout>
        )
    }
}

export default CampaignShowComponent;