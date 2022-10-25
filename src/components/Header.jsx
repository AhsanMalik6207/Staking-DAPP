import React, { useContext } from "react";
import Container from "@mui/material/Container";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Button } from "@mui/material";
import Box from "@mui/material/Box";
// import Hidden from "@mui/material/Hidden";
// import SwipeableDrawer from "@mui/material/SwipeableDrawer";
// import List from "@mui/material/List";
// import ListItem from "@mui/material/ListItem";
// import { makeStyles } from "@mui/styles";
// import MenuIcon from "@mui/icons-material/Menu";
// import clsx from "clsx";

import { AppContext } from "../utils";

// const useStyles = makeStyles({
//   list: {
//     width: 250,
//   },
//   fullList: {
//     width: "auto",
//     alignItems: "center",
//   },
//   paper: {
//     background: "#255946 !important",
//     justifyContent: "center",
//   },
//   hover: {
//     "&:hover": {
//       color: "#FFB800",
//     },
//   },
// });

const StyleButton = ({ children, ...props }) => {
  return (
    <Button
      {...props}
      sx={{
        width: { xs: "85px", sm: "130px" },
        height: { xs: "35px", sm: "42px" },
        background: "#F7C35F",
        border: "1px solid #28a745",
        boxShadow: "#28a745 0px 0px 20px",
        borderRadius: "10px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "#fff",
        fontWeight: "600",
        fontSize: { xs: "12px", sm: "18px" },
        marginRight: props.marginright,
        fontFamily: "Expletus Sans",
        "&: hover": {
          background: "transparent",
        },
      }}
    >
      {children}
    </Button>
  );
};

export default function Header() {
  // const classes = useStyles();
  // const [state, setState] = React.useState({
  //   left: false,
  // });
  const { account, connect, disconnect } = useContext(AppContext);
  const matches = useMediaQuery("(max-width:700px)");

  // const toggleDrawer = (anchor, open) => (event) => {
  //   if (
  //     event &&
  //     event.type === "keydown" &&
  //     (event.key === "Tab" || event.key === "Shift")
  //   ) {
  //     return;
  //   }
  //   setState({ ...state, [anchor]: open });
  // };
  // const list = (anchor) => (
  //   <div
  //     className={clsx(classes.list, {
  //       [classes.fullList]: anchor === "top" || anchor === "bottom",
  //     })}
  //     role="presentation"
  //     onClick={toggleDrawer(anchor, false)}
  //     onKeyDown={toggleDrawer(anchor, false)}
  //   >
  //     <Box mt={-20} mb={4} display="flex" justifyContent="center">
  //       <img width="150px" src="./logo.png" alt="" />
  //     </Box>
  //     <List>
  //       <ListItem
  //         style={{
  //           justifyContent: "center",
  //         }}
  //       >
  //         <a
  //           href="https://pancakeswap.finance/swap?inputCurrency=0x55d398326f99059fF775485246999027B3197955&outputCurrency=0xC0Cc1e5761bA5786916FD055562551798E50d573"
  //           target="_blank"
  //           style={{ textDecoration: "none" }}
  //         >
  //           <StyleButton>Buy ASY</StyleButton>
  //         </a>
  //       </ListItem>

  //       <ListItem
  //         style={{
  //           justifyContent: "center",
  //         }}
  //       >
  //         {account ? (
  //           <StyleButton onClick={() => disconnect()}>
  //             {account.slice(0, 4) + "..." + account.slice(-4)}
  //           </StyleButton>
  //         ) : (
  //           <StyleButton onClick={() => connect()}>Connect</StyleButton>
  //         )}
  //       </ListItem>
  //     </List>
  //   </div>
  // );

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        style={{
          background: "transparent",
          zIndex: "100px",
        }}
        height="92px"
        width="100%"
      >
        <Container maxWidth="xl">
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            pl={matches ? 0 : 3}
            pr={matches ? 0 : 3}
          >
            <Box>
              <img
                width={matches ? "130px" : "155px"}
                src="./logo.png"
                alt=""
              />
            </Box>

            <Box display="flex" alignItems="center">
              {/* <Hidden smDown> */}
              <a
                href="https://pancakeswap.finance/swap?inputCurrency=0x55d398326f99059fF775485246999027B3197955&outputCurrency=0xC0Cc1e5761bA5786916FD055562551798E50d573"
                target="_blank"
                style={{ textDecoration: "none" }}
              >
                <StyleButton marginright={{ xs: "7px", sm: "25px" }}>
                  Buy ASY
                </StyleButton>
              </a>
              {account ? (
                <StyleButton onClick={() => disconnect()}>
                  {account.slice(0, 4) + "..." + account.slice(-4)}
                </StyleButton>
              ) : (
                <StyleButton onClick={() => connect()}>Connect</StyleButton>
              )}
              {/* </Hidden> */}

              {/* <Hidden smUp>
                {["left"].map((anchor) => (
                  <React.Fragment key={anchor}>
                    <Button
                      onClick={toggleDrawer(anchor, true)}
                      style={{ zIndex: 1, alignSelf: "right" }}
                    >
                      <MenuIcon
                        style={{
                          fontSize: "38px",
                          cursor: "pointer",
                          color: "#fff",
                        }}
                      ></MenuIcon>
                    </Button>
                    <SwipeableDrawer
                      classes={{ paper: classes.paper }}
                      anchor={anchor}
                      open={state[anchor]}
                      onClose={toggleDrawer(anchor, false)}
                      onOpen={toggleDrawer(anchor, true)}
                    >
                      {list(anchor)}
                    </SwipeableDrawer>
                  </React.Fragment>
                ))}
              </Hidden> */}
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
}
