import React from 'react';
import Layout from '../hoc/layout'
import { Box, Divider, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CountDown from '../../utils/countDown';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { handleDynamicContent, handleLotteryAction } from '../../redux/actions/lottery.action';
import { useTranslation } from "react-i18next";
import PrizeConverter from '../../utils/prizeConverter';
import './index.scss';

const LotteryTicket = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const state = useSelector(state => state?.LotteryReducer)
  useEffect(() => {
    dispatch(handleLotteryAction())
    dispatch(handleDynamicContent('lottery-home'))
  }, [dispatch])

  return (
    <>
      <Box className='lottery_container_table'>
        <Typography className='buy_ticket_online' >{t('key.title')}</Typography>
        <Typography className='buy_ticket_online_description' >{t('key.sub_title')}</Typography>
        {state?.lotteryListLoading ?
          <Box sx={{ textAlign: 'center' }}><CircularProgress /></Box>
          : <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ background: 'rgb(234 224 255)' }}>
                  <TableCell variant='head' sx={{ width: '177px' }}>{t('key.lottery')}</TableCell>
                  <TableCell variant='head'></TableCell>
                  <TableCell variant='head'>{t('key.jackpot')}</TableCell>
                  <TableCell variant='head'>{t('key.next_draw')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {state?.lotteries?.map((data, index) =>
                  <TableRow className='pointer' key={index} hover={true} sx={(index + 1) % 2 === 0 ? { background: '#f8fafd' } : { background: 'white' }}
                    onClick={() => new Date(data?.endDate) > new Date() ? navigate(`/lottery-tickets/${data?._id}`) : ''}>
                    <TableCell width="10%" ><Box component={'img'}
                      onError={(event) => {
                        event.target.src = 'https://www.thelotter.com/objects/dm.tlo?id=29424&v=20230402';
                        event.onerror = null;
                      }}
                      src={data?.image}
                      width={'60px'} height={'60px'} /></TableCell>
                    <TableCell><Typography>{data?.name}</Typography></TableCell>
                    <TableCell>
                      <Box className='lottery_table_amount'>
                        {data?.winningPrice ? <PrizeConverter className={'lottery_table_amount_length'} n={data?.winningPrice} />
                          : `${t('key.jackpot')} Pending`}
                      </Box>
                    </TableCell>
                    <TableCell sx={{ width: '180px' }}>
                      {/* {moment(data?.endDate).format('DD')} */}
                      {new Date(data?.endDate) > new Date() ? <CountDown
                        date={data?.endDate}
                      /> : <Box>
                        {`${t('message.waiting_msg')}`}
                      </Box>}
                    </TableCell>
                  </TableRow>)}
              </TableBody>
            </Table>
          </TableContainer>
        }
        <Grid sx={{ mt: 5 }}>
          <Box dangerouslySetInnerHTML={{ __html: `${t(state?.dynamicContent?.content[window.localStorage.getItem('language') || 'en'])}` }}></Box>
        </Grid>
        <Divider sx={{ mt: 3, mb: 6 }} />
      </Box >
      <Grid className='lottery_sections' sx={{ display: { xs: 'none', sm: 'none', md: 'flex' } }}>
        <Box className='top_lottery_container'>
          <Box component={'img'} src={'https://www.thelotter.com/objects/dm.tlo?id=29430&v=20230402'} />
          <Box className='top_lottery_text_description'>
            <PrizeConverter className={'length'} n={state?.lotteries?.[0]?.winningPrice} />
          </Box>
        </Box>
      </Grid>
      <Grid className='lottery_sections_mobile' sx={{ display: { xs: 'flex', sm: 'flex', md: 'none' } }}>
        <Box className='top_lottery_container'>
          <Box component={'img'} src={'https://www.thelotter.com/objects/dm.tlo?id=29430&v=20230402'} />
          <Box className='top_lottery_text_description'>
            {/* <Typography className='lottery_title'>{state?.lotteries?.[0]?.name}</Typography> */}
            <PrizeConverter className={'length'} n={state?.lotteries?.[0]?.winningPrice} />
            {new Date(state?.lotteries?.[0]?.endDate) > new Date() ? <CountDown
              date={state?.lotteries?.[0]?.endDate}
            /> : <Box>
              {`${t('message.waiting_msg')}`}
            </Box>}
          </Box>
        </Box>
      </Grid>
    </>
  )
}
export default Layout(LotteryTicket)