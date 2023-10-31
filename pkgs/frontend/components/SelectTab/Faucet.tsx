import { useEffect, useState } from "react";
import { TokenType } from "../../hooks/useContract";
import styles from "./SelectTab.module.css";
import InputNumberBox from "../InputBox/InputNumberBox";
import { ethers } from "ethers";
import { validAmount } from "../../utils/validAmount";

type Props = {
    token0: TokenType | undefined;
    token1: TokenType | undefined;
    currentAccount: string | undefined;
    updateDetails: () => void;
};

/**
 * Faucet Component
 * @param param0 
 * @returns 
 */
export default function Faucet({
    token0,
    token1,
    currentAccount,
    updateDetails,
}: Props) {

    const [amountOfFunds, setAmountOfFunds] = useState("");
    const [currentTokenIndex, setCurrentTokenIndex] = useState(0);
    const [tokens, setTokens] = useState<TokenType[]>([]);

    useEffect(() => {
        if (!token0 || !token1) return;
        setTokens([token0, token1]);
    }, [token0, token1]);

    const onChangeToken = () => {
        setCurrentTokenIndex((currentTokenIndex + 1) % tokens.length);
    };

    const onChangeAmountOfFunds = (amount: string) => {
        setAmountOfFunds(amount);
    };

    /**
     * onClickFund function
     * @returns 
     */
    async function onClickFund() {
        if (!currentAccount) {
            alert("connect wallet");
            return;
        }
        if (tokens.length === 0) return;

        if (!validAmount(amountOfFunds)) {
            alert("Amount should be a valid number");
            return;
        }

        try {
            // get contract
            const contract = tokens[currentTokenIndex].contract;
            const amountInWei = ethers.utils.parseEther(amountOfFunds);
            // faucet function
            const txn = await contract.faucet(currentAccount, amountInWei);
            await txn.wait();

            updateDetails(); 
            alert("Success");
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className={styles.tabBody}>
            <div className={styles.bottomDiv}>
                <div className={styles.btn} onClick={() => onChangeToken()}>
                Change
                </div>
            </div>
            <InputNumberBox
                leftHeader={
                    "Amount of " +
                    (tokens[currentTokenIndex]
                        ? tokens[currentTokenIndex].symbol
                        : "some token")
                }
                right={
                    tokens[currentTokenIndex] ? tokens[currentTokenIndex].symbol : ""
                }
                value={amountOfFunds}
                onChange={(e) => onChangeAmountOfFunds(e.target.value)}
            />
            <div className={styles.bottomDiv}>
                <div className={styles.btn} onClick={() => onClickFund()}>
                    Fund
                </div>
            </div>
        </div>
    );
}