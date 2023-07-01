import React, { useEffect } from 'react'
import Layout from '../hoc/layout';
import { Box, Divider, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, Grid } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { handleSingleLotteryAction } from '../../redux/actions/lottery.action';
import { useParams } from 'react-router-dom';
import './index.scss'
import moment from 'moment';
import PrizeConverter from '../../utils/prizeConverter';
import { useTranslation } from 'react-i18next';

const LotteryResultById = () => {
    const dispatch = useDispatch();
    const { id } = useParams();
    const {t} = useTranslation()

    const loadingState = useSelector(state => state?.LotteryReducer)
    const state = useSelector(state => state?.LotteryReducer?.lotteryById)
    useEffect(() => {
        dispatch(handleSingleLotteryAction(id))
    }, [dispatch, id])

    const lotteryInfo = [
        // { key: 'Guess Range', value: '6/45' },
        // { key: 'Offered In', value: 'Australia, Australia' },
        { key: t('lottery_result.schedule'), value: `${moment(state?.endDate).format('MMMM Do YYYY, h:mm:ss a')}` },
        { key: t('lottery_result.jackpot_type'), value: t('lottery_result.cash') },
        // { key: 'Tax Requirement', value: 'Lottery prizes are paid out tax-free. Check the tax laws in your country of residence for any further local taxation you may be subject to.' }
    ]

    return (
        <>
            {
                loadingState?.loading ?
                    <Grid className='loader_container'>
                        <CircularProgress size={100} />
                    </Grid> :
                    <Box className="lottery__result__list__id">
                        <Typography className='heading'>{t('lottery_result.latest')} {t('key.results')} {state?.name} </Typography>
                        <Typography sx={{ mt: 1 }}>{t('lottery_result.winning_number')}</Typography>
                        {(state?.winningNumbers?.numberslength > 0) ? <Box className='lottery__result' sx={{ mt: 2 }}>
                            <Box className='text_lines'>
                                {state?.winningNumbers?.numbers?.map(a => <Box key={a}>{a}</Box>)}
                            </Box>
                            <Box className='text_lines power_number'>
                                {state?.winningNumbers?.powerNumbers?.map(a => <Box key={a}>{a}</Box>)}
                            </Box>
                        </Box> : <Typography sx={{ color: 'blue' }}>{t('message.coming_soon')}</Typography>}
                        <Divider sx={{ mt: 2 }} />
                        <Box>
                            <Typography sx={{ mt: 2, fontWeight: 'bold' }}>{t('lottery_result.prize_break')}</Typography>
                            <TableContainer sx={{ mt: 1, mb: 3 }}>
                                <Table>
                                    <TableHead>
                                        <TableRow sx={{ background: '#f5e3e3' }}>
                                            <TableCell variant='head'>{t('lottery_result.match')}</TableCell>
                                            <TableCell variant='head'>{t('lottery_result.prize_break')}</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {state?.prizeBreakDown?.map((data, index) => {
                                            const number = data?.number > 0 ? data?.number : ''
                                            const powerNumber = data?.powerNumber > 0 ? data?.powerNumber : ''
                                            return <TableRow className='pointer' key={index} hover={true} sx={(index + 1) % 2 === 0 ? { background: '#f8fafd' } : { background: 'white' }}>
                                                <TableCell className=''>
                                                    <Typography className=''>{`${number} ${(data?.number && data?.powerNumber) ? '+' : ''} ${powerNumber}`}</Typography>
                                                </TableCell>
                                                <TableCell><PrizeConverter n={data?.price} /></TableCell>
                                            </TableRow>
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                        <Divider sx={{ mt: 2 }} />
                        <Box>
                            <Typography sx={{ mt: 2, fontWeight: 'bold' }}>{t('lottery_result.lottery_info')}</Typography>
                            <TableContainer sx={{ mt: 1, mb: 3 }}>
                                <Table>
                                    <TableBody>
                                        {lotteryInfo?.map((data, index) =>
                                            <TableRow className='pointer' key={index} hover={true} sx={(index + 1) % 2 === 0 ? { background: '#f8fafd' } : { background: 'white' }}>
                                                <TableCell className='info_first_child'>{data?.key}</TableCell>
                                                <TableCell>{data?.value}</TableCell>
                                            </TableRow>)}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                        <Divider sx={{ mt: 2 }} />
                        {/* <Box>
                            <Typography sx={{ mt: 2, fontWeight: 'bold' }}>Winning Odds</Typography>
                            <TableContainer sx={{ mt: 1, mb: 3 }}>
                                <Table>
                                    <TableHead>
                                        <TableRow sx={{ background: '#f5e3e3' }}>
                                            <TableCell variant='head'>Match</TableCell>
                                            <TableCell variant='head'>Winning Odds</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {state?.prizeBreakDown?.map((data, index) => {
                                            const number = data?.number > 0 ? data?.number : ''
                                            const powerNumber = data?.powerNumber > 0 ? data?.powerNumber : ''
                                            return <TableRow className='pointer' key={index} hover={true} sx={(index + 1) % 2 === 0 ? { background: '#f8fafd' } : { background: 'white' }}>
                                                <TableCell className=''>
                                                    <Typography className=''>{`${number} ${(data?.number && data?.powerNumber) ? '+' : ''} ${powerNumber}`}</Typography>
                                                </TableCell>
                                                <TableCell>1:{data?.price}</TableCell>
                                            </TableRow>
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box> */}
                    </Box>}
        </>
    )
}

export default Layout(LotteryResultById)