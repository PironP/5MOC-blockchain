pragma solidity >=0.4.21 <0.7.0;

import "./Ownable/Ownable.sol";
import "./Helper/ArrayHelper.sol";
import "./Helper/RandomHelper.sol";

/// @title BaseContract for CryptoTrader. Defines mappings, variables, events and modifiers.
/// @author Quentin Brunet, Pierre Piron, Léo Legron, Prescilla Lecurieux
/// @notice Student project, may contain bugs and security issues.
contract CryptoTraderBase is Ownable, ArrayHelper, RandomHelper {
    mapping (uint => mapping (address => mapping (string => uint))) competitionToTraderToCurrencyToBalance;
    mapping (uint => address[]) competitionToTraders;

    string virtualCurrency = "TraderCoin";
    string realCurrency = "Ethereum";
    uint currentCompetition = 1;
    uint startTimestamp = now;
    uint competitionDuration = 7 days;
    uint participationFee = 0.001 ether;

    event CloseCompetition(address winner, address[] traders, uint[] balances);

    /// @notice Allow anyone to get real currency current price in Ether.
    /// @return uint
    /// @dev TODO: implement price feeder method
    function getPrice() public view returns (uint) {
        return _random();
    }

    /// @notice Check if trader participate to given competition.
    /// @param _trader (trader address)
    /// @param _competitionId (given competition)
    /// @return bool (true if the trader is in the competition)
    function _participate(address _trader, uint _competitionId) private view returns (bool) {
        address[] memory traders = competitionToTraders[_competitionId];
        bool participant = false;

        for (uint i = 0; i < traders.length; i++) {
            if (traders[i] == _trader) {
                participant = true;
                break;
            }
        }

        return participant;
    }

    modifier isClosable() {
        require(now >= startTimestamp + competitionDuration, "Competition is not closable");
        require(currentCompetition == currentCompetition, "This is not the current competition");
        _;
    }

    modifier isFutureCompetition(uint _competitionId) {
        require(_competitionId > currentCompetition, "The competition is over or is running");
        _;
    }

    modifier isParticipant(address _trader, uint _competitionId) {
        require(_participate(_trader, _competitionId), "Trader is not in the competition");
        _;
    }

    modifier isNotParticipant(address _trader, uint _competitionId) {
        require(!_participate(_trader, _competitionId), "Trader is already in the competition");
        _;
    }

    modifier hasSufficientBalance(bool _buy, address _trader, uint _amount) {
        if (true == _buy) {
            uint virtualCurrencyAmount = getPrice() * _amount / (10 ** 16); // in centimes
            require(competitionToTraderToCurrencyToBalance[currentCompetition][_trader][virtualCurrency] >= virtualCurrencyAmount, "Not sufficient virtual currency balance to buy");
        } else {
            require(competitionToTraderToCurrencyToBalance[currentCompetition][_trader][realCurrency] >= _amount, "Not sufficient real currency balance to sell");
        }
        _;
    }
}
