import {
  Button,
  Container,
  InputBase,
  useMediaQuery,
  Box,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Divider,
  Typography,
  Grid,
} from "@mui/material";
import moment from "moment";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  formatUnits,
  parseUnits,
  formatEther,
  parseEther,
  commify,
} from "@ethersproject/units";

import {
  useStakingContract,
  useTokenContract,
  usePancakePairContract,
} from "../ConnectivityAss/hooks";
import { AppContext } from "../utils";
import Loading from "../loading";
import { stakingAddress } from "../ConnectivityAss/environment";
import UnstakeModal from "./UnstakeModal";
import Reward from "./Reward";

const ButtonofDays = ({ children, ...props }) => {
  return (
    <Button
      {...props}
      sx={{
        background: props.bg,
        border: "1px solid #28a745",
        boxShadow: "#28a745 0px 0px 20px",
        fontSize: { xs: "10px", sm: "15px" },
        borderRadius: "10px",
        width: { xs: "70px", sm: "100px" },
        height: { xs: "25px", sm: "40px" },
        marginTop: "10px",
        marginRight: { xs: "10px", sm: "0px" },
        color: "#ffffff",
        textTransform: "capitalize",
        fontWeight: "500",
        fontFamily: "Expletus Sans",
      }}
    >
      {children}
    </Button>
  );
};

function Staking() {
  const matches = useMediaQuery("(max-width:750px)");

  const { account, signer, connect } = useContext(AppContext);

  const stakingContract = useStakingContract(signer);
  const tokenContract = useTokenContract(signer);
  // const pancakePairContract = usePancakePairContract(signer);

  const [amount, setamount] = useState("");
  // const [duration, setduration] = useState("");
  const [loading, setloading] = useState(false);
  const [planIndex, setplanIndex] = useState(0);
  const [currentStaked, setcurrentStaked] = useState(0);
  const [bonus, setbonus] = useState(0);
  const [stakeDetails, setstakeDetails] = useState([]);
  const [balance, setbalance] = useState(0);
  const [TotalStakers, setTotalStakers] = useState(0);
  const [totalStaked, settotalStaked] = useState(0);
  const [totalUnStaked, settotalUnStaked] = useState(0);
  const [totalWithDrawn, settotalWithDrawn] = useState(0);
  const [unstakeModal, setunstakeModal] = useState(false);
  const [unstakeIndex, setunstakeIndex] = useState("");
  const [getAllowance, setGetAllowance] = useState("");
  // const [reserveToken, setResrveToken] = useState("");

  const initInfo = async () => {
    try {
      // const { _reserve0, _reserve1 } = await pancakePairContract.getReserves();
      // let firstReserveValue = +formatUnits(_reserve0.toString(), 18);
      // let secondReserveValue = +formatUnits(_reserve1.toString(), 18);

      // let totalReserve = firstReserveValue / secondReserveValue;
      // setResrveToken(+totalReserve);

      const totalStakers = await stakingContract.totalStakers();
      const totalWithdrawan = await stakingContract.totalWithdrawanToken();
      const totalStakedAmount = await stakingContract.totalStakedToken();
      const totalUnStakedAmount = await stakingContract.totalUnStakedToken();
      const totalClaimedRewardToken =
        await stakingContract.totalClaimedRewardToken();

      let sumOfRewardandWithdraw =
        +formatUnits(totalWithdrawan.toString(), 18) +
        +formatUnits(totalClaimedRewardToken.toString(), 18);

      setTotalStakers(+totalStakers);
      settotalStaked(formatUnits(totalStakedAmount.toString(), 18));
      settotalWithDrawn(sumOfRewardandWithdraw);
      settotalUnStaked(formatUnits(totalUnStakedAmount.toString(), 18));
    } catch (error) {
      console.log(error, "error");
    }
  };
  useEffect(() => {
    initInfo();
  }, []);

  const init = async () => {
    try {
      const { stakeCount } = await stakingContract.Stakers(account);
      const balance = await tokenContract.balanceOf(account);

      setbalance(formatUnits(balance.toString(), 18));
      if (+stakeCount > 0) {
        let arr = [];
        let currentstaked = 0;
        for (let i = 0; i < +stakeCount; i++) {
          setloading(true);
          const {
            amount,
            reward,
            withdrawan,
            unstaked,
            staketime,
            withdrawtime,
          } = await stakingContract.stakersRecord(account, i.toString());
          const obj = {
            time: +withdrawtime,
            amount: +formatUnits(amount.toString(), 18),
            reward: +formatUnits(reward.toString(), 18),
            withdrawan: withdrawan,
            unstaked: unstaked,
          };
          if (!unstaked && !withdrawan) {
            currentstaked += +formatUnits(amount.toString(), 18);
          }
          arr.push(obj);
        }
        setcurrentStaked(currentstaked);
        setstakeDetails([...arr]);
        setloading(false);
      }
      setloading(false);
    } catch (error) {
      console.log(error);
      setloading(false);
    }
  };
  useEffect(() => {
    if (account) {
      init();
    }
  }, [account]);

  useEffect(async () => {
    if (account) {
      let allowance = await tokenContract.allowance(account, stakingAddress)
      console.log(+formatUnits(allowance.toString(),18), "allaow");
      setGetAllowance(+formatUnits(allowance.toString(),18));
    }
  }, [account]);
  const approveHandler = async () => {
    if (!account) {
      toast.error("Error! Please connect your wallet.");
    } else if (!amount) {
      toast.error("Error! Please enter amount.");
    } else {
      try {
        setloading(true);

        // let allowance = await tokenContract.allowance(account, stakingAddress);
        let getAmount = parseUnits(amount.toString(), 18);

        // let maxAmount = getAmount * reserveToken;

        // console.log(formatUnits(maxAmount.toString(), 18), "max");
        let TOKENS = 250 / getAmount;

        if (+formatUnits(getAmount.toString(), 18) < 250) {
          toast.error(`You can stake minimum ${+TOKENS.toFixed(4)}`);
        } else {
          const tx = await tokenContract.approve(
            stakingAddress,
            getAmount.toString()
          );
          await tx.wait();
          toast.success("Success! Approved Confirmed.");
        }

        setloading(false);
      } catch (err) {
        console.log(err, "error for gas");
        if (err?.data?.message) {
          toast.error(err?.data?.message);
        } else {
          toast.error(err?.message);
        }
        setloading(false);
      }
    }
  };

  const stakeHandler = async () => {
    if (!account) {
      toast.error("Error! Please connect your wallet.");
    } else if (!amount) {
      toast.error("Error! Please enter amount.");
    } else {
      try {
        setloading(true);
        // let allowance = await tokenContract.allowance(account, stakingAddress);
        // let getAmount = parseUnits(amount.toString(), 18);

        // if (+allowance < +getAmount) {
        //   const tx = await tokenContract.approve(
        //     stakingAddress,
        //     parseUnits(balance.toString(), 18)
        //   );
        //   await tx.wait();
        // }
        const tx1 = await stakingContract.stake(
          parseUnits(amount, 18),
          planIndex.toString()
        );
        await tx1.wait();
        toast.success("Success! Transaction Confirmed.");
        init();
        setloading(false);
        init();
      } catch (err) {
        console.log(err, "error for staking");
        if (err?.data?.message) {
          toast.error(err?.data?.message);
        } else {
          toast.error(err?.message);
        }
        setloading(false);
      }
    }
  };
  useEffect(() => {
    const init = async () => {
      try {
        const percent = await stakingContract.percentDivider();
        console.log(+percent, "per");
        const bonus = await stakingContract.Bonus(planIndex.toString());
        let bonusToken = (+bonus / +percent) * +amount;
        console.log(bonusToken, "bonus token");

        setbonus(+amount + bonusToken);
        console.log(+bonus, "bbbb");
      } catch (error) {
        console.log(error);
      }
    };
    init();
  }, [amount, planIndex]);

  const claimHandler = async (index) => {
    try {
      setloading(true);
      console.log(index,"mk")
      const tx = await stakingContract.withdraw(index);
      await tx.wait();
      toast.success("Success! Amount successfully claimed.");
      init();
      setloading(false);
    } catch (error) {
      if (error?.data?.message) {
        toast.error(error?.data?.message,"error ");
      } else {
        toast.error(error?.message);
      }
      setloading(false);
    }
  };

  return (
    <>
      <Box py={4}>
        <Loading loading={loading} />
        <UnstakeModal
          open={unstakeModal}
          setOpen={setunstakeModal}
          unstakeIndex={unstakeIndex}
        />
        <Reward />
        <Container>
          <Box display="flex" alignItems="center" flexDirection="column">
            <Box
              mt={5}
              style={{
                fontSize: matches ? "30px" : "50px",
                // fontFamily: "Expletus Sans",
                fontFamily: "Handlee, cursive",
                fontWeight: "700",
                outlineColor: "#f8450b",
                outlineOffset: "0px",
                outlineStyle: "none",
                outlineWidth: "3px",
                color: "#fff",
                textAlign: "center",
                letterSpacing: "5px",
                textTransform: "uppercase",
                // textShadow: "3px 5px 0 #000",
              }}
            >
              Staking Dashboard
            </Box>
            <Divider
              style={{
                marginBottom: "40px",
                marginTop: "10px",
                width: "180px",
                height: "2px",
                background: "#ffffff",
                boxShadow:
                  "#F7C35F 0px 12px 30px,#F7C35F 0px -12px 30px, #F7C35F 0px 4px 6px, #F7C35F 0px 12px 13px, #F7C35F 0px -3px 5px",
              }}
            />
          </Box>

          <Grid container spacing={5} sx={{ marginTop: "5px" }}>
            <Grid item xs={12} md={7}>
              <Box
                style={{
                  display: "flex",
                  flexDirection: "column",
                  border: "1px transparent",
                  backgroundImage:
                    " linear-gradient(#255946, #255946  ),linear-gradient(94.21deg, #28a745 7.52%, #F7C35F 13.59%, #668056 89.08%, #fff 110.16%)",
                  backgroundOrigin: "border-box",
                  backgroundClip: "content-box, border-box",
                  padding: "4px",
                }}
                height="100%"
                // filter="blur(52px)"
                // zIndex="10"
                // px={matches ? 2 : 3}
                // pt={2}
                // pb={5}
                // mt={2}
                // className="shadow"
                // borderRadius="20px"
              >
                <Box filter="blur(52px)" p={matches ? 2 : 3} textAlign="center">
                  <Box
                    display="flex"
                    alignItems="center"
                    mt={3}
                    mb={1}
                    boxShadow=" #668056 0px 0px 5px 3px"
                    style={{
                      borderRadius: "10px",
                    }}
                    width="100%"
                    pb={1}
                  >
                    <InputBase
                      style={{
                        color: "#fff",
                        fontFamily: "Expletus Sans",
                        fontWeight: 400,
                        fontSize: 17,
                        marginTop: 10,
                        width: "100%",
                        paddingRight: "15px",
                        backgroundColor: "transparent",
                        paddingLeft: "15px",
                      }}
                      fullWidth
                      type="number"
                      id="standard-basic"
                      variant="standard"
                      placeholder="Enter Stake Amount"
                      value={amount}
                      onChange={(e) => setamount(e.target.value)}
                    />
                    <Box
                      color="#802804"
                      fontFamily="Expletus Sans"
                      fontWeight="700"
                      fontSize="20px"
                      zIndex={2}
                      mr={2}
                      pt={1}
                      style={{
                        cursor: "pointer",
                        outlineColor: "#f8450b",
                        outlineOffset: "0px",
                        outlineStyle: "none",
                        outlineWidth: "3px",
                        color: "#F7C35F",
                        textAlign: "center",
                        letterSpacing: "5px",
                        textTransform: "uppercase",
                        textShadow: "2px 2px 0 #000",
                      }}
                      onClick={() => setamount(balance)}
                    >
                      Max
                    </Box>
                  </Box>

                  <Box alignSelf="center" mt={1}>
                    <i
                      style={{ color: "#fff", fontSize: "20px" }}
                      className="far fa-plus"
                    ></i>
                  </Box>

                  <Box
                    mt={1}
                    py={2}
                    px={1}
                    display="flex"
                    flexDirection="column"
                    borderBottom="5px solid #F7C35F"
                    // boxShadow=" rgba(0, 0, 0, 0.24) 0px 0px 5px 3px"
                    boxShadow=" #668056 0px 0px 5px 3px"
                    style={{
                      borderRadius: "10px",
                    }}
                  >
                    <Box
                      alignSelf="center"
                      fontSize="18px"
                      fontFamily="Expletus Sans"
                      color="#fff"
                      mb={1}
                    >
                      Lock Tokens For
                    </Box>
                    <Box alignSelf="center">
                      <Divider
                        style={{
                          marginBottom: "30px",
                          marginTop: "10px",
                          width: "180px",
                          height: "2px",
                          background: "#ffffff",
                          boxShadow:
                            "#0CCBFF 0px 12px 30px,#F7C35F 0px -12px 30px, #F7C35F 0px 4px 6px, #F7C35F 0px 12px 13px, #F7C35F 0px -3px 5px",
                        }}
                      />
                    </Box>
                    <Box
                      display="flex"
                      justifyContent={{ xs: "center", md: "space-between" }}
                      alignItems="center"
                      flexWrap="wrap"
                    >
                      <ButtonofDays
                        bg={planIndex === 0 ? "transparent" : "#F7C35F"}
                        onClick={() => setplanIndex(0)}
                      >
                        1 month
                      </ButtonofDays>

                      <ButtonofDays
                        bg={planIndex === 1 ? "transparent" : "#F7C35F"}
                        onClick={() => setplanIndex(1)}
                      >
                        2 months
                      </ButtonofDays>
                      <ButtonofDays
                        bg={planIndex === 2 ? "transparent" : "#F7C35F"}
                        onClick={() => setplanIndex(2)}
                      >
                        3 months
                      </ButtonofDays>
                      <ButtonofDays
                        bg={planIndex === 3 ? "transparent" : "#F7C35F"}
                        onClick={() => setplanIndex(3)}
                      >
                        6 months
                      </ButtonofDays>
                      <ButtonofDays
                        bg={planIndex === 4 ? "transparent" : "#F7C35F"}
                        onClick={() => setplanIndex(4)}
                      >
                        1 year
                      </ButtonofDays>
                    </Box>
                  </Box>

                  <Box alignSelf="center" mt={2}>
                    <i
                      style={{ color: "#fff", fontSize: "22px" }}
                      className="far fa-arrow-down"
                    ></i>
                  </Box>

                  <Box
                    my={2}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    // boxShadow=" rgba(0, 0, 0, 0.24) 0px 0px 5px 3px"
                    boxShadow=" #668056 0px 0px 5px 3px"
                    style={{
                      borderRadius: "10px",
                    }}
                    width="100%"
                    pb={1}
                  >
                    <InputBase
                      style={{
                        color: "#fff",
                        fontFamily: "Expletus Sans",
                        fontWeight: 400,
                        fontSize: 17,
                        marginTop: 10,
                        width: "100%",
                        paddingRight: "15px",
                        backgroundColor: "transparent",
                        paddingLeft: "15px",
                      }}
                      readOnly
                      fullWidth
                      type="text"
                      id="standard-basic"
                      variant="standard"
                      placeholder="0"
                      value={+bonus}
                    />
                    <Box
                      fontFamily="Expletus Sans"
                      fontWeight="700"
                      fontSize="20px"
                      mr={2}
                      pt={1}
                      style={{
                        cursor: "pointer",
                        outlineColor: "#f8450b",
                        outlineOffset: "0px",
                        outlineStyle: "none",
                        outlineWidth: "3px",
                        color: "#F7C35F",
                        textAlign: "center",
                        letterSpacing: "5px",
                        textTransform: "uppercase",
                        textShadow: "2px 2px 0 #000",
                      }}
                    >
                      $ASY
                    </Box>
                  </Box>

                  <Box
                    display="flex"
                    alignItem="center"
                    justifyContent="flex-end"
                    sx={{
                      color: "#F7C35F",
                      letterSpacing: "5px",
                      // textShadow: "2px 2px 0 #000",
                    }}
                  >
                    <Typography
                      mr={5}
                      fontFamily="Expletus Sans"
                      fontWeight="700"
                      fontSize="20px"
                    >
                      Est. APY
                    </Typography>
                    <Typography
                      fontFamily="Expletus Sans"
                      fontWeight="700"
                      fontSize="20px"
                      mr={1}
                    >
                      {planIndex === 0
                        ? "6%"
                        : planIndex === 1
                        ? "12%"
                        : planIndex === 2
                        ? "18%"
                        : planIndex === 3
                        ? "24%"
                        : "30%"}
                    </Typography>
                  </Box>

                  <Box
                    mt={5}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                  >
                    {account ? (
                      <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                      >
                        {console.log(+getAllowance, "getallowance....")}
                        <Button
                          disabled={+getAllowance === 0 ? false : true}
                          sx={{
                            width: "130px",
                            height: "42px",
                            background: "#F7C35F",
                            border: "1px solid #28a745",
                            boxShadow: "#28a745 0px 0px 20px",
                            borderRadius: "10px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            color: "#fff",
                            fontWeight: "600",
                            fontSize: "18px",
                            marginRight: "30px",
                            textTransform: "capitalize",
                            fontFamily: "Expletus Sans",
                            "&: hover": {
                              background: "transparent",
                            },
                          }}
                          onClick={() => approveHandler()}
                        >
                          approve
                        </Button>
                        <Button
                          disabled={+getAllowance > 0 ? false : true}
                          sx={{
                            width: "130px",
                            height: "42px",
                            background: "#F7C35F",
                            border: "1px solid #28a745",
                            boxShadow: "#28a745 0px 0px 20px",
                            borderRadius: "10px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            color: "#fff",
                            fontWeight: "600",
                            fontSize: "18px",
                            textTransform: "capitalize",
                            fontFamily: "Expletus Sans",
                            "&: hover": {
                              background: "transparent",
                            },
                          }}
                          onClick={() => stakeHandler()}
                        >
                          Stake
                        </Button>
                      </Box>
                    ) : (
                      <Button
                        sx={{
                          width: "130px",
                          height: "42px",
                          background: "#F7C35F",
                          border: "1px solid #28a745",
                          boxShadow: "#28a745 0px 0px 20px",
                          borderRadius: "10px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          color: "#fff",
                          fontWeight: "600",
                          fontSize: "18px",
                          textTransform: "capitalize",
                          fontFamily: "Expletus Sans",
                          "&: hover": {
                            background: "transparent",
                          },
                        }}
                        onClick={() => connect()}
                      >
                        Connect
                      </Button>
                    )}
                  </Box>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={5}>
              <Box
                style={{
                  display: "flex",
                  flexDirection: "column",
                  border: "1px transparent",
                  backgroundImage:
                    " linear-gradient(#255946, #255946  ),linear-gradient(94.21deg, #28a745 7.52%, #F7C35F 13.59%, #668056 89.08%, #fff 110.16%)",
                  backgroundOrigin: "border-box",
                  backgroundClip: "content-box, border-box",
                  padding: "4px",
                  overflow: "hidden",
                }}
                height="100%"
              >
                <Box filter="blur(52px)" p={matches ? 2 : 3} textAlign="center">
                  <div data-aos="fade-right">
                    <Box
                      width="100%"
                      display="flex"
                      alignItems="center"
                      bgcolor="#fff"
                      flexDirection="column"
                      borderBottom="5px solid #F7C35F"
                      py={2}
                      // style={{
                      //   boxShadow: "#668056 0px 0px 20px",
                      // }}
                      // borderRadius="10px"
                    >
                      <Typography
                        fontWeight="700"
                        fontSize="13px"
                        display="flex"
                        alignItems="center"
                        textTransform="uppercase"
                        color="#9a9898"
                        fontFamily="Expletus Sans"
                      >
                        Total Stakers
                      </Typography>

                      <Typography
                        fontWeight="600"
                        fontSize={{ xs: "17px", md: "26px" }}
                        lineHeight="150%"
                        display="flex"
                        alignItems="center"
                        color="#255946"
                        fontFamily="Expletus Sans"
                      >
                        {TotalStakers}
                      </Typography>
                    </Box>
                  </div>

                  <div data-aos="fade-left">
                    <Box
                      mt={3}
                      width="100%"
                      display="flex"
                      alignItems="center"
                      bgcolor="#fff"
                      flexDirection="column"
                      borderBottom="5px solid #F7C35F"
                      py={2}
                    >
                      <Typography
                        fontWeight="700"
                        fontSize="13px"
                        display="flex"
                        alignItems="center"
                        textTransform="uppercase"
                        color="#9a9898"
                        fontFamily="Expletus Sans"
                      >
                        Total Staked
                      </Typography>

                      <Typography
                        fontWeight="600"
                        fontSize={{ xs: "17px", md: "26px" }}
                        lineHeight="150%"
                        display="flex"
                        alignItems="center"
                        color="#255946"
                        fontFamily="Expletus Sans"
                      >
                        {parseFloat(totalStaked).toFixed(2)}
                      </Typography>
                    </Box>
                  </div>

                  <div data-aos="fade-right">
                    <Box
                      mt={3}
                      width="100%"
                      display="flex"
                      alignItems="center"
                      bgcolor="#fff"
                      flexDirection="column"
                      borderBottom="5px solid #F7C35F"
                      py={2}
                    >
                      <Typography
                        fontWeight="700"
                        fontSize="13px"
                        display="flex"
                        alignItems="center"
                        textTransform="uppercase"
                        color="#9a9898"
                        fontFamily="Expletus Sans"
                      >
                        Total Withdrawn
                      </Typography>

                      <Typography
                        fontWeight="600"
                        fontSize={{ xs: "17px", md: "26px" }}
                        lineHeight="150%"
                        display="flex"
                        alignItems="center"
                        color="#255946"
                        fontFamily="Expletus Sans"
                      >
                        {parseFloat(totalWithDrawn).toFixed(2)}
                      </Typography>
                    </Box>
                  </div>

                  <div data-aos="fade-left">
                    <Box
                      mt={3}
                      width="100%"
                      display="flex"
                      alignItems="center"
                      bgcolor="#fff"
                      flexDirection="column"
                      borderBottom="5px solid #F7C35F"
                      py={2}
                    >
                      <Typography
                        fontWeight="700"
                        fontSize="13px"
                        display="flex"
                        alignItems="center"
                        textTransform="uppercase"
                        color="#9a9898"
                        fontFamily="Expletus Sans"
                      >
                        Total Unstaked
                      </Typography>

                      <Typography
                        fontWeight="600"
                        fontSize={{ xs: "17px", md: "26px" }}
                        lineHeight="150%"
                        display="flex"
                        alignItems="center"
                        color="#255946"
                        fontFamily="Expletus Sans"
                      >
                        {parseFloat(totalUnStaked).toFixed(2)}
                      </Typography>
                    </Box>
                  </div>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
        <Container maxWidth="lg">
          <Box display="flex" alignItems="center" flexDirection="column">
            <Box
              mt={10}
              style={{
                fontSize: matches ? "30px" : "50px",
                // fontFamily: "Expletus Sans",
                fontFamily: "Handlee, cursive",
                fontWeight: "700",
                outlineColor: "#f8450b",
                outlineOffset: "0px",
                outlineStyle: "none",
                outlineWidth: "3px",
                color: "#fff",
                textAlign: "center",
                letterSpacing: "5px",
                textTransform: "uppercase",
                // textShadow: "3px 5px 0 #000",
              }}
            >
              Your Stakes
            </Box>
            <Divider
              style={{
                marginBottom: "40px",
                marginTop: "10px",
                width: "180px",
                height: "2px",
                background: "#ffffff",
                boxShadow:
                  "#F7C35F 0px 12px 30px,#F7C35F 0px -12px 30px, #F7C35F 0px 4px 6px, #F7C35F 0px 12px 13px, #F7C35F 0px -3px 5px",
              }}
            />

            <TableContainer
              // borderTop="1px solid #F7C35F"
              // borderBottom="10px solid #F7C35F"
              // borderLeft="1px solid #668056"
              // borderRight="1px solid #668056"
              style={{
                display: "flex",
                flexDirection: "column",
                background: "#255946",
                backgroundImage:
                  " linear-gradient(#255946, #255946  ),linear-gradient(94.21deg, #28a745 7.52%, #F7C35F 13.59%, #668056 89.08%, #fff 110.16%)",
                backgroundOrigin: "border-box",
                backgroundClip: "content-box, border-box",
                padding: "4px",
              }}
              filter="blur(52px)"
              zIndex="10"
              pt={2}
              pb={5}
              mt={2}
              className="shadow"
              // borderRadius="20px"
              component={Box}
              color="#fff"
            >
              <Table
                aria-label="simple table"
                style={{
                  borderRadius: "10px",
                  marginTop: "0px",
                }}
                color="#fff"
              >
                <TableHead color="#fff">
                  <TableRow style={{ color: "#fff" }}>
                    <TableCell
                      align="center"
                      style={{
                        color: "#fff",
                        fontSize: matches ? "14px" : "18px",
                        fontFamily: "Expletus Sans",
                      }}
                    >
                      AMOUNT{" "}
                    </TableCell>
                    <TableCell
                      align="center"
                      style={{
                        color: "#fff",
                        fontSize: matches ? "14px" : "18px",
                        fontFamily: "Expletus Sans",
                      }}
                    >
                      {" "}
                      WITHDRAWAL TIME
                    </TableCell>
                    <TableCell
                      align="center"
                      style={{
                        color: "#fff",
                        fontSize: matches ? "14px" : "18px",
                        fontFamily: "Expletus Sans",
                      }}
                    >
                      UNSTAKE{" "}
                    </TableCell>
                    <TableCell
                      align="center"
                      style={{
                        color: "#fff",
                        fontSize: matches ? "14px" : "18px",
                        fontFamily: "Expletus Sans",
                      }}
                    >
                      {" "}
                      WITHDRAWAL
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stakeDetails.length > 0 ? (
                    stakeDetails.map(
                      ({ time, amount, withdrawan, unstaked }, index) => (
                        <TableRow
                          key={index}
                          style={{ borderBottom: "1px solid red" }}
                        >
                          <TableCell
                            align="center"
                            style={{
                              color: "#fff",
                              fontSize: matches ? "14px" : "18px",
                              fontFamily: "Expletus Sans",
                            }}
                          >
                            {amount}
                          </TableCell>
                          <TableCell
                            align="center"
                            style={{
                              color: "#fff",
                              fontSize: matches ? "14px" : "18px",
                              fontFamily: "Expletus Sans",
                            }}
                          >
                            {moment.unix(time).format("LLL")}
                          </TableCell>
                          <TableCell
                            align="center"
                            style={{
                              color: "#fff",
                              fontSize: matches ? "14px" : "18px",
                              fontFamily: "Expletus Sans",
                            }}
                          >
                            <button
                              onClick={() => {
                                setunstakeModal(true);
                                setunstakeIndex(index.toString());
                              }}
                              disabled={
                                +time < +moment().format("X") ||
                                withdrawan ||
                                unstaked
                                  ? true
                                  : false
                              }
                              style={{
                                background:
                                  +time < +moment().format("X") ||
                                  withdrawan ||
                                  unstaked
                                    ? "#668056"
                                    : "#F7C35F",
                                border: "1px solid #28a745",
                                boxShadow: "#28a745 0px 0px 20px",
                                fontSize: "16px",
                                borderRadius: "6px",
                                width: "176px",
                                height: "45px",
                                textTransform: "capitalize",
                                fontWeight: "500",
                                fontFamily: "Expletus Sans",
                                borderStyle: "none",
                                color:
                                  +time < +moment().format("X") ||
                                  withdrawan ||
                                  unstaked
                                    ? "gray"
                                    : "#ffffff",
                                fontSize: "16px",
                                padding: "10px 35px",
                                cursor:
                                  +time < +moment().format("X") ||
                                  withdrawan ||
                                  unstaked
                                    ? "no-drop"
                                    : "pointer",
                              }}
                            >
                              Unstake
                            </button>
                          </TableCell>
                          <TableCell
                            align="center"
                            style={{
                              color: "#fff",
                            }}
                          >
                            <button
                              onClick={() => claimHandler(index.toString())}
                              disabled={
                                +time > +moment().format("X") ||
                                withdrawan ||
                                unstaked
                                  ? true
                                  : false
                              }
                              style={{
                                background:
                                  +time > +moment().format("X") ||
                                  withdrawan ||
                                  unstaked
                                    ? "#668056"
                                    : "#F7C35F",
                                border: "1px solid #28a745",
                                boxShadow: "#28a745 0px 0px 20px",
                                fontSize: "16px",
                                borderRadius: "10px",
                                width: "176px",
                                height: "45px",
                                textTransform: "capitalize",
                                fontWeight: "500",
                                fontFamily: "Expletus Sans",
                                borderStyle: "none",
                                // borderBottom: "5px solid #000000",
                                color:
                                  +time > +moment().format("X") ||
                                  withdrawan ||
                                  unstaked
                                    ? "gray"
                                    : "#ffffff",
                                padding: "10px 35px",
                                cursor:
                                  +time > +moment().format("X") ||
                                  withdrawan ||
                                  unstaked
                                    ? "no-drop"
                                    : "pointer",
                              }}
                            >
                              Withdraw
                            </button>
                          </TableCell>
                        </TableRow>
                      )
                    )
                  ) : loading ? (
                    loading
                  ) : (
                    <TableRow>
                      <TableCell
                        align="center"
                        style={{
                          color: "#fff",
                          fontSize: matches ? "14px" : "18px",
                          fontFamily: "Expletus Sans",
                          fontFamily: "Expletus Sans",
                        }}
                        colSpan={5}
                      >
                        You have no staking history yet
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Container>
      </Box>
    </>
  );
}

export default Staking;
