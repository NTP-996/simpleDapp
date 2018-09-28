const TokenZendR = artifacts.require('./TokenZendR.sol');
const BearToken = artifacts.require('./BearToken.sol');
const CubToken = artifacts.require('./CubToken.sol');

const BigNumber = web3.BigNumber;

const should = require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should();

let sender, bear, cub;

contract('token_management', async (accounts) => {
  let accountA, accountB, accountC, accountD;

  [accountA, accountB, accountC, accountD] = accounts;

  beforeEach(async () => {
    sender = await TokenZendR.new();
    bear = await BearToken.new();
    cub = await CubToken.new();

    await sender.addNewToken('BEAR', bear.address);
    await sender.addNewToken('CUB', cub.address);
  });

  // it("should add new supported token", async() => {
  //   let address = await sender.tokens.call('OPEN');

  //   address.should.equal('0x69c4bb240cf05d51eeab6985bab35527d04a8c64');
  // });

  // it("should update supported token address", async() => {
  //   await sender.addNewToken('OPEN',
  //   '0x3472059945ee170660a9a97892a3cf77857eba3a');

  //   let address = await sender.tokens.call('OPEN');

  //   address.should.equal('0x3472059945ee170660a9a97892a3cf77857eba3a');
  // });

  // it("should remove unused supported token address", async() => {
  //   await sender.removeToken('OPEN');

  //   let address = await sender.tokens.call('OPEN');

  //   address.should.equal('0x0000000000000000000000000000000000000000');
  // });

  it("should be able to transfer sender token to another wallet",
    async() => {
      /**
       * When transfering token, multiple by
       * figure of decimal to get exact token e.g
       * to send 5 BEAR = 5e5, where 5 is the decimal places
       */
      let amount = new BigNumber(500000e5);

      //Account a approve contract to spend on behalf
      await bear.approve(sender.address, amount, {from: accountA});

      await sender.transferTokens('BEAR', accountB, amount, {from: accountA});

      let balance = ((await bear.balanceOf(accountB)).toString());

      balance.should.equal(amount.toString())
    });

})