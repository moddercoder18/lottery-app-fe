import React, { useEffect, useState } from 'react'
import Layout from '../hoc/layout';
import './index.scss';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { handleCustomerLotteriesAction } from '../../redux/actions/lottery.action';
import { Box, Typography } from '@mui/material';
import { firstCapital } from '../../utils/helper';
import { Search } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';

const LotteriesList = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState('');
  const authInfomation = useSelector(state => state?.AuthReducer);
  const lotteryInfomation = useSelector(state => state?.LotteryReducer);

  useEffect(() => {
    if (!authInfomation?.userData) {
      navigate('/lottery-tickets')
    }
  }, [authInfomation?.userData])

  useEffect(() => {
    dispatch(handleCustomerLotteriesAction())
  }, [dispatch])

  const Accordion = styled((props) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
  ))(({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    '&:not(:last-child)': {
      borderBottom: 0,
    },
    '&:before': {
      display: 'none',
    },
  }));

  const AccordionSummary = styled((props) => (
    <MuiAccordionSummary
      expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
      {...props}
    />
  ))(({ theme }) => ({
    flexDirection: 'row-reverse',
    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
      transform: 'rotate(90deg)',
    },
    '& .MuiAccordionSummary-content': {
      marginLeft: theme.spacing(1),
    },
  }));

  const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: theme.spacing(2),
    borderTop: '1px solid rgba(0, 0, 0, .125)',
  }));

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };


  return (
    <>
      <Box className='lottery__list__container' sx={{ width: '100%' }}>
        <Typography variant='h4' sx={{ mb: 3 }}>{t('titles.customer_lottery')} </Typography>
        {lotteryInfomation?.customerLotteries?.length > 0 ?
          <>
            <Accordion>
              <AccordionDetails >
                <Box className='lottery___menu___title'>
                  <Box className='section'>{t('titles.lottery_name')}</Box>
                  <Box className='section'>{t('titles.t_id')}</Box>
                  <Box className='section'>{t('key.status')}</Box>
                </Box>
              </AccordionDetails>
            </Accordion>
            <Box sx={{ mb: 3 }}>
              {lotteryInfomation?.customerLotteries?.map((cLottery, index) => {
                const numberList = !!cLottery?.systematicNumber?.numbers?.length ? [cLottery?.systematicNumber] : cLottery?.tickets;
                return <Accordion expanded={expanded === cLottery?._id} onChange={handleChange(cLottery?._id)} key={index} >
                  <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
                    <Box className='lottery___menu'>
                      <Box className='section'>{cLottery?.lotteryId?.name}</Box>
                      <Box className='section'>{cLottery?.transactionId?._id}</Box>
                      <Box className='section'>{firstCapital(cLottery?.status)}</Box>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    {
                      (cLottery?.isVerified || cLottery?.enableCustomerPickNumber) ?
                        <>
                          {numberList?.map((ticket, i) => {
                            return <Box className='lottery__sub__menu' key={i}>
                              <Box className='sub_section'>{t('key.line')} {i + 1}</Box>
                              <Box className=' active_numbers'>
                                <Box className='text_lines'>{ticket?.numbers?.map(a => <Box key={a}>{a}</Box>)}</Box>
                                <Box className='text_lines power_number'>{ticket?.powerNumbers?.map(a => <Box key={a}>{a}</Box>)}</Box>
                              </Box>
                              {ticket?.isWinner && <Box className='sub_section winner__text'>{t('key.winner')}</Box>}
                            </Box>
                          })}
                        </>
                        : <Typography className='verification_text'>{t('message.in_verification')}</Typography>
                    }
                  </AccordionDetails>
                </Accordion>

              })}
            </Box>
          </>
          : <Box variant='secondary' className='no_found'>
            <Search sx={{ fontSize: '90px' }} />
            {t('error.no_data')}
          </Box>
        }
      </Box >

    </>
  )
}

export default Layout(LotteriesList)