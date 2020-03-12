pragma solidity >=0.4.21 <0.7.0;

import "./CryptoTraderInternal.sol";

contract CryptoTrader is CryptoTraderInternal {
    function joinCompetition(
        uint _competitionId
    ) external payable isFutureCompetition(_competitionId) isNotParticipant(msg.sender, _competitionId) {
        require(participationFee == msg.value, "Please send the required participation fee.");
        competitionToTraders[_competitionId].push(msg.sender);
    }

    function leaveCompetition(
        uint _competitionId
    ) external payable isFutureCompetition(_competitionId) isParticipant(msg.sender, _competitionId) {
        uint index = _findIndexOf(competitionToTraders[_competitionId], msg.sender);
        _removeAtIndex(competitionToTraders[_competitionId], index);
        msg.sender.transfer(participationFee);
    }

    function trade(
        bool _buy,
        uint _amount
    ) external isParticipant(msg.sender, currentCompetition) hasSufficientBalance(_buy, msg.sender, _amount) {
        uint virtualCurrencyAmount = getPrice() * _amount;

        if (_buy) {
            competitionToTraderToCurrencyToBalance[currentCompetition][msg.sender][virtualCurrency] -= virtualCurrencyAmount;
            competitionToTraderToCurrencyToBalance[currentCompetition][msg.sender][realCurrency] += _amount;
        } else {
            competitionToTraderToCurrencyToBalance[currentCompetition][msg.sender][virtualCurrency] += virtualCurrencyAmount;
            competitionToTraderToCurrencyToBalance[currentCompetition][msg.sender][realCurrency] -= _amount;
        }
    }

    function isCompetitionClosable() external view isClosable returns(bool) {
        return true;
    }

    function closeCompetition() external isClosable  {
        address[] memory traders = competitionToTraders[currentCompetition];
        uint[] memory balances = new uint[](traders.length);


        for (uint i = 0; i < traders.length; i++) {
            balances[i] = _getTotalBalance(currentCompetition, traders[i]);
        }

        address payable winner = _getWinner(traders, balances);

        winner.transfer(address(this).balance);

        emit CloseCompetition(winner, traders, balances);

        _restartCompetition();
    }
}
