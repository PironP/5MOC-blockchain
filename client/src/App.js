import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import { Button } from "@material-ui/core";

import FakeTraderContract from "./contracts/CryptoTrader.json";
import getWeb3 from "./getWeb3";

import "./App.css";

import HomeComponent from './components/Home/HomeComponent'
import StatisticComponent from './components/Statistic/StatisticComponent'
import CompetitionComponent from './components/Competition/CompetitionComponent'

class App extends Component {
  state = { web3: null, accounts: null, contract: null };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = FakeTraderContract.networks[networkId];
      const instance = new web3.eth.Contract(
        FakeTraderContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  render() {
    if(this.state.web3 != null){
      return (
        <Router> {
          <div>
            <div className="navBar">
              <h3 className="appName">Crypto Trader</h3>
              <nav>
                <ul>
                  <Link to="/account" className="navButton">
                    <Button variant="contained" color="primary">
                      Home
                    </Button>
                  </Link>
                  <Link to="/statistic" className="navButton">
                    <Button variant="contained" color="primary">
                      Statistic
                    </Button>
                  </Link>
                  <Link to="/competition" className="navButton">
                    <Button variant="contained" color="primary">
                      Competition
                    </Button>
                  </Link>
                </ul>
              </nav>
            </div>
            <div className="App">
              <Switch>
                <Route path="/">
                  <h1 className="welcomeDiv">Welcome to Crypto Trader</h1>
                </Route>
                <Route path="/account">
                    <HomeComponent web3={this.state.web3} accounts={this.state.accounts} contract={this.state.contract} />
                </Route>
                <Route path="/statistic">
                  <StatisticComponent />
                </Route>
                <Route path="/competition">
                  <CompetitionComponent web3={this.state.web3} accounts={this.state.accounts} contract={this.state.contract} />
                </Route>
              </Switch>        
            </div>
          </div>
        }
        </Router>
      )
    } else {
      return(<div>Loading...</div>)
    }
  }
}

export default App;
