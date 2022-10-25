import { useContext, useEffect, useState } from "react";
import { Box, Container, Typography } from "@mui/material";
import { formatUnits } from "@ethersproject/units";

import { useStakingContract, useTokenContract } from "../ConnectivityAss/hooks";
import { AppContext } from "../utils";
import Loading from "../loading";

function Reward() {
  const { account, signer } = useContext(AppContext);

  const stakingContract = useStakingContract(signer);
  const tokenContract = useTokenContract(signer);

  const [balance, setbalance] = useState(0);
  const [realTimeReward, setRealTimeReward] = useState(0);
  const [loading, setloading] = useState(false);

  const init = async () => {
    try {
      const balance = await tokenContract.balanceOf(account);
      console.log(+formatUnits(balance.toString(),18),"blc")
      const realReward = await stakingContract.realtimeReward(account);

      setbalance(+formatUnits(balance.toString(), 18));
      setRealTimeReward(+formatUnits(realReward.toString(), 18));
      setloading(false);
    } catch (error) {
      console.log(error);
      setloading(false);
    }
  };
  useEffect(() => {
    // if (account) {
    //   setInterval(() => {
        init();
    //   }, 6000);
    // }
  }, [account]);

  //

  return (
    <>
      <Loading loading={loading} />
      <Container>
        {account ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexDirection={{ xs: "column", sm: "row" }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                border: "1px transparent",
                backgroundImage:
                  " linear-gradient(#255946, #255946  ),linear-gradient(94.21deg, #28a745 7.52%, #F7C35F 13.59%, #668056 89.08%, #fff 110.16%)",
                backgroundOrigin: "border-box",
                backgroundClip: "content-box, border-box",
                padding: "4px",
                maxWidth: "400px",
                width: "100%",
              }}
              mr={{ xs: 0, sm: 6 }}
            >
              <Box
                display="flex"
                alignItems="center"
                bgcolor="#fff"
                flexDirection="column"
                py={2}
                // borderBottom="5px solid #F7C35F"
              >
                <Typography
                  fontWeight="700"
                  fontSize="15px"
                  display="flex"
                  alignItems="center"
                  textTransform="uppercase"
                  color="#9a9898"
                  fontFamily="Expletus Sans"
                >
                  Your Wallet Balance
                </Typography>
                <Box mt={3} display="flex" alignItems="center">
                  <Typography
                    fontWeight="600"
                    fontSize={{ xs: "17px", md: "26px" }}
                    lineHeight="150%"
                    display="flex"
                    alignItems="center"
                    color="#255946"
                    fontFamily="Expletus Sans"
                  >
                    {balance}
                  </Typography>
                  <Typography
                    ml={2}
                    fontFamily="Expletus Sans"
                    fontWeight="700"
                    fontSize={{ xs: "16px", md: "24px" }}
                    sx={{
                      color: "#F7C35F",
                      letterSpacing: "1px",
                      textTransform: "uppercase",
                    }}
                  >
                    ASY
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                border: "1px transparent",
                backgroundImage:
                  " linear-gradient(#255946, #255946  ),linear-gradient(94.21deg, #28a745 7.52%, #F7C35F 13.59%, #668056 89.08%, #fff 110.16%)",
                backgroundOrigin: "border-box",
                backgroundClip: "content-box, border-box",
                padding: "4px",
                maxWidth: "400px",
                width: "100%",
                mt: { xs: 4, sm: 0 },
              }}
            >
              <Box
                width="100%"
                display="flex"
                alignItems="center"
                bgcolor="#fff"
                flexDirection="column"
                py={2}
                // borderBottom="5px solid #F7C35F"
              >
                <Typography
                  fontWeight="700"
                  fontSize="15px"
                  display="flex"
                  alignItems="center"
                  textTransform="uppercase"
                  color="#9a9898"
                  fontFamily="Expletus Sans"
                >
                  Your Estimated Reward
                </Typography>

                <Box mt={3} display="flex" alignItems="center">
                  <Typography
                    fontWeight="600"
                    fontSize={{ xs: "17px", md: "26px" }}
                    lineHeight="150%"
                    display="flex"
                    alignItems="center"
                    color="#255946"
                    fontFamily="Expletus Sans"
                  >
                    {realTimeReward.toFixed(4)}
                  </Typography>
                  <Typography
                    ml={2}
                    fontFamily="Expletus Sans"
                    fontWeight="700"
                    fontSize={{ xs: "16px", md: "24px" }}
                    sx={{
                      color: "#F7C35F",
                      letterSpacing: "1px",
                      textTransform: "uppercase",
                    }}
                  >
                    ASY
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        ) : null}
      </Container>
    </>
  );
}

export default Reward;
