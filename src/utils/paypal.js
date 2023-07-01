import React from "react";
import './index.scss';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { ENV } from '../environment';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import CloseIcon from "@mui/icons-material/Close";
import { Box, Typography } from "@mui/material";
import HttpService from '../services/http.service'
import { api_base_url } from '../utils/urls'
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux'
import { couponAction, getUserAction } from "../redux/actions/auth.action";

const PaypalIntegration = ({ isShow, tickets, systematicNumber, handleClose, totalCount, multiplier }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { lotteryId } = useParams();
    const coupon = useSelector(state => state?.AuthReducer?.coupon?.code)
    const wallet = useSelector(state => state?.AuthReducer?.userData?.wallet)
    const currency = useSelector(state => state?.AuthReducer?.settings?.currency?.rates || {})
    const rateCurrencies = {
        en: 'USD',
        fil: 'PHP',
        hi: 'INR',
        ja: 'JPY',
        ko: 'KRW',
        ms: 'MYR',
        vi: 'VND',
        zh: 'CNY',
        id: 'IDR'
    };
    const systematicNumbers = systematicNumber?.numbers?.length > 0 ? systematicNumber : null;
    const payload = {
        customerTicket: {
            lotteryId,
            tickets,
            type: "one-time-entry",
            systematicNumber: systematicNumbers,
            hasMultiplier: multiplier
        },
        type: "one-time-entry",
        customerCurrency: "USD",
        couponCode: coupon || ''
    }

    const walletTransaction = async (key) => {
        const request = { ...payload }
        request.hasWallet = true
        try {
            const result = await HttpService.post(`${api_base_url}/transaction/paypal-page`, request);
            if (result?.data?.isPaid) {
                setTimeout(() => navigate('/my-tickets'), 700)
                dispatch(getUserAction())
                dispatch(couponAction(''))
                return true
            }
            return createOrder(true);
        } catch (error) {
            return createOrder(true);
        }
    }

    const createOrder = async (hasWallet) => {
        payload.hasWallet = hasWallet
        try {
            const result = await HttpService.post(`${api_base_url}/transaction`, payload);
            const orderId = result?.data?.response?.order?.id;
            return orderId;
        } catch (error) {
            if (!!error.response && error.response.data && error.response.data.error) {
                const errArray = error.response && error.response.data && error.response.data.message
                if (typeof (errArray) == 'string') { toast['error'](errArray) }
                else { for (let error of errArray) { toast['error'](error) } }
            }
            console.log('err paypal', error)
        }
    }

    const approveOrder = async (data) => {
        const result = await HttpService.post(`${api_base_url}/transaction/capture-paypal-order`, { orderId: data.orderID });
        if (result?.data?.status === "purchased" && result?.data?.response?.capture?.status === 'COMPLETED') {
            toast.success('Purchased successfully');
            setTimeout(() => navigate('/my-tickets'), 1000)
            dispatch(getUserAction())
            dispatch(couponAction(''))
        }
    }

    return (
        <Dialog
            open={isShow}
            fullWidth={true}
            maxWidth={'sm'}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle sx={{ m: 'auto', fontWeight: 'bold' }} id="alert-dialog-title">
                {"Payment Details"}
                <CloseIcon className='close___icon pointer' onClick={handleClose} />
            </DialogTitle>
            <DialogContent>
                <Typography sx={{ textAlign: 'center', mb: 2 }}>Choose your payment method</Typography>
                {/* {load ?
                    <Button variant="contained" className="by___wallet" ><CircularProgress color="inherit" size={30} /></Button>
                    : <>
                        {(wallet?.amount !== 0) && ((totalCount <= wallet?.amount) ?
                            <Button variant="contained" className="by___wallet" onClick={() => walletTransaction()}>By wallet</Button>
                            : <Button variant="contained" className="by___wallet" onClick={() => walletTransaction()}>By paypal with wallet</Button>
                        )}
                    </>} */}
                < PayPalScriptProvider options={{ "client-id": ENV.CLIENT_ID }}>
                    {(wallet?.amount !== 0) && ((totalCount <= wallet?.amount) ?
                        <Box className='wallet___button'>
                            <Box className='text___wallet'>By wallet</Box>
                            <PayPalButtons
                                style={{ height: 40, color: 'blue' }}
                                createOrder={() => walletTransaction()}
                                fundingSource="paypal"
                                onApprove={(data) => approveOrder(data)}
                                onError={(e) => console.log('err', e)}
                            />
                        </Box>
                        : <Box className='wallet___button'>
                            <Box className='text___wallet'>By paypal with wallet</Box>
                            <PayPalButtons
                                style={{ height: 40, color: 'blue' }}
                                createOrder={() => walletTransaction()}
                                fundingSource="paypal"
                                onApprove={(data) => approveOrder(data)}
                                onError={(e) => console.log('err', e)}
                            />
                        </Box>)}
                    <PayPalButtons
                        createOrder={() => createOrder(false)}
                        onError={(e) => console.log('err', e)}
                        onApprove={(data) => approveOrder(data)}
                    />
                </PayPalScriptProvider >

            </DialogContent>
        </Dialog >
    );
}

export default PaypalIntegration