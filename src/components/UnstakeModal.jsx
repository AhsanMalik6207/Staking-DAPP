import React, { useContext, useState } from "react";
import { Dialog, DialogContent, Box, Slide, Button } from "@mui/material";
import { AppContext } from "../utils";
import { useMinerContract, useStakingContract } from "../ConnectivityAss/hooks";
import { toast } from "react-toastify";
import Loading from "../loading";
import { withStyles } from "@mui/styles";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const StyledButton = ({ children, ...props }) => {
  return (
    <Button
      {...props}
      sx={{
        background: "#F7C35F",
        border: "1px solid #28a745",
        boxShadow: "#28a745 0px 0px 20px",
        fontSize: "16px",
        borderRadius: "10px",
        width: "120px",
        padding: "8px",
        marginTop: "10px",
        color: "#ffffff",
        fontWeight: "bolder",
        fontFamily: "Expletus Sans",
      }}
    >
      {children}
    </Button>
  );
};

const StyledModal = withStyles(() => ({
  root: {
    "& .MuiDialog-root": {
      zIndex: "1301 !important",
    },
    "&.MuiDialog-container": {
      overflowY: "hidden !important",
    },
    "& .MuiDialog-paperScrollPaper": {
      backgroundColor: "#255946 !important",
      height: "auto",
      // boxShadow: "#DFDFDF 0px 0px 8px 1px",
      backgroundImage:
        " linear-gradient(#255946, #255946  ),linear-gradient(94.21deg, #28a745 7.52%, #F7C35F 13.59%, #668056 89.08%)",
      backgroundOrigin: "border-box",
      backgroundClip: "content-box, border-box",
      padding: "4px",
    },
    "& .dialoge__content__section": {
      background: "#255946 !important",
      // borderRadius: 5,
    },
    "& .MuiDialogContent-root": {
      paddingTop: "20px",
      paddingBottom: "20px",
      position: "relative",
    },
  },
}))(Dialog);

function UnstakeModal({ open, setOpen, unstakeIndex }) {
  const { account, signer } = useContext(AppContext);
  const stakingContract = useStakingContract(signer);
  const [loading, setloading] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };

  // const withdrawHandler = async () => {
  //   if (account) {
  //     try {
  //       setloading(true);
  //       const tx = await contract.sellOres();
  //       await tx.wait();
  //       toast.success("Success! Transection Confirmed.");
  //       setloading(false);
  //       window.location.reload();
  //     } catch (error) {
  //       if (error?.data?.message) {
  //         toast.error(error?.data?.message);
  //       } else {
  //         toast.error(error?.message);
  //       }
  //       setloading(false);
  //     }
  //   } else {
  //     toast.error("Error! Please connect your wallet.");
  //   }
  // };
  const unstakeHandler = async () => {
    try {
      setloading(true);
      const tx = await stakingContract.unstake(unstakeIndex);
      await tx.wait();
      toast.success("Success! Amount successfully unsataked.");
      setloading(false);
    } catch (error) {
      if (error?.data?.message) {
        toast.error(error?.data?.message);
      } else {
        toast.error(error?.message);
      }
      setloading(false);
    }
  };

  return (
    <div>
      <Loading loading={loading} />
      <div className="modal__main__container">
        <StyledModal
          open={open}
          keepMounted
          TransitionComponent={Transition}
          onClose={handleClose}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogContent className="dialoge__content__section">
            <Box
              textAlign="center"
              fontSize="17px"
              fontFamily="Expletus Sans"
              color="#fff"
            >
              You have to pay 15% potential penality
            </Box>

            <Box
              mt={2}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <StyledButton onClick={() => handleClose()}>Cancel</StyledButton>
              <StyledButton
                onClick={() => {
                  unstakeHandler();
                  handleClose();
                }}
              >
                Unstake
              </StyledButton>
            </Box>
          </DialogContent>
        </StyledModal>
      </div>
    </div>
  );
}

export default UnstakeModal;
