# JuicEchain Node (SDK)

**JuicEchain** The management of digital assets will be an essential part of new business models and close connected to 
their success. Our JuicEchain solution is the tool to enable and guarantee exactly that. It’s the easiest available 
access to blockchain technology without worrying about technical and infrastructure (node-network) requirements, 
accessible as any other cloud service. <a href="https://juicecommerce.de/juicechain">Learn more here.</a> 

TypeScript SDK for managing a Node in the JuicEchain Blockchain Network. It allows users to create and control Wallets, issue 
digital Assets and Non-fungible assets (NFA's).<br />

### Prerequisite

 - **Node** The Node name you like to connect
 - **Username** Username of your API user
 - **ApiKey** API key of your user

Access to functions of the JuicEchain API is based on Authorization and Authentication

#### Authorization
Authorization is general API access based on the API-Key and the header flag `authorization`. Authorization
is required for all API requests. If the flag is missing, or your user invalid / deactivated, access is denied.
 
#### Authentication 
Authentication is an additional header parameter `authentication`, identifying the wallet the request is based on. 
This is realized by a so called "BitCoin Message", which is signed with the wallet owners private key. 
Authentication can be generated by calling "getAuthentication()" method on a wallet reference, but the SDK has all these 
functions build-in so and is taking care of it. 
Authentication tokens, are short-lived tokens, so we can ensure they are only used by you!

>Most Blockchains transactions are signed with the private-key of the sender, to confirm the ownership of the wallet.

### Good to Know

#### Wallet
Wallet is a unique address in JuicEchain which allows its owner to manage and collect digital Assets. It is based on 
asymmetric encryption with public (wallet address) and private keys (made for securing and signing every transaction).  


#### Digital Asset
Digital Asset is a unique digital representation of Tickets, Vouchers, Coupons, Contracts or Identities in JuicEchain 
network. Users can issue digital assets in amount they need with all necessary parameters and transfer them
unlimited number of times. Every digital Asset has these properties: <br />
* **Name** - unique name in whole network (only 1 digital Asset can be defined with specific name)
* **Amount** - total issued amount
* **Title** - name of digital Asset displayed in all apps using JuicEchain
* **Description** - long specific description
* **Inception date** - time from which digital asset is valid  
* **Expiration date** - time until digital asset is valid
* **Media** - upload picture or video representing digital Asset
* **Options** - additional options like allowing transfer, transferring only inside home Node or returning digital Asset to
owner

####  Digital Asset Classifications

There are 3 different classifications of digital Assets
1. Multi Asset (Fungible Asset)
    * Multi Assets are the default classification and are specified by the initial amount issued. Each multi asset has the same
    properties and can't be distinguish between each other. 

2. Master Asset
    * Master Assets are the template for Non-fungible (NFT) assets or child assets. All properties specified
    on the master asset are mirrored to each child, if not overwritten by the child.
    * Only the owner of the Master asset is allowed to issue NFT's of this class.
    * The quantity of master assets is limited to one only, but declares the amount of child assets allowed to be issued.

2. Asset (NFA - Non Fungible Asset)
    * None fungible asset are a copy of its master, but can overwrite or contain additional / different properties.
    * E.g. Ticket which has a unique seat allocation in a Theatre, Stadium, Bus or even Hotel room door key.

#### Digital Asset Types

JuicEchain defines 5 general types of digital Assets, which can be applied to the respective use-case.

| Type        | Description   |
| ------------- |:-------------|
| admission    | Ticket, Entry pass  |
| voucher      | Redeemable transaction type which is worth a certain monetary value      |
| coupon | Redeemed for a financial discount     |
| contract | Agreement between multiple parties     |
| identity | Piece of identification or ID     |

#### Asset Name

Asset names are unique in the whole network and limited to 32 character including the nodes prefix.
Default separation character is `:` and only required once after the nodes name:

*Example asset name, issued on the node "Demo"*
 ```
 demo:exampleassetname
 ```

A special case are Master and Child assets. *Master assets need to end with  `#` Hashtag.*
 ```
 // Master Asset Name
 demo:examplemaster#

 // Child assets can occupy all left character space after the hashtag
 demo:examplemaster#1
 ```

 > Regex for Asset name
 > `/^[a-z0-9#]+([\:]{1}[a-z0-9#]+)*$/g;`


#### Blocktime

JuicEchain has an internal block-time of 10 seconds. After a successful transfer, the asset should appear
in the receivers wallet, latest after 10 seconds! However, its possible with the parameter "minconf" to get
instant results even of transaction which are yet not minded e.g confirmed by any node.

# Coding Examples
 ## Connect to Node

Create a new Node reference by calling "getNode()" from JuicEchain.
 ```typescript
const demo:Node = JuicEchain.getNode("demo", *Username*, *API Key*);
 ```

## Create your first Wallet

Wallets are connected to their origin Node. You can call "createWallet()" method on the Node reference
to receive a new wallet. The wallet is connected to your API user. You can perform transfers
on your own wallets without need for a signature.  

```typescript
const wallet:Wallet = await demo.createWallet();
```

## Issue your first Asset

Assets are connected to their "issuing" wallet. Means the newly created assets are placed
into (address / wallet). They can be from there transferred anywhere further  .

```typescript
 const name:string  = "demo:myasset";
 const title:string = "My First Asset";
 const amount:number = 100;
 const type:string = AssetType.ADMISSION;
 const publisher:string = "BackToTheFuture GmbH";

 const asset:Asset = await demo.issue(name, title, type, amount, wallet.address, publisher);
```

## Transfer asset

Call `wallet.transfer()" to transfer the given asset with amount to the receivers address.

```typescript
const successTransfer:boolean = await wallet.transfer(*some-wallet-address*, "demo:myasset", 2, "");
```

## Fetch wallet balance

The balance (overview of assets owned and amount) can be fetched directly from the Wallet reference.

```typescript
const balance:Array<Balance> = await wallet.getBalance();
```

Possible result as JSON
```json
[{
  "asset": "demo:myasset",
  "quantity": 2
}]
```
