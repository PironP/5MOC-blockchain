pragma solidity >=0.4.21 <0.7.0;

import "./CryptoTraderBase.sol";

contract CryptoTraderInternal is CryptoTraderBase {
    function _restartCompetition() internal {
        startTimestamp = now;
        currentCompetition++;

        address[] memory traders = competitionToTraders[currentCompetition];

        for (uint i = 0; i < traders.length; i++) {
            competitionToTraderToCurrencyToBalance[currentCompetition][traders[i]][realCurrency] = 1000;
        }
    }

    function _getWinner(address[] memory traders, uint[] memory balances) internal pure returns (address payable) {
        uint maxBalance = balances[0];
        uint indexWinner = 0;

        for (uint i = 1; i < traders.length; i++) {
            if (balances[i] > maxBalance) {
                maxBalance = balances[i];
                indexWinner = i;
            }
        }

        address winner = traders[indexWinner];
        // cast to address payable
        return address(uint160(winner));
    }

    function _getTotalBalance(uint _competitionId, address _trader) internal view returns (uint) {
        return competitionToTraderToCurrencyToBalance[_competitionId][_trader][virtualCurrency] +
            competitionToTraderToCurrencyToBalance[_competitionId][_trader][realCurrency] /
            getPrice();
    }
}
