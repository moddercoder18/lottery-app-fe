import React, { useEffect } from 'react'
import Layout from '../hoc/layout';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { handleLotteryResultAction } from '../../redux/actions/lottery.action';
import moment from 'moment/moment';
import './index.scss'
import { Search } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

const LotteryResult = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const state = useSelector(state => state?.LotteryReducer)

    useEffect(() => { dispatch(handleLotteryResultAction()) }, [dispatch])

    return (
        <>
            <Box className='lottery__list__container' sx={{ p: 2 }}>
                <Typography variant='h5' sx={{ fontWeight: 'bold' }}>{t('titles.lottery_result')}</Typography>
                <Typography sx={{ mt: 4 }}>{t('titles.lottery_result_subtitle')}</Typography>
                {state?.lotteriesResultLoading ?
                    <Grid item className='loader_container'><CircularProgress size={100} /></Grid>
                    : <>{state?.lotteriesResult?.length > 0 ? <TableContainer component={Paper} sx={{ mt: 2 }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell variant='head'>{t('key.lottery')}</TableCell>
                                    <TableCell variant='head'>{t('key.date')}</TableCell>
                                    <TableCell variant='head'>{t('key.results')}</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {state?.lotteriesResult?.map((data, index) =>
                                    <TableRow className='pointer' key={index} hover={true} sx={(index + 1) % 2 === 0 ? { background: '#f8fafd' } : { background: 'white' }}
                                        onClick={() => navigate(`/lottery-results/${data?._id}`)}
                                    >
                                        <TableCell><Typography>{data?.name}</Typography></TableCell>
                                        <TableCell>{moment(data?.endDate).format('MMMM Do YYYY, h:mm:ss a')}</TableCell>
                                        <TableCell>
                                            {(data?.winningNumbers?.numbers?.length && data?.winningNumbers?.powerNumbers?.length) ?
                                                <Box className='active_numbers'>
                                                    <Box className='text_lines'>
                                                        {data?.winningNumbers?.numbers?.map(a => <Box key={a}>{a}</Box>)}
                                                    </Box>
                                                    <Box className='text_lines power_number'>
                                                        {data?.winningNumbers?.powerNumbers?.map(a => <Box key={a}>{a}</Box>)}
                                                    </Box>
                                                </Box> :
                                                <Box>{t('message.coming_soon')}</Box>}
                                        </TableCell>
                                    </TableRow>)}
                            </TableBody>
                        </Table>
                    </TableContainer>
                        : <Box variant='secondary' className='no_found'>
                            <Search sx={{ fontSize: '90px' }} />{t('error.no_data')}
                        </Box>}
                    </>}
            </Box >
        </>
    )
}

export default Layout(LotteryResult);