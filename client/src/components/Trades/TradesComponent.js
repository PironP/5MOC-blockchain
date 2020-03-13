import React, { Component } from "react";


export default class TradesComponent extends Component {

    constructor(props){
        super(props);
        this.state = {
            currentCompetition: ''
        }
    }

    setData = async (contract) => {
        const currentCompetition = await contract.methods.currentCompetition().call()
        const currentTraders = await contract.methods.getParticipants().call()
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