import { useEffect, useState } from "react";
import { TokenType, AmmType } from "../../hooks/useContract";
import { MdSwapVert } from "react-icons/md";
import styles from "./SelectTab.module.css";
import InputNumberBox from "../InputBox/InputNumberBox";
import { ethers } from "ethers";
import { validAmount } from "../../utils/validAmount";

type Props = {
    token0: TokenType | undefined;
    token1: TokenType | undefined;
    amm: AmmType | undefined;
    currentAccount: string | undefined;
    updateDetails: () => void;
};

/**
 * Swap Component
 * @param param0 
 */
export default function Swap({
    token0,
    token1,
    amm,
    currentAccount,
    updateDetails,
}: Props) {

    const [tokenIn, setTokenIn] = useState<TokenType>();
    const [tokenOut, setTokenOut] = useState<TokenType>();
    const [amountIn, setAmountIn] = useState("");
    const [amountOut, setAmountOut] = useState("");

    /**
     * rev function
     */
    const rev = () => {
        const inCopy = tokenIn;
        setTokenIn(tokenOut);
        setTokenOut(inCopy);
    
        // calc
        getSwapEstimateOut(amountIn);
    };

    /**
     * getSwapEstimateOut function
     */
    const getSwapEstimateOut = async (amount: string) => {
        if (!amm || !tokenIn) return;
        if (!validAmount(amount)) return;

        try {
            const amountInInWei = ethers.utils.parseEther(amount);
            // getSwapEstimateOut
            const amountOutInWei = await amm.contract.getSwapEstimateOut(
                tokenIn.contract.address,
                amountInInWei
            );
            const amountOutInEther = ethers.utils.formatEther(amountOutInWei);
            setAmountOut(amountOutInEther);
        } catch (error) {
            alert(error);
        }
    };
    
    /**
     *  getSwapEstimateIn function
     */
    const getSwapEstimateIn = async (amount: string) => {
        if (!amm || !tokenOut) return;
        if (!validAmount(amount)) return;
        if (amm) {
            try {
                const amountOutInWei = ethers.utils.parseEther(amount);
                // getSwapEstimateIn
                const amountInInWei = await amm.contract.getSwapEstimateIn(
                    tokenOut.contract.address,
                    amountOutInWei
                );

                const amountInInEther = ethers.utils.formatEther(amountInInWei);
                setAmountIn(amountInInEther);
            } catch (error) {
                alert(error);
            }
        }
    };

    const onChangeIn = (amount: string) => {
        setAmountIn(amount);
        getSwapEstimateOut(amount);
    };
    
    const onChangeOut = (amount: string) => {
        setAmountOut(amount);
        getSwapEstimateIn(amount);
    };

    /**
     * onclickSwap function
     * @returns 
     */
    const onClickSwap = async () => {
        if (!currentAccount) {
            alert("Connect to wallet");
            return;
        }
        if (!amm || !tokenIn || !tokenOut) return;
        if (!validAmount(amountIn)) {
            alert("Amount should be a valid number");
            return;
        }

        try {
            const amountInInWei = ethers.utils.parseEther(amountIn);
            // approve
            const txnIn = await tokenIn.contract.approve(
                amm.contract.address,
                amountInInWei
            );
            await txnIn.wait();
            // swap
            const txn = await amm.contract.swap(
                tokenIn.contract.address,
                tokenOut.contract.address,
                amountInInWei
            );
            await txn.wait();

            setAmountIn("");
            setAmountOut("");
            updateDetails(); 
            alert("Success!");
        } catch (error) {
            alert(error);
        }
    };

    useEffect(() => {
        setTokenIn(token0);
        setTokenOut(token1);
    }, [token0, token1]);

    return (
        <div className={styles.tabBody}>
            <InputNumberBox
                leftHeader={"From"}
                right={tokenIn ? tokenIn.symbol : ""}
                value={amountIn}
                onChange={(e) => onChangeIn(e.target.value)}
            />
            <div className={styles.swapIcon} onClick={() => rev()}>
                <MdSwapVert />
            </div>
            <InputNumberBox
                leftHeader={"To"}
                right={tokenOut ? tokenOut.symbol : ""}
                value={amountOut}
                onChange={(e) => onChangeOut(e.target.value)}
            />
            <div className={styles.bottomDiv}>
                <div className={styles.btn} onClick={() => onClickSwap()}>
                    Swap
                </div>
            </div>
        </div>
    );
}