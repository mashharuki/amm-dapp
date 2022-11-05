import { useState, useEffect } from "react";
import { BigNumber, ethers } from "ethers";
import UsdcArtifact from "../utils/USDCToken.json";
import JoeArtifact from "../utils/USDCToken.json";
import AmmArtifact from "../utils/AMM.json";
import { USDCToken as UsdcContractType } from "../typechain-types";
import { JOEToken as JoeContractType } from "../typechain-types";
import { AMM as AmmContractType } from "../typechain-types";
import { getEthereum } from "../utils/ethereum";

export const UsdcAddress = "0x045aa885e04dab32316eA0B39Cda9c966A5d9845";
export const JoeAddress = "0xF51E4C9D1b09df0bE1Bad943cEa2F124d9947034";
export const AmmAddress = "0x7A11376BA156144117aD48940AaE86053e642321";

export type TokenType = {
    symbol: string;
    contract: UsdcContractType | JoeContractType;
};

export type AmmType = {
    sharePrecision: BigNumber;
    contract: AmmContractType;
};

type ReturnUseContract = {
    usdc: TokenType | undefined;
    joe: TokenType | undefined;
    amm: AmmType | undefined;
};

/**
 * useContract Component
 * @param currentAccount 
 * @returns 
 */
export const useContract = (currentAccount: string | undefined): ReturnUseContract => {

    const [usdc, setUsdc] = useState<TokenType>();
    const [joe, setJoe] = useState<TokenType>();
    const [amm, setAmm] = useState<AmmType>();
    // get ethereum
    const ethereum = getEthereum();

    /**
     * getContract function
     * @param contractAddress 
     * @param abi 
     * @param storeContract 
     * @returns 
     */
    const getContract = (
        contractAddress: string,
        abi: ethers.ContractInterface,
        storeContract: (_: ethers.Contract) => void
    ) => {
        if (!ethereum) {
            console.log("Ethereum object doesn't exist!");
            return;
        }

        if (!currentAccount) {
            console.log("currentAccount doesn't exist!");
            return;
        }

        try {
            // @ts-ignore: ethereum as ethers.providers.ExternalProvider
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner(); 
            // create contact instance
            const Contract = new ethers.Contract(contractAddress, abi, signer);
            storeContract(Contract);
        } catch (error) {
            console.log(error);
        }
    };

    /**
     * generateUsdc
     * @param contract 
     */
    const generateUsdc = async (contract: UsdcContractType) => {
        try {
            const symbol = await contract.symbol();
            setUsdc({ symbol: symbol, contract: contract } as TokenType);
        } catch (error) {
            console.log(error);
        }
    };

    /**
     * generateJoe
     * @param contract 
     */
    const generateJoe = async (contract: UsdcContractType) => {
        try {
            const symbol = await contract.symbol();
            setJoe({ symbol: symbol, contract: contract } as TokenType);
        } catch (error) {
            console.log(error);
        }
    };

    /**
     * generateAmm
     * @param contract 
     */
    const generateAmm = async (contract: AmmContractType) => {
        try {
            const precision = await contract.PRECISION();
            setAmm({ sharePrecision: precision, contract: contract } as AmmType);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        // get contract
        getContract(UsdcAddress, UsdcArtifact.abi, (Contract: ethers.Contract) => {
            generateUsdc(Contract as UsdcContractType);
        });
        getContract(JoeAddress, JoeArtifact.abi, (Contract: ethers.Contract) => {
            generateJoe(Contract as JoeContractType);
        });
        getContract(AmmAddress, AmmArtifact.abi, (Contract: ethers.Contract) => {
            generateAmm(Contract as AmmContractType);
        });
    }, [ethereum, currentAccount]);

    return {
        usdc,
        joe,
        amm,
    };
};