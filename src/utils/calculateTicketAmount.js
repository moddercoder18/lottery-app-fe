import { Box, Typography } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import PrizeConverter from './prizeConverter';

const CalculateTicketAmount = ({ isSystematic, lines, multiply }) => {
    const { t } = useTranslation();
    const state = useSelector(state => state?.LotteryReducer);
    const authState = useSelector(state => state?.AuthReducer);

    // default calculations 
    const perLinesPrice = multiply.isActive
        ? (state?.lotteryById?.multiplierPricePerLine + state?.lotteryById?.ticketPricePerLine)
        : state?.lotteryById?.ticketPricePerLine;
    const subTotalCount = (isSystematic?.isActive ? (isSystematic?.activeNumber) : (lines?.length)) * perLinesPrice
    const serviceFee = ((authState?.settings?.setting?.serviceFee || 1) * subTotalCount)
    const discount = (authState?.settings?.setting?.referralDiscount || 1) * (serviceFee / 100)
    const totalCount = authState?.coupon ? ((subTotalCount) + serviceFee - discount) : (subTotalCount + serviceFee);

    return (
        <Box className='prize_section'>
            <Box className='purchase-details'>
                <Typography className='price_text'>{t('key.ticket_price')} ({isSystematic?.isActive ? (isSystematic?.activeNumber) : (lines?.length)} X <PrizeConverter n={perLinesPrice} />)</Typography>
                <Typography className='price_text'> <PrizeConverter n={subTotalCount} /></Typography>
            </Box>
            {authState?.settings?.setting?.serviceFee > 0 &&
                <Box className='purchase-details'>
                    <Typography className='price_text highlight'>{t('key.service_fee')} ({authState?.settings?.setting?.serviceFee} X <PrizeConverter n={subTotalCount} />)</Typography>
                    <Typography className='price_text highlight'> + <PrizeConverter n={serviceFee} /> </Typography>
                </Box>
            }
            {(authState?.settings?.setting?.referralDiscount > 0 && authState?.coupon) &&
                <Box className='purchase-details'>
                    <Typography className='price_text highlight'>{t('key.discount')} ({`${authState?.settings?.setting?.referralDiscount}% service fee`})</Typography>
                    <Typography className='price_text highlight'> - <PrizeConverter n={discount} /></Typography>
                </Box>
            }
            <Box className='purchase_details_total'>
                <Typography className='price_text'>{t('key.total')}</Typography>
                <Typography className='price_text'><PrizeConverter n={totalCount} /></Typography>
            </Box>
        </Box>
    )
}

export default CalculateTicketAmount