import React, { useContext, useEffect, useState } from "react";
import "./App.css";
import { AppContext } from "./utils";
import AOS from "aos";
import { Box } from "@mui/system";
import Web3 from "web3";
import bgLeaves from "./images/bgLeaves.png";
import NetworkChange from './networkSwitch'
import Header from "./components/Header";
import Staking from "./components/staking";

const web3 = new Web3(
  Web3.givenProvider
    ? Web3.givenProvider
    : "https://data-seed-prebsc-1-s1.binance.org:8545/"
);
function App() {
  const [switchNetwork, setswitchNetwork] = useState(false);
  const { connect, account } = useContext(AppContext);

  let chain = async () => {
    try {
      if (window.web3) {
        const chainid = await web3.eth.getChainId();
        if (+chainid !== 56) {
          setswitchNetwork(true);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (!account) {
      connect();
    }
    chain();
  }, []);

  useEffect(() => {
    AOS.init({
      duration: 2000,
    });
  });
  return (
    <Box
      sx={{
        backgroundImage: `url(${bgLeaves})`,
        backgroundSize: "100% 30%",
        backgroundPosition: "cener",
        zIndex: 1,
      }}
    >
      <NetworkChange open={switchNetwork} setOpen={setswitchNetwork} />
      <Header />
      <Staking />
    </Box>
  );
}

export default App;
