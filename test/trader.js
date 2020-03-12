const CryptoTrader = artifacts.require("CryptoTrader");

contract("CryptoTrader", (accounts) => {
  let [alice, bob] = accounts;
  let contractInstance;
  beforeEach(async () => {
      contractInstance = await CryptoTrader.new();
  });

  it("should be able to join a competition", async () => {
      const result = await contractInstance.joinCompetition(2, {from: alice});
      assert.equal(result.receipt.status, true);
  });

  it("should be able to leave a competition", async () => {
      await contractInstance.joinCompetition(2, {from: bob});
      const result = await contractInstance.leaveCompetition(2, {from: bob});
      assert.equal(result.receipt.status, true);
  });

  it("should get the token price", async () => {
    const result = await contractInstance.getPrice();
    assert.typeOf(result.words[0], "number");
  });

});
