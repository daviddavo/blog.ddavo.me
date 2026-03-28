---
title: On Spanish National Postal Service Crypto Stamps
lastmod: 2026-03-28T15:40:55.305Z
date: 2024-06-14T19:14:22.496Z
cover:
    image: cover.webp
    alt: Photo of the Mortadelo crypto stamp launch event.
    caption: Photo of the crypto stamp launch by Correos. EFE/Alejandro Garcia
authors:
    - ddavo24
keywords:
    - blockchain
    - correos
    - NFT
    - crypto stamps
description: In this post I briefly analyze how the crypto stamps recently released by Correos are implemented and used.
tags:
    - blockchain
    - opinion
    - data visualization
categories:
    - opinion
---

Very recently, Correos (Spain's national postal service) decided to launch a collection of "crypto stamps" based on Francisco Ibañez's famous character Mortadelo. Along with a special physical stamp that shows Mortadelo walking with his little case and all the usual gadgets, usable at a face value of 10€, you also get a code that can be redeemed for an NFT. All physical stamps have the same artwork, but the NFT shows one of 5 possible _criptosellos_ (_crypto stamps_), each with a different print run and based on one of his classic disguises.

{{<figure
    src="todos-criptosellos.webp"
    alt="The 5 possible stamps are shown, based on 5 Mortadelo disguises"
    caption="The 5 possible Crypto Stamps and their print runs."
    attr="Spanish Federation of Philatelic Societies"
    attrlink="https://fesofi.es/noticias/primer-criptosello-espanol/"
>}}

Broadly speaking, an NFT (Non-Fungible Token) is a _representation_ of an asset (digital or physical) implemented on a blockchain. Even though it uses the same technology as cryptocurrencies, unlike cryptocurrencies NFTs are not liquid and cannot be divided. For example, 5 euros are still 5 euros whether they are banknotes, coins, a check, or your account balance. NFTs, however, represent indivisible assets (non-fungible). They can represent unique one-of-a-kind items, like the deed to your house that _represents_ your house, or repeatable items with limited supply, like collectible cards in a set, or **stamps** in this case. Remember that an NFT is just a _token_, a _symbol_, a _ticket_. It is not **the house**, it is **the deed**. The value proposition of NFTs is that strong blockchain cryptography proves you are the real owner. So, instead of _a notary_ or a government registry, you get a decentralized network plus a bunch of cryptographic algorithms proving it.

Blockchain has a bad reputation because it [can consume more electricity than countries such as Argentina](https://es.cointelegraph.com/news/in-2023-bitcoin-mining-consumed-more-than-one-third-of-mexicos-electrical-energy), but that is basically a Bitcoin issue. Ethereum no longer has that problem since the Ethereum 2.0 transition a few years ago. Also, Correos' NFT runs on an alternative network called Polygon, a chain similar to Ethereum but much faster and more efficient (including energy efficiency).

In that sense, Correos did not do too badly. But the two main reasons to use blockchain are **transparency** and **decentralization**. In the rest of this post I will analyze these crypto stamps from those perspectives, and finally whether people are actually using them, and how much.

## Transparency

This already starts poorly: the bare minimum transparency you should expect from something blockchain-based is publishing the smart contract address, and they did not do that.

Not publishing the contract address is like saying you have a transparency portal but not saying where it is. It hides the essential information users need to interact with the contract.

As someone who researches this stuff, I managed to find the contract on my own. Its address was [`0x8fA19F4316dF640e14b30B2fE749cbdd79Da9335`](https://polygon.blockscout.com/token/0x8fA19F4316dF640e14b30B2fE749cbdd79Da9335).

> Update June 14, 2024: Some weird stuff happened and they _migrated_ the contract [to another address](https://polygon.blockscout.com/token/0x4D5D215c47a43B38a58Abf735b628cF9b61273a0), in a rather clumsy way.

They also do not publish the smart contract source code, so users cannot audit how it works or whether it is implemented correctly. There could be a bug that allows someone to grab all crypto stamps, and we might never know.

Even if you do not know programming, a common practice in this ecosystem is paying someone to audit contract code, yours or someone else's.

At least blockchain transfers are transparent, so we can still see who owns these exclusive Mortadelo NFTs.

## Decentralization

On the **decentralization** side, the solution is also quite disappointing. Normally NFTs use decentralized standards that let you use them across the wider web3 ecosystem: set one as your social media profile picture, show it in a virtual gallery, use it in games, and so on.
With these crypto stamps, you must use the Correos web app to view the associated image. When the consultancy firm maintaining that website drops support in a couple of years, you may lose access to your crypto stamp.

**If crypto stamps are neither transparent nor decentralized, why do they exist?**

I guess to increase stamp value and sell more units, right? We do not know how many stamps have been sold, but we can track how many were "redeemed" (or "claimed") on-chain, and what kind of users did it.

> This post updates automatically with new data. Last update: {{< data/text id="criptosellos-last-update" file="general-data.json">}}.

*Drum roll*... a total of {{< data/text id="criptosellos-total-tokens" >}} crypto stamps have been claimed,
an average of {{< data/text id="criptosellos-daily-avg">}} per day.

{{< data/chart
    id="criptosellos-diario-chart"
    file="daily-mints.csv"
    title="Daily number of registered Crypto Stamps"
    caption="Some days have very few claims, but there are occasional streaks."
    attr="David Davo via Dune Analytics."
    attrlink="https://dune.com/queries/3917833/6586501"
 >}}

However, that does not mean there are as many people as stamps. In reality only {{< data/text id="criptosellos-total-holders" >}} different wallets hold at least one crypto stamp. We cannot claim these are unique users, because just like with email there is nothing stopping one person from creating multiple accounts. In crypto this is normal: keep one wallet with a very strong key for long-term storage, and another easier-to-use one (for example on your phone) so if it gets hacked, losses are limited.

Each user that holds at least one crypto stamp is called a _holder_. Although each _holder_ has an average of {{< data/text id="criptosellos-holder-avg" >}} stamps, this is the classic "if I eat two chickens and you eat none, on average we ate one each" problem.

The reality is that one user has way more NFTs than everyone else: {{<data/text id="criptosellos-holder-whale-address">}}, who holds **{{<data/text id="criptosellos-holder-whale-count" >}} crypto stamps**. Meanwhile, most users ({{< data/text id="criptosellos-holder-oneortwo-cnt" >}}) hold one or two.

{{<data/chart
    id="criptosellos-holders-chart"
    file="holders.csv"
    title="Number of crypto stamps per user"
    caption="Users with few stamps (four or fewer) are grouped together. Hover to see the full address or user count."
    attr="David Davo via Dune Analytics."
    attrlink="https://dune.com/queries/3917785/6586366"
>}}

Another interesting question is whether these users had stamps from other collections. In other words, were they already familiar with this technology, or did Mortadelo bring them in?

Curiously, the wallet with the most crypto stamps had **no** previous NFTs, though maybe that person has another wallet with some; we can never know. Maybe it is a stamp seller from Plaza Mayor, who knows.

Overall, only {{<data/text id="criptosellos-holders-had-nfts-avg">}} of users had ever held at least one NFT in their wallet. We do not even know whether they bought those NFTs or received them as gifts (or spam), so we cannot claim those few users are true _crypto enthusiasts_. What we can say confidently is that **{{<data/text id="criptosellos-holders-had-nfts-avg-not">}} or more had never used NFTs before**. What this means is that this product did not manage to attract crypto enthusiasts to the stamp collecting hobby, but the other way around.

> Note that I am checking not just Polygon (where these crypto stamps live), but all chains indexed in [Dune Analytics](https://dune.com).

## Money talk

We all know crypto can move serious money, with [some collections reaching millions of dollars](https://forbes.es/criptomonedas/217739/la-crypto-punk-mania-este-es-el-top-10-de-colecciones-de-nft-de-2022/), but how much money do these crypto stamps move?

So far there have barely been any transfers, and none of them involved money through auction houses, so from that angle we cannot say whether owning a crypto stamp has any value beyond the physical stamp.

Still, we can estimate the _profit_ this strategy has generated for Correos. Each unit costs 15€ and has a face value of 10€, meaning you can use it for postage up to 10€ and Correos keeps a 5€ markup.

Since {{<data/text id="criptosellos-total-tokens2">}} stamps have been sold so far, Correos has made at least {{<data/text id="criptosellos-total-money">}} EUR in markup revenue.

Depending on whether the stamp is eventually used and for which postal product, real profit could be higher.

There are likely many stamps that were bought but not yet claimed on-chain. Still, I think it is fair to assume that if a buyer did not register it, then the crypto part added no value for that person.

Speaking of money: while I am not an expert in Spain's public procurement platform, it seems Correos has spent at least {{<data/text id="criptosellos-correos-contratos" file="contratos.csv">}} EUR across {{<data/text id="criptosellos-correos-contratos-cnt">}} contracts to launch this collection. That said, part of that budget went into business-model research and framework design, so it could be amortized over future collections.

> You can download the procurement data I collected [here](./contratos.csv). If you spot anything wrong, please let me know.

## Conclusions

In my humble opinion, Correos arrived very late and somewhat awkwardly to the 2021 NFT boom (already three years ago). On top of that, the lack of decentralization and transparency, two core values in this ecosystem, may make users less likely to buy crypto stamps.

Maybe they will recover the investment in future collections, hopefully with better implementation choices, because right now this is still far from what could reasonably be called web3. On the plus side, the website seems fairly accessible and works well.

That said, maybe this crossover has made at least one crypto nerd start collecting physical stamps and become a lifelong customer.

> Data was obtained through Dune Analytics, a blockchain data analysis platform. [You can find the queries and datasets used here](https://dune.com/ddavo/criptosellos).
