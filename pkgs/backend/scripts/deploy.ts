import { ethers } from "hardhat";

async function main() {
  // コントラクトをデプロイするアカウントのアドレスを取得します。
  const [deployer] = await ethers.getSigners();

  // USDCトークンのコントラクトをデプロイします。
  const USDCToken = await ethers.getContractFactory("USDCToken");
  const usdc = await USDCToken.deploy();
  await usdc.deployed();

  // JOEトークンのコントラクトをデプロイします。
  const JOEToken = await ethers.getContractFactory("JOEToken");
  const joe = await JOEToken.deploy();
  await joe.deployed();

  // AMMコントラクトをデプロイします。
  const AMM = await ethers.getContractFactory("AMM");
  const amm = await AMM.deploy(usdc.address, joe.address);
  await amm.deployed();

  console.log("usdc address:", usdc.address);
  console.log("joe address:", joe.address);
  console.log("amm address:", amm.address);
  console.log("account address that deploy contract:", deployer.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
