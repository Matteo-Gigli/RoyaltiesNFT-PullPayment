const{expect} = require("chai");
const{expectRevert} = require("@openzeppelin/test-helpers");


describe("Testing functionality of the contract", function(){

    let RoyaltiesToken, royaltiesToken, Marketplace, marketplace, owner, account1, account2, account3;

    before(async()=>{

        [owner, account1, account2, account3] = await ethers.getSigners();

        RoyaltiesToken = await ethers.getContractFactory("RoyaltiesToken");
        royaltiesToken = await RoyaltiesToken.deploy("RoyaltiesNFT", "RNFT");
        await royaltiesToken.deployed();

        Marketplace = await ethers.getContractFactory("Marketplace");
        marketplace = await Marketplace.deploy();
        await marketplace.deployed();


        await royaltiesToken.initMarketplace(marketplace.address);
    });


    it("should be able to mint a token", async()=>{
        await royaltiesToken.mintToken(1, {value: 1});

        let [addressReceiveRoyalty, expectRoyaltiesForSellingAt10Eth] =
            await royaltiesToken.royaltyInfo(1, ethers.utils.parseEther("10"));

        let amountToReceiveRedable = expectRoyaltiesForSellingAt10Eth / 10**18;

        console.log("Address Receiving Royalty: ", addressReceiveRoyalty.toString());
        console.log("Amount on sale of 10 ETH: ", amountToReceiveRedable.toString(), "ether");
        console.log("");
    });



    it("should revert to set in sale if i'm not the owner of the token", async()=>{
        await expectRevert(marketplace.connect(account1).setInSale(
            royaltiesToken.address, 1, ethers.utils.parseEther("10")
        ), "You are not the token Owner!");
    });



    it("should be able to set in sale", async()=>{
        await marketplace.setInSale(royaltiesToken.address, 1, ethers.utils.parseEther("10"));

        let [checkSale, salePrice] = await marketplace.tokensInfo(1);

        expect(checkSale).to.be.equal(true);
        expect(salePrice).to.be.equal(ethers.utils.parseEther("10"));

        let amountSaleRedable = salePrice / 10**18;

        console.log("Token in sale: ", checkSale);
        console.log("Sale Price: ", amountSaleRedable, "ether");
        console.log("");
    });



    it("should revert to buy token if you don't set the right price", async()=>{
        await expectRevert(marketplace.connect(account1).buyToken(
            royaltiesToken.address, 1, {value:ethers.utils.parseEther("9")}
        ), "Set right Price");
    });



    it("should revert to buy token if you are the token owner", async()=>{
        await expectRevert(marketplace.buyToken(
            royaltiesToken.address, 1, {value:ethers.utils.parseEther("10")}
        ), "Can't buy your own token!");
    });



    it("should be able to buy token", async()=>{
        await marketplace.connect(account1).buyToken(
            royaltiesToken.address, 1, {value:ethers.utils.parseEther("10")}
        );

        let amountEthToPullOutForSeller = await marketplace.payments(owner.address);
        let amountToPullOutRedable = amountEthToPullOutForSeller / 10**18;

        expect(amountToPullOutRedable).to.be.equal(10);

        console.log(
            "Amount ETH To Pull Out from Seller: ",
            amountToPullOutRedable.toString(), "ether"
            );

        console.log("");
    });


    it("should be able to withdraw money from the sell", async()=>{
        let ownerBalanceBeforeWithdraw = await ethers.provider.getBalance(owner.address);
        let ownerBalanceBeforeRedable =  ownerBalanceBeforeWithdraw / 10**18;

        console.log("Owner Balance Before Withdraw: ", ownerBalanceBeforeRedable.toString(), "ether");
        console.log("");

        await marketplace.withdrawPayments(owner.address);

        let ownerBalanceAfterWithdraw = await ethers.provider.getBalance(owner.address);
        let ownerBalanceAfterRedable =  ownerBalanceAfterWithdraw / 10**18;

        console.log("Owner Balance After Withdraw: ", ownerBalanceAfterRedable.toString(), "ether");
        console.log("");
    })




    it("should reset the token in sale to show how royalties work for the primary owner", async()=>{

        await marketplace.connect(account1).setInSale(royaltiesToken.address, 1, ethers.utils.parseEther("10"));

        let [checkSale, salePrice] = await marketplace.tokensInfo(1);

        expect(checkSale).to.be.equal(true);
        expect(salePrice).to.be.equal(ethers.utils.parseEther("10"));

        let amountSaleRedable = salePrice / 10**18;

        console.log("Token in sale: ", checkSale);
        console.log("Sale Price: ", amountSaleRedable, "ether");
        console.log("");
    });


    it("should be able to buy and set payments for the first owner and for the seller", async()=>{
        await marketplace.connect(account2).buyToken(
            royaltiesToken.address, 1, {value:ethers.utils.parseEther("10")}
        );

        let amountEthToPullOutForSeller = await marketplace.payments(account1.address);
        let amountEthToPullOutForOwnerRoyalties = await marketplace.payments(owner.address);

        let amountToPullOutRedableForSeller = amountEthToPullOutForSeller / 10**18;
        let amountToPullOutRedableForOwnerRoyalties = amountEthToPullOutForOwnerRoyalties / 10**18;

        expect(amountToPullOutRedableForSeller).to.be.equal(9);
        expect(amountToPullOutRedableForOwnerRoyalties).to.be.equal(1);

        console.log(
            "Amount ETH To Pull Out from Seller: ",
            amountToPullOutRedableForSeller.toString(), "ether"
            );


        console.log(
            "Amount ETH To Pull Out from Royalties Owner: ",
            amountToPullOutRedableForOwnerRoyalties.toString(), "ether"
            );

        console.log("");
    });



    it("should be able to withdraw your payments", async()=>{
        let ownerBalanceBeforeWithdraw = await ethers.provider.getBalance(owner.address);
        let ownerBalanceBeforeRedable =  ownerBalanceBeforeWithdraw / 10**18;

        console.log("Owner Balance Before Withdraw: ", ownerBalanceBeforeRedable.toString(), "ether");
        console.log("");


        let account1BalanceBeforeWithdraw = await ethers.provider.getBalance(account1.address);
        let account1BalanceBeforeRedable =  account1BalanceBeforeWithdraw / 10**18;

        console.log("Account1 Balance Before Withdraw: ", account1BalanceBeforeRedable.toString(), "ether");
        console.log("");

        await marketplace.withdrawPayments(owner.address);
        await marketplace.connect(account1).withdrawPayments(account1.address);

        let ownerBalanceAfterWithdraw = await ethers.provider.getBalance(owner.address);
        let ownerBalanceAfterRedable =  ownerBalanceAfterWithdraw / 10**18;

        console.log("Owner Balance After Withdraw: ", ownerBalanceAfterRedable.toString(), "ether");
        console.log("");

        let account1BalanceAfterWithdraw = await ethers.provider.getBalance(account1.address);
        let account1BalanceAfterRedable =  account1BalanceAfterWithdraw / 10**18;

        console.log("Account1 Balance After Withdraw: ", account1BalanceAfterRedable.toString(), "ether");
        console.log("");
    })

})