import React, { Component } from "react";
import { Card, CardContent, Typography, Button } from "@material-ui/core";

export default class HomeComponent extends Component {

    constructor(props){
        super(props);
        this.state = {
            competitionToTraders: [],
            currentCompetitionId: ''
        }
    }

    setData = async (contract) => {
        let competitions = [];

        let currentCompetitionId = Number(await contract.methods.currentCompetition().call())

        competitions.push(currentCompetitionId)
        competitions.push(currentCompetitionId+1)
        competitions.push(currentCompetitionId+2)
        competitions.push(currentCompetitionId+3)

        const promises = competitions.map(async competitionId => {
            return {
                competitionId: competitionId,
                traders: await contract.methods.getTraders(competitionId).call()
            }
        })

        const competitionToTraders = await Promise.all(promises)

        this.setState({
            competitionToTraders: competitionToTraders,
            currentCompetitionId: currentCompetitionId
        })
    }

    componentDidMount(){
        console.log(this.props.contract.methods)
        this.setData(this.props.contract)
    }

    joinCompetition = async (id) => {
        this.props.contract.methods.joinCompetition(id).send({from: this.props.accounts[0], value: this.props.web3.utils.toWei('0.001')})
        .then(res => {
            this.setData(this.props.contract)
        })
        .catch(console.error)
    }

    leaveCompetition = async (id) => {
        this.props.contract.methods.leaveCompetition(id).send({from: this.props.accounts[0]})
        .then(res => {
            this.setData(this.props.contract)
        })
        .catch(console.error)
    }

    getCard = () => {
        let cards = []

        this.state.competitionToTraders.forEach(item => {
            const participate = item.traders.includes(this.props.accounts[0])
            const canParticipate = item.competitionId !== this.state.currentCompetitionId
            cards.push(
                <Card style={ item.traders.includes(this.props.accounts[0]) ? { backgroundColor:'green', marginTop: '15px'} : {backgroundColor:'red', marginTop: '15px'}} 
                    key={item.competitionId}>
                    <CardContent>
                        <Typography>
                            Competition {item.competitionId}
                        </Typography>
                        <Button disabled={participate || !canParticipate} onClick={() => {this.joinCompetition(item.competitionId)}}>Join</Button>
                        <Button disabled={!participate} onClick={() => {this.leaveCompetition(item.competitionId)}}>Leave</Button>
                    </CardContent>
                </Card>
            )
        })

        return cards
    }

    render(){
        return(
            <div style={{paddingTop: '100px'}}>
               { this.getCard() }
            </div>
        )
    }
}
