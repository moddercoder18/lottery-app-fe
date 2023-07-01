import React, { useEffect } from 'react'
import Layout from '../hoc/layout';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Grid } from '@mui/material';
import moment from 'moment/moment';
import './index.scss'
import { HttpService } from "../../services";
import { api_base_url } from "../../utils/urls";
import { Search } from '@mui/icons-material';
import { useState } from 'react';
import PrizeConverter from '../../utils/prizeConverter';
import { firstCapital } from '../../utils/helper';
import { useTranslation } from 'react-i18next';

const WalletTransaction = () => {
    const { t } = useTranslation();
    const [list, setList] = useState({
        loading: true,
        data: []
    })

    const transactionsList = async () => {
        try {
            const result = await HttpService.get(api_base_url + '/customer-wallet-transaction')
            if (result?.status < 400) setList({ data: result?.data, loading: false })
        } catch (err) { setList({ data: null, loading: false }) }
    }
    useEffect(() => { transactionsList() }, [])

    return (
        <>
            <Box className='lottery__list__container' sx={{ width: '100%', mb: 2 }}>
                <Typography variant='h5'>{t('titles.wallet_transaction')}</Typography>
                {list?.loading ?
                    <Grid item className='loader_container'><CircularProgress size={100} /></Grid>
                    : <>
                        {list?.data?.length > 0 ? <TableContainer component={Paper} sx={{ mt: 2 }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell variant='head'>{t('titles.t_date')}</TableCell>
                                        <TableCell variant='head'>{t('titles.amount')}</TableCell>
                                        <TableCell variant='head'>{t('titles.t_type')}</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {list?.data?.map((data, index) => {
                                        const debit = (data?.transactionType === "withdrawal" || data?.transactionType === "purchased") ? true : false
                                        const activeClass = debit ? "text_danger" : "text_success"
                                        return <TableRow className='pointer' key={index} hover={true} sx={(index + 1) % 2 === 0 ? { background: '#f8fafd' } : { background: 'white' }}>
                                            <TableCell>{moment(data?.createdAt).format('MMMM Do YYYY, h:mm:ss a')}</TableCell>
                                            <TableCell sx={{ display: 'flex' }}>
                                                <Typography className={activeClass}>{debit ? '-' : '+'}</Typography>
                                                <PrizeConverter n={data?.amount} className={activeClass} /></TableCell>
                                            <TableCell><Typography>{firstCapital(data?.transactionType)}</Typography></TableCell>
                                        </TableRow>
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                            : <Box variant='secondary' className='no_found'>
                                <Search sx={{ fontSize: '90px' }} />
                                {t('error.no_data')}
                            </Box>}
                    </>}
            </Box >
        </>
    )
}

export default Layout(WalletTransaction);