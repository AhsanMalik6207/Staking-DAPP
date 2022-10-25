import React from "react";
import { Dialog, DialogContent, Box, Slide, Button } from "@mui/material";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
function NetworkChange({ open, setOpen }) {
  const handleClose = () => {
    setOpen(false);
  };
  const networkHandler = async () => {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x38" }], //BSC Mainnet
        // params: [{ chainId: "0x61" }], //BSC Testnet
      });
      setOpen(false);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <div className="modal__main__container">
        <Dialog
          open={open}
          keepMounted
          TransitionComponent={Transition}
          onClose={handleClose}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogContent
            className="dialoge__content__section"
            sx={{ background: "#255946" }}
          >
            <Box component="h3" color="#fff">
              <Box component="span" color="red" fontSize="30px">
                Error!
              </Box>{" "}
              You are on wrong network please switch your network.
            </Box>
            <Box align="center">
              <Button
                sx={{
                  background: "#F7C35F",
                  border: "1px solid #28a745",
                  boxShadow: "#28a745 0px 0px 20px",
                  borderRadius: "10px",
                  padding: "15px 20px",
                  color: "#fff",
                  cursor: "pointer",
                  fontSize: "16px",
                  lineHeight: "19px",
                  fontWeight: "bolder",
                  textTransform: "uppercase",
                  marginRight: "10px",
                }}
                onClick={networkHandler}
              >
                Switch Network
              </Button>
            </Box>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default NetworkChange;
