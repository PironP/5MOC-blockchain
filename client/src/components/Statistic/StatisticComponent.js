import React, { Component } from "react";


export default class StatisticComponent extends Component {

    constructor(props){
        super(props);
        this.state = {
            currentCompetition: ''
        }
    }

    setData = async (contract) => {
        console.log(contract)
        const currentCompetition = await contract.methods.currentCompetition().call()
        const currentTraders = await contract.methods.competitionToTraders(currentCompetition).call()
        console.log(currentCompetition)
        console.log(currentTraders)
        this.setState({currentCompetition: currentCompetition})
    }

    componentDidMount(){
        this.setData(this.props.contract)
    }

    render(){
        return(
            <div></div>
        )
    }

}