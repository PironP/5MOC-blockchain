pragma solidity >=0.4.21 <0.7.0;

import "../OSM/OSM.sol";

contract PriceHelper {
    address OSMKovan = 0x9FfFE440258B79c5d6604001674A4722FfC0f7Bc;
    address OSMMainNet = 0x81FE72B5A8d1A857d176C3E7d5Bd2679A9B85763;

    OSM osmInstance = OSM(OSMKovan);

    /// @notice Allow anyone to get real currency current price in Wei.
    /// @return uint
    function getPrice() public view returns (uint) {
        return uint(osmInstance.read()) ;
    }

    /// @notice Allow to convert wei to usd dollar centimes.
    /// @return uint
    function _getVirtualCurrencyAmount(uint _weiAmount) internal view returns (uint) {
        return (getPrice() / 10 ** 18) * _weiAmount / (10 ** 16);
    }
}
