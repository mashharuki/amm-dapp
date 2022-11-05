# amm-dapp
アバランチ上で動作するAMMDapp用の開発リポジトリです。

### SWAPの仕組み

$k = y * x$を使用。 kを固定値とすれば y と xの積の値は一定となる。kの値になるようにyとxが変動する。

### コントラクトのデプロイ

```zsh
cd backend && npm run deploy:fuji
```

```zsh
> backend@1.0.0 deploy:fuji
> npx hardhat run scripts/deploy.ts --network fuji

usdc address: 0x045aa885e04dab32316eA0B39Cda9c966A5d9845
joe address: 0xF51E4C9D1b09df0bE1Bad943cEa2F124d9947034
amm address: 0x7A11376BA156144117aD48940AaE86053e642321
account address that deploy contract: 0x51908F598A5e0d8F1A3bAbFa6DF76F9704daD072
```