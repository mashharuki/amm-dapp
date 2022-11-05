import { useState } from "react";
import styles from "./Container.module.css";

type Props = {
  currentAccount: string | undefined;
};

/**
 * Container Component 
 * @param param0 
 */
export default function Container({ currentAccount }: Props) {
    const [activeTab, setActiveTab] = useState("Swap");

    const changeTab = (tab: string) => {
        setActiveTab(tab);
    };

    return (
        <div className={styles.mainBody}>
          <div className={styles.centerContent}>
            <div className={styles.selectTab}>
              <div
                className={
                  styles.tabStyle +
                  " " +
                  (activeTab === "Swap" ? styles.activeTab : "")
                }
                onClick={() => changeTab("Swap")}
              >
                Swap
              </div>
              <div
                className={
                  styles.tabStyle +
                  " " +
                  (activeTab === "Provide" ? styles.activeTab : "")
                }
                onClick={() => changeTab("Provide")}
              >
                Provide
              </div>
              <div
                className={
                  styles.tabStyle +
                  " " +
                  (activeTab === "Withdraw" ? styles.activeTab : "")
                }
                onClick={() => changeTab("Withdraw")}
              >
                Withdraw
              </div>
              <div
                className={
                  styles.tabStyle +
                  " " +
                  (activeTab === "Faucet" ? styles.activeTab : "")
                }
                onClick={() => changeTab("Faucet")}
              >
                Faucet
              </div>
            </div>
            {activeTab === "Swap" && <div>swap</div>}
            {activeTab === "Provide" && <div>provide</div>}
            {activeTab === "Withdraw" && <div>withdraw</div>}
            {activeTab === "Faucet" && <div>faucet</div>}
          </div>
          details
        </div>
    );
}