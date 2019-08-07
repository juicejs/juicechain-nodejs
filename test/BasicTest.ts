import {expect} from "chai";
import {JuicEchain} from "../src/JuicEchain";
import * as path from "path";
import {Wallet} from "../src/managed/Wallet";
import {Asset} from "../src/managed/Asset";
import {Node} from "../src/managed/Node";
import {AssetType} from "../src/models/AssetType";

const fs = require("fs");

var demo: Node;
var wallet: Wallet;
var asset: Asset;
var assetName: string;

/**
 *  Testing Asset Issue and Wallet
 */
describe('Testing Asset Issue and Wallet', () => {

    it('Create Node reference', async () => {
        demo = JuicEchain.getNode("demo", "", "");

        expect(demo).not.to.be.null;
    });

    it('Create Wallet', async () => {
        wallet = await demo.createWallet();

        expect(wallet).to.not.be.null;
        expect(wallet.node).equals("demo");
    }).timeout(10000);

    it("Issue new asset", async () => {
        assetName = "demo:testasset:" + Math.round(Math.random() * 1000);
        asset = await demo.issue(assetName, "Mein Test Asset", AssetType.ADMISSION, 100,
            wallet.address, "BackToTheFuture GmbH");

        expect(asset).to.not.be.null;
        expect(asset.publisher).equals("BackToTheFuture GmbH");
    }).timeout(10000);

    it("Fetch Balance", async () => {
        const balances = await wallet.balance(0);

        expect(balances).to.be.an.instanceof(Array);
        expect(balances.length).to.equal(1);
        expect(balances[0].quantity).to.equal(100);
    }).timeout(10000);

    it("Set asset title", async () => {
        const result = await asset.setTitle({
            de_DE: "Hallo",
            en_GB: "Hola"
        });

        const asset2:Asset = await wallet.getAsset(asset.name);
        expect(asset2.title).to.deep.equal({
            de_DE: "Hallo",
            en_GB: "Hola"
        });

        expect(result).to.be.true;
    }).timeout(10000);


    it("Set asset parameters", async () => {
        const date = new Date();
        const result = await asset.setParameters({
            inception: date,
            expiration: date,
            valid: true,
            disabled: false,
            transferable: "all"
        });

        const asset2:Asset = await wallet.getAsset(asset.name);
        expect(asset2.transferable).to.be.equal("all");
        expect(asset2.inception.getTime()).to.be.equal(date.getTime());
        expect(asset2.disabled).to.be.true;

        expect(result).to.be.true;
    }).timeout(10000);

    it("Set Content", async () => {
        const result = await asset.setContent({
            seating: 25,
            row: 50
        });

        const asset2:Asset = await wallet.getAsset(asset.name);
        expect(asset2.content).to.deep.equal({
            seating: 25,
            row: 50
        });
    });

    it("Set asset description", async () => {
        const result = await asset.setDescription({
            de_DE: "desc",
            en_GB: "desc2"
        });

        const asset2:Asset = await wallet.getAsset(asset.name);
        expect(asset2.description).to.deep.equal({
            de_DE: "desc",
            en_GB: "desc2"
        });

        expect(result).to.be.true;
    }).timeout(10000);

    it("Attach card image to asset", async () => {
        const buffer = fs.readFileSync(path.join(__dirname, './contents/card.png'));
        const result = await asset.setCard(buffer, "cover");

        expect(result).to.be.true;
    }).timeout(10000);

    it("Attach ticket to asset", async () => {
        const buffer = fs.readFileSync(path.join(__dirname, './contents/media.png'));
        const result = await asset.setTicket(buffer, "cover");

        expect(result).to.be.true;
    }).timeout(10000);

    it("Transfer asset to mobile wallet", async () => {
        const wallet2 = await demo.createWallet();

        const result = await wallet.transfer(wallet2.address, assetName, 2, "{}");
        expect(result).to.be.true;

        // check balance of receiver
        const balances = await wallet2.balance(0);
        expect(balances).to.be.an.instanceof(Array);
        expect(balances.length).to.equal(1);
        expect(balances[0].quantity).to.equal(2);
    }).timeout(10000);

});
