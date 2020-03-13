import React, { Component } from "react";
import { Card, CardContent, Typography } from "@material-ui/core";

export default class CompetitionComponent extends Component {

    constructor(props){
        super(props);
        this.state = {
            traders: [],
            traderBalances: {},
        };
    }

    setData = async (contract) => {
        let currentCompetitionId = Number(await contract.methods.currentCompetition().call())
        let traders = await contract.methods.getTraders(currentCompetitionId).call()

        traders.forEach(trader => {
            this.getBalance(trader);
        });

        this.setState({
            traders: traders
        });
    }

    getBalance = async (trader) => {
        const { contract } = this.props;

        let currentCompetitionId = Number(await contract.methods.currentCompetition().call())
        let balances = await contract.methods.getBalances(currentCompetitionId, trader).call();

        this.setState({
            traderBalances: {
                ...this.state.traderBalances,
                [trader]: `${balances[1]/Math.pow(10,18)} ETH / ${balances[0]} VT`,
            },
        });
    }

    componentDidMount(){
        this.setData(this.props.contract)
    }

    getTraderList = () => {
        const { traders, traderBalances } = this.state;

        return traders.map(trader => {
            return (
                <Card key={trader}>
                    <CardContent>
                        <Typography>
                            { trader } || { traderBalances[trader] ? traderBalances[trader] : '-' }
                        </Typography>
                    </CardContent>
                </Card>
            )
        })
    }

    render(){
        return(
         <div>{ this.getTraderList() }</div>
        )
    }
}
