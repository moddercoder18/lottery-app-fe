import { styled } from "@mui/material/styles";
import React, { useState } from "react";
import { Backdrop, CircularProgress, Grid } from "@mui/material";
import HeaderSection from "../header";
import './index.scss'
import FooterSection from "../footer";

const LayoutContainer = styled("div")(() => ({
  width: `100%`,
  height: "100%",
  margin: "0px",
  padding: "0px",
}));

export const Layout = (WrappedComponent) => {
  function HOC(props) {
    const [isLoading, setLoading] = useState(false);

    const setLoadingState = (isComponentLoading) => {
      setLoading(isComponentLoading);
    };

    return (
      <>
        <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 2 }} open={isLoading}>
          <CircularProgress />
        </Backdrop>
        <LayoutContainer>
          <HeaderSection />
          <Grid className='wrapper_content'>
            <WrappedComponent {...props} setLoading={setLoadingState} />
          </Grid>
          <FooterSection />
        </LayoutContainer>
      </>
    );
  }

  return HOC;
};

export default Layout;
