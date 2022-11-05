import { useEffect, useState } from "react";
import { getEthereum } from "../utils/ethereum";

type ReturnUseWallet = {
  currentAccount: string | undefined;
  connectWallet: () => void;
};

/**
 * useWallet component
 * @returns 
 */
export const useWallet = (): ReturnUseWallet => {
    const [currentAccount, setCurrentAccount] = useState<string>();
    // get ethereum
    const ethereum = getEthereum();
    
    /**
     * connectWallet function
     * @returns
     */
    const connectWallet = async () => {
        try {
            if (!ethereum) {
                alert("Get Wallet!");
                return;
            }

            const accounts = await ethereum.request({
                method: "eth_requestAccounts",
            });

            if (!Array.isArray(accounts)) return;
            console.log("Connected: ", accounts[0]);
            setCurrentAccount(accounts[0]); 
        } catch (error) {
            console.log(error);
        }
    };
    
    /**
     * check wallet status
     * @returns 
     */
    const checkIfWalletIsConnected = async () => {
        try {
            if (!ethereum) {
                console.log("Make sure you have Wallet!");
                return;
            } else {
                console.log("We have the ethereum object", ethereum);
            }

            const accounts = await ethereum.request({ method: "eth_accounts" });

            if (!Array.isArray(accounts)) return;
            if (accounts.length !== 0) {
                const account = accounts[0];
                console.log("Found an authorized account:", account);
                setCurrentAccount(account);
            } else {
                console.log("No authorized account found");
            }
        } catch (error) {
            console.log(error);
        }
    };
  
    useEffect(() => {
        checkIfWalletIsConnected();
    }, []);
  
    return {
        currentAccount,
        connectWallet,
    };
};