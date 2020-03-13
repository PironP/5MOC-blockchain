import React, { Component } from "react";
import { Card, CardContent, Typography, Input, Button } from "@material-ui/core";

export default class CompetitionComponent extends Component {

    constructor(props){
        super(props);
        this.state = {
            etherPrice: '',
            buyPrice: 0,
            sellPrice: 0,
            balanceVirtual: '',
            balanceEth: ''
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeSell = this.handleChangeSell.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    setData = async (contract) => {
        let currentCompetitionId = Number(await contract.methods.currentCompetition().call())

        let etherPrice = Number(await contract.methods.getPrice().call())/10**18

        let balances = await contract.methods.getBalances(currentCompetitionId, this.props.accounts[0]).call()

        this.setState({
            etherPrice: etherPrice,
            balanceVirtual: balances[0],
            balanceEth: balances[1]
        })
    }

    componentDidMount(){
        this.setData(this.props.contract)
    }

    handleChange(event) {
        this.setState({buyPrice: event.target.value});
    }

    handleChangeSell(event) {
        this.setState({sellPrice: event.target.value});
    }

    handleSubmit(event) {}

    buy = () => {
        this.props.contract.methods.trade(true, this.props.web3.utils.toWei(this.state.buyPrice)).send({from: this.props.accounts[0]})
        .then(res => {
            this.setData(this.props.contract)
        })
        .catch(console.error)
    }

    sell = () => {
        this.props.contract.methods.trade(false, this.props.web3.utils.toWei(this.state.sellPrice)).send({from: this.props.accounts[0]})
        .then(res => {
            this.setData(this.props.contract)
        })
        .catch(console.error)
    }

    render(){
        return(
         <div>
             <div>
                 My Balance (Ether) : {this.state.balanceEth/10**18} ETH
                 <br/>
                 My Balance (Virtual) : {this.state.balanceVirtual} VT
             </div>
             <div style={{marginLeft: '200px', marginTop: '20px'}}>
                <p>Ether price : {this.state.etherPrice} $</p>
                <form onSubmit={this.handleSubmit}>
                    <label>
                        Nombre d'Ether à acheter :
                    </label>
                    <br/>
                    <Input type="number" value={this.state.buyPrice} onChange={this.handleChange}/>ETH => {this.state.buyPrice*this.state.etherPrice} $

                </form>
                <Button variant="contained" color="primary" onClick={() => {this.buy()}}>Acheter</Button>
                <hr />
                <form>
                    <label>
                        Nombre d'Ether à vendre :
                    </label>
                    <br/>
                    <Input type="number" value={this.state.sellPrice} onChange={this.handleChangeSell}/>ETH => {this.state.sellPrice*this.state.etherPrice} $

                </form>
                <Button variant="contained" color="primary" onClick={() => {this.sell()}}>Vendre</Button>
             </div>
         </div>
        )
    }

}
