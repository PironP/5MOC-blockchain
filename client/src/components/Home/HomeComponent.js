import React, { Component } from "react";

export default class HomeComponent extends Component {

    constructor(props){
        super(props);
        this.state = {
            price: ''
        }
    }

    setPrice = async (contract) => {
        console.log(contract);
        const price = await contract.methods.getPrice().call();
        this.setState({price: price})
    };

    componentDidMount(){
        this.setPrice(this.props.contract)
    }

    render(){
        return(
            <div>{this.state.price}</div>
        )
    }
}
