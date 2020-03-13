import React, { Component } from "react";
import { Card, CardContent, Typography } from "@material-ui/core";
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { green } from "@material-ui/core/colors";

const useStyles = makeStyles(theme => ({
    participate:{
        color: green
    }
}));

// const classes = useStyles();
// const theme = useTheme();


export default class HomeComponent extends Component {

    constructor(props){
        super(props);
        this.state = {
            n0Competition: '',
            n0CompetitionTraders: '',
        }
    }

    setData = async (contract) => {
        const n0Competition = await contract.methods.currentCompetition().call()
        const n0CompetitionTraders = await contract.methods.getTraders(n0Competition).call()
        console.log(n0Competition)
        console.log(n0CompetitionTraders)
        this.setState({
            n0Competition: n0Competition,
            n0CompetitionTraders: n0CompetitionTraders
        })
    }

    componentDidMount(){
        this.setData(this.props.contract)
    }

    render(){
        return(
            <div>
                <Card className={useStyles.participate}>
                    <CardContent>
                        <Typography>
                            Current competition
                        </Typography>
                    </CardContent>
                </Card>
                <Card >
                    <CardContent>
                        <Typography>
                            S+1 competition
                        </Typography>
                    </CardContent>
                </Card>
            </div>
        )
    }
}
