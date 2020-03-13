pragma solidity >=0.4.21 <0.7.0;

import "./CryptoTraderBase.sol";

/// @title InternalContract for CryptoTrader. Extends CryptoTraderBase. Defines internal functions.
/// @author Quentin Brunet, Pierre Piron, Léo Legron, Prescilla Lecurieux
/// @notice Student project, may contain bugs and security issues.
contract CryptoTraderInternal is CryptoTraderBase {
    /// @notice Restart competition after current one has been closed.
    function _restartCompetition() internal {
        startTimestamp = now;
        currentCompetition++;

        address[] memory traders = competitionToTraders[currentCompetition];

        for (uint i = 0; i < traders.length; i++) {
            competitionToTraderToCurrencyToBalance[currentCompetition][traders[i]][realCurrency] = 1000;
        }
    }

    /// @notice Find the competition winner (the one who has the bigger balance) and return it.
    /// @return address payable (winner)
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

    /// @notice Calculate the total balance of a trader in virtual coin.
    /// @return uint
    function _getTotalBalance(uint _competitionId, address _trader) internal view returns (uint) {
        return competitionToTraderToCurrencyToBalance[_competitionId][_trader][virtualCurrency] +
            _getVirtualCurrencyAmount(competitionToTraderToCurrencyToBalance[_competitionId][_trader][realCurrency]);
    }
}
