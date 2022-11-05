import { useCallback, useEffect, useState } from "react";
import { TokenType, AmmType } from "../../hooks/useContract";
import styles from "./SelectTab.module.css";
import { BigNumber, ethers } from "ethers";
import InputNumberBox from "../InputBox/InputNumberBox";
import { MdAdd } from "react-icons/md";
import { validAmount } from "../../utils/validAmount";

type Props = {
    token0: TokenType | undefined;
    token1: TokenType | undefined;
    amm: AmmType | undefined;
    currentAccount: string | undefined;
    updateDetails: () => void;
};

/**
 * Provide component
 * @param param0 
 */
export default function Provide({
    token0,
    token1,
    amm,
    currentAccount,
    updateDetails,
}: Props) {

    const [amountOfToken0, setAmountOfToken0] = useState("");
    const [amountOfToken1, setAmountOfToken1] = useState("");
    const [activePool, setActivePool] = useState(true);

    /**
     * checkLiquidity function
     */
    const checkLiquidity = useCallback(async () => {
        if (!amm) return;
        try {
            // get total share
            const totalShare = await amm.contract.totalShare();

            if (totalShare.eq(BigNumber.from(0))) {
                setActivePool(false);
            } else {
                setActivePool(true);
            }
        } catch (error) {
            alert(error);
        }
    }, [amm]);

    /**
     * getProvideEstimate function
     * @param token 
     * @param amount 
     * @param setPairTokenAmount 
     * @returns 
     */
    const getProvideEstimate = async (
        token: TokenType,
        amount: string,
        setPairTokenAmount: (amount: string) => void
    ) => {
        if (!amm || !token0 || !token1) return;
        if (!activePool) return;
        if (!validAmount(amount)) return;

        try {
            const amountInWei = ethers.utils.parseEther(amount);
            // get Equivalent
            const pairAmountInWei = await amm.contract.getEquivalentToken(
                token.contract.address,
                amountInWei
            );

            const pairAmountInEther = ethers.utils.formatEther(pairAmountInWei);
            setPairTokenAmount(pairAmountInEther);
        } catch (error) {
            alert(error);
        }
    };

    /**
     * onChangeAmount function
     * @param amount 
     * @param token 
     * @param setAmount 
     * @param setPairTokenAmount 
     * @returns 
     */
    const onChangeAmount = (
        amount: string,
        token: TokenType | undefined,
        setAmount: (amount: string) => void,
        setPairTokenAmount: (amount: string) => void
    ) => {
        if (!token) return;
        setAmount(amount);
        getProvideEstimate(token, amount, setPairTokenAmount);
    };

    /**
     * onClickProvide function
     * @returns  
     */
    const onClickProvide = async () => {
        if (!currentAccount) {
            alert("connect wallet");
            return;
        }
        if (!amm || !token0 || !token1) return;
        if (!validAmount(amountOfToken0) || !validAmount(amountOfToken1)) {
            alert("Amount should be a valid number");
            return;
        }

        try {
            const amountToken0InWei = ethers.utils.parseEther(amountOfToken0);
            const amountToken1InWei = ethers.utils.parseEther(amountOfToken1);
            // approve
            const txn0 = await token0.contract.approve(
                amm.contract.address,
                amountToken0InWei
            );
            // approve
            const txn1 = await token1.contract.approve(
                amm.contract.address,
                amountToken1InWei
            );
    
            await txn0.wait();
            await txn1.wait();
            // provide
            const txn = await amm.contract.provide(
                token0.contract.address,
                amountToken0InWei,
                token1.contract.address,
                amountToken1InWei
            );

            await txn.wait();
            setAmountOfToken0("");
            setAmountOfToken1("");
            checkLiquidity(); 
            updateDetails(); 
            alert("Success");
        } catch (error) {
            alert(error);
        }
    };

    useEffect(() => {
        checkLiquidity();
    }, [checkLiquidity]);

    return (
        <div className={styles.tabBody}>
            <InputNumberBox
                leftHeader={"Amount of " + (token0 ? token0.symbol : "some token")}
                right={token0 ? token0.symbol : ""}
                value={amountOfToken0}
                onChange={(e) =>
                    onChangeAmount(
                        e.target.value,
                        token0,
                        setAmountOfToken0,
                        setAmountOfToken1
                    )
                }
            />
            <div className={styles.swapIcon}>
                <MdAdd />
            </div>
            <InputNumberBox
                leftHeader={"Amount of " + (token1 ? token1.symbol : "some token")}
                right={token1 ? token1.symbol : ""}
                value={amountOfToken1}
                onChange={(e) =>
                    onChangeAmount(
                        e.target.value,
                        token1,
                        setAmountOfToken1,
                        setAmountOfToken0
                    )
                }
            />
            {!activePool && (
                <div className={styles.error}>
                    Message: Empty pool. Set the initial conversion rate.
                </div>
            )}
            <div className={styles.bottomDiv}>
                <div className={styles.btn} onClick={() => onClickProvide()}>
                    Provide
                </div>
            </div>
        </div>
    );
}