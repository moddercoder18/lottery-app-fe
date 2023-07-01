import React, { Suspense, useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Grid } from "@mui/material";
import "react-toastify/dist/ReactToastify.css";
import LotteryTicket from "./components/lottery_tickets";
import LotteryTicketDetail from './components/lottery_tickets/ticket_details'
import ForgotPassword from "./components/auth/forgot_password";
import { useDispatch } from "react-redux";
import { getUserAction, settingsAction } from "./redux/actions/auth.action";
import MyAccount from "./components/my_account";
import LotteriesList from "./components/lotteries";
import LotteryResult from "./components/lotteries/lottery_result";
import LotteryResultById from "./components/lotteries/lottery_result_by_id";
import DynamicPage from "./components/hoc/dynamic_page";
import WalletTransaction from "./components/my_account/wallet_transaction";
import ChangePassword from "./components/auth/change_password";

const MasterComponent = () => {
    const dispatch = useDispatch()

    useEffect(() => {
        if (localStorage.getItem('token')) {
            dispatch(getUserAction())
        }
        dispatch(settingsAction())
    }, [dispatch])
    return (
        <>
            <Suspense
                fallback={<Grid className="container_div"></Grid>}>
                <main className="public-main">
                    <div className="public-container">
                        <Routes>
                            <Route path="/lottery-tickets" element={<LotteryTicket />}></Route>
                            <Route path="/lottery-tickets/:lotteryId" element={<LotteryTicketDetail />}></Route>
                            <Route path="/lottery-results" element={<LotteryResult />}></Route>
                            <Route path="/lottery-results/:id" element={<LotteryResultById />}></Route>
                            <Route path="/forgot-password" element={<ForgotPassword />} />
                            <Route path="/password-reset-confirm/:token" element={<ForgotPassword />}></Route>
                            <Route path="/profile" element={<MyAccount />}></Route>
                            <Route path="/my-tickets" element={<LotteriesList />}></Route>
                            <Route path="/content/:page" element={<DynamicPage />}></Route>
                            <Route path="/transactions" element={<WalletTransaction />}></Route>
                            <Route path="/change-password" element={<ChangePassword />}></Route>
                            <Route path="*" element={<Navigate replace to="/lottery-tickets" />} />
                        </Routes>
                    </div>
                </main>
            </Suspense>
            <ToastContainer />
        </>
    )
}

export default MasterComponent