const CryptoTrader = artifacts.require('CryptoTrader');
const catchRevert = require("./exceptions.js").catchRevert;

const computeGasCost = async (web3, txInfo) => {
    const tx = await web3.eth.getTransaction(txInfo.tx);
    return tx.gasPrice * txInfo.receipt.gasUsed;
};

contract('CryptoTrader', (accounts) => {
    const [alice, bob] = accounts;
    let contractInstance;

    beforeEach(async () => {
        contractInstance = await CryptoTrader.new();
    });

    // it('should get the token price', async () => {
    //     const result = await contractInstance.getPrice();
    //     assert.typeOf(result.words[0], 'number');
    // });

    it('should be able to join a competition', async () => {
        const originalBalance = await web3.eth.getBalance(alice);

        const txInfo = await contractInstance.joinCompetition(2, { from: alice, value: web3.utils.toWei('0.001') });
        const newBalance = await web3.eth.getBalance(alice);

        assert.equal(txInfo.receipt.status, true);
        assert.equal(originalBalance, parseInt(newBalance) + parseInt(web3.utils.toWei('0.001')) + await computeGasCost(web3, txInfo));
    });

    it('should be able to leave a competition', async () => {
        const originalBalance = await web3.eth.getBalance(bob);

        const txInfoJoin = await contractInstance.joinCompetition(2, { from: bob, value: web3.utils.toWei('0.001') });
        const txInfoLeave = await contractInstance.leaveCompetition(2, { from: bob });
        const newBalance = await web3.eth.getBalance(bob);

        assert.equal(txInfoJoin.receipt.status, true);
        assert.equal(txInfoLeave.receipt.status, true);
        assert.equal(originalBalance, parseInt(newBalance) + await computeGasCost(web3, txInfoJoin) + await computeGasCost(web3, txInfoLeave));
    });

    it('should be able to get list of traders', async () => {
        const txInfoJoin = await contractInstance.joinCompetition(2, { from: alice, value: web3.utils.toWei('0.001') });
        const txInfoGet = await contractInstance.getTraders(2);

        assert.equal(txInfoJoin.receipt.status, true);
        assert.equal(txInfoGet.length, 1);
    });

    it('should not be able to join a past or running competition', async () => {
        catchRevert(contractInstance.joinCompetition(1, { from: alice, value: web3.utils.toWei('0.001') }));
    });

    it('should be able to buy', async () => {
        const txInfoJoin = await contractInstance.joinCompetition(2, { from: bob, value: web3.utils.toWei('0.001') });
        // const txInfoBuy = await contractInstance.trade(true, 0.005);
        // TODO: change amount in contract to wei

        assert.equal(txInfoJoin.receipt.status, true);
        // assert.equal(txInfoBuy.receipt.status, true);
    });

    it('should be able to place sell', async () => {
        // todo
    });

    it('should not be able to buy order if not participating', async () => {
        // todo
    });

    it('should not be able to sell if not sufficient balance', async () => {
        // todo
    });

    it('should be able to close competition', async () => {
        // todo
        // assert winner has earned reward
        // assert new competition has started with new participants
    });
});
