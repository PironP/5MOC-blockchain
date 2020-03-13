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
            competitionToTraderToCurrencyToBalance[currentCompetition][traders[i]][virtualCurrency] = 1000;
        }
    }

    /// @notice Find the competition winner (the one who has the bigger balance) and return it.
    /// @return address (winner)
    function _getWinner(address[] memory traders, uint[] memory balances) internal pure returns (address) {
        if (0 == balances[0]) {
            return address(0);
        }

        uint maxBalance = balances[0];
        uint indexWinner = 0;

        for (uint i = 1; i < traders.length; i++) {
            if (balances[i] > maxBalance) {
                maxBalance = balances[i];
                indexWinner = i;
            }
        }

        return traders[indexWinner];
    }

    /// @notice Calculate the total balance of a trader in virtual coin.
    /// @return uint
    function _getTotalBalance(uint _competitionId, address _trader) internal view returns (uint) {
        return competitionToTraderToCurrencyToBalance[_competitionId][_trader][virtualCurrency] +
            _getVirtualCurrencyAmount(competitionToTraderToCurrencyToBalance[_competitionId][_trader][realCurrency]);
    }

    /// @notice Close current competition. Start the next competition straight after.
    function _closeCompetition() internal {
        address[] memory traders = competitionToTraders[currentCompetition];
        uint[] memory balances = new uint[](traders.length);


        for (uint i = 0; i < traders.length; i++) {
            balances[i] = _getTotalBalance(currentCompetition, traders[i]);
        }

        // address winner = _getWinner(traders, balances);
        // address(uint160(winner))
        // winner.transfer(address(uint160(address(this))).balance);
        // emit CloseCompetition(winner, traders, balances);

        _restartCompetition();
    }
}
