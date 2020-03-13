import React, { Component } from "react";
import { Card, CardContent, Typography } from "@material-ui/core";

export default class CompetitionComponent extends Component {

    constructor(props){
        super(props);
        this.state = {
            traders: []
        }
    }

    setData = async (contract) => {
        let currentCompetitionId = Number(await contract.methods.currentCompetition().call())
        let traders = await contract.methods.getTraders(currentCompetitionId).call()

        this.setState({
            traders: traders
        })
    }

    componentDidMount(){
        this.setData(this.props.contract)
    }

    getTraderList = () => {
        return this.state.traders.map(trader => {
            return (
                <Card key={trader}>
                    <CardContent>
                        <Typography>
                            { trader }
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
