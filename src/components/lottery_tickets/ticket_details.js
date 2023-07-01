import React, { useState } from 'react'
import Layout from '../hoc/layout'
import { Box, Button, Grid, Link, Typography, Checkbox, CircularProgress, OutlinedInput } from '@mui/material';
import './index.scss'
import LotteryCard from './lottery_card';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import CountDown from '../../utils/countDown'
import { generateQuickPicArray } from '../../utils/helper';
import SystematicLotteryCard from './systematic_lottery_card';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { handleDynamicContent, handleSingleLotteryAction } from '../../redux/actions/lottery.action';
import { useParams } from 'react-router-dom';
import PrizeConverter from '../../utils/prizeConverter';
import PaypalIntegration from '../../utils/paypal';
import LoginDialog from '../auth/login_dialog';
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import { couponAction } from '../../redux/actions/auth.action';
import { bannerImages as BannerImages, entryType as EntryType } from '../../utils/helperComponent';
import { toast } from 'react-toastify';

const LotteryTicketDetail = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { lotteryId } = useParams();
    let linesList = [
        { label: `2 ${t('key.lines')}`, value: 2 },
        { label: `3 ${t('key.lines')}`, value: 3 },
        { label: `5 ${t('key.lines')}`, value: 5 },
        { label: `7 ${t('key.lines')}`, value: 7 },
        { label: `10 ${t('key.lines')}`, value: 10 },
        { label: `15 ${t('key.lines')}`, value: 15 },
        { label: `20 ${t('key.lines')}`, value: 20 },
        { label: `25 ${t('key.lines')}`, value: 25 },
    ]

    // redux states
    const state = useSelector(state => state?.LotteryReducer);
    const authState = useSelector(state => state?.AuthReducer);
    if (authState?.settings?.setting?.enableCustomerPickNumber && linesList?.find(i => i.value !== 'Systematic')) {
        linesList.push({ label: t('key.systemic'), value: "Systematic" })
    }

    const [entryType, setEntryType] = useState('one_time_entry')
    const [isShow, handleModalShow] = useState({
        login: false,
        paypal: false,
        isCoupon: true,
    })

    const [isSystematic, setSystematic] = useState({
        isActive: false,
        activeNumber: 6,
        ticket: null
    });

    const [activeCard, setActiveCard] = useState({
        activeIndex: null,
        isActiveCard: false
    })

    const [lines, setLines] = useState([
        { numbers: [], powerNumbers: [] },
        { numbers: [], powerNumbers: [] }])

    const [multiply, setMultiply] = useState({
        isActive: false,
        isCoupon: true,
    })

    const formik = useFormik({
        initialValues: { coupon: "" },
        onSubmit: async (values) => {
            if (!!authState?.userData) dispatch(couponAction(values))
            else toast.warn('User need to login first.')
        }
    });

    useEffect(() => {
        dispatch(handleSingleLotteryAction(lotteryId))
        dispatch(handleDynamicContent('lottery-detail'))
    }, [dispatch, lotteryId])

    const onMouseHandle = (i, isKey) => {
        setActiveCard({
            activeIndex: i,
            isActiveCard: isKey
        })
    }

    const handleLines = (i) => {
        if (i === 'Systematic') {
            setLines([]);
            setSystematic({ ...isSystematic, isActive: true })
        } else {
            setSystematic({ ...isSystematic, isActive: false })
            while (i > lines.length) {
                lines.push({ numbers: [], powerNumbers: [] })
            }
            while (i < lines.length) {
                const spliceCount = lines.length - i
                lines.splice(i, spliceCount)
            }
            setLines([...lines])
        }

    }

    // cell selection in lines
    const singleQuickSearch = (key, property, ticketNumber, length) => {
        if (lines[key][property]?.includes(ticketNumber)) {
            lines[key][property]?.splice(lines[key][property]?.indexOf(ticketNumber), 1)
        } else if (lines[key][property].length < length) {
            lines[key][property].push(ticketNumber)
        }
        setLines([...lines])
    }

    // lines auto selection 
    const lineQuickSearch = (key, action) => {
        const count = state?.lotteryById?.numbersPerLine;
        lines[key]['numbers'] = action === 'pick' ? generateQuickPicArray(count?.maxSelectTotalNumber, count?.totalShowNumber) : [];
        lines[key]['powerNumbers'] = action === 'pick' ? generateQuickPicArray(count?.maxSelectTotalPowerNumber, count?.totalShowPowerNumber) : [];
        setLines([...lines])
    }

    // all line auto selection
    const completeQuickSearch = (action) => {
        const count = state?.lotteryById?.numbersPerLine;
        if (isSystematic?.isActive) {
            const ticket = {
                numbers: createRemainsLinesCount(action, isSystematic?.ticket?.numbers, isSystematic?.activeNumber, count?.totalShowNumber),
                powerNumbers: createRemainsLinesCount(action, isSystematic?.ticket?.powerNumbers, 1, count?.totalShowPowerNumber),
            }
            setSystematic({ ...isSystematic, ticket })
        } else {
            lines?.forEach((a, index) => {
                lines[index]['numbers'] = createRemainsLinesCount(action, lines[index]['numbers'], count?.maxSelectTotalNumber, count?.totalShowNumber)
                lines[index]['powerNumbers'] = createRemainsLinesCount(action, lines[index]['powerNumbers'], count?.maxSelectTotalPowerNumber, count?.totalShowPowerNumber)
            })
            setLines([...lines])
        }
    }

    // handle condition if user select all numbers or user remains any number of count 
    const createRemainsLinesCount = (action, number, maxSelect, showCount) => {
        let numbers = []
        if (action === 'remove') return []
        else {
            if (number.length < maxSelect) {
                numbers = [...generateQuickPicArray(maxSelect, showCount)]
            } else { numbers = [...number] }
            return numbers
        }
    }

    const handleClose = () => { handleModalShow({ login: false, paypal: false }) }

    const handleSubmitTicket = () => {
        if (!!authState?.userData) {
            if (authState?.settings?.setting?.enableCustomerPickNumber) { completeQuickSearch('add'); }
            setTimeout(() => { handleModalShow({ paypal: true }) }, 1000)
        } else { toast.warn('User need to login first.') }
    }


    // default calculations 
    const perLinesPrice = multiply.isActive
        ? (state?.lotteryById?.multiplierPricePerLine + state?.lotteryById?.ticketPricePerLine)
        : state?.lotteryById?.ticketPricePerLine;
    const subTotalCount = (isSystematic?.isActive ? (isSystematic?.activeNumber) : (lines?.length)) * perLinesPrice
    const serviceFee = ((authState?.settings?.setting?.serviceFee || 1) * subTotalCount)
    const discount = (authState?.settings?.setting?.referralDiscount || 1) * (serviceFee / 100)
    const totalCount = authState?.coupon ? ((subTotalCount) + serviceFee - discount) : (subTotalCount + serviceFee);

    return (
        <>
            {state?.lotteryIdLoading ?
                <Grid className='loader_container'>
                    <CircularProgress size={100} />
                </Grid>
                : <Grid className='lottery_details_container'>
                    <Typography className='lottery_details_container_heading'>{t('key.play')} {state?.lotteryById?.name}</Typography>
                    <BannerImages /> {/* show banner images*/}
                    <Grid className='lottery-card-holder'>
                        <Box className='lottery_card_container' sx={state?.lotteryById?.backgroundColor ? { backgroundColor: state?.lotteryById?.backgroundColor } : { backgroundColor: '#76a7f1' }}>
                            <Box className='lottery_banner_card_container'>
                                <Box sx={{ width: '30%' }}>
                                    <Box className='lottery_extra_banner'>
                                        <Box component={'img'} alt='image_section' src={state?.lotteryById?.image}
                                            onError={(event) => {
                                                event.target.src = 'https://www.thelotter.com/objects/dm.tlo?id=29424&v=20230402';
                                                event.onerror = null;
                                            }} />
                                    </Box>
                                </Box>
                                <Box className='lottery_banner_text'>
                                    <Box className='lottery_extra_banner_amount'>
                                        <PrizeConverter className={'lottery_length'} n={state?.lotteryById?.winningPrice} />
                                    </Box>
                                </Box>
                                <Box className='lottery_banner_timer_text'>
                                    <CountDown
                                        timeTillDate={state?.lotteryById?.endDate}
                                        timeFormat="MM DD YYYY, h:mm a"
                                    />
                                </Box>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid>
                        <Grid className='quick_pick_tabs'>
                            <Box className='quick_pick_tabs_List'>
                            </Box>
                            {authState?.settings?.setting?.enableCustomerPickNumber && <Box className='quick_pick_actions'>
                                <Button variant='outlined' className='quick_pick_button' onClick={() => completeQuickSearch('add')}>{t('key.quick_pick')}</Button>
                                <Link className='quick_pick_button_delete' onClick={() => completeQuickSearch('remove')}><DeleteForeverIcon fontSize='small' className='pointer' /></Link>
                            </Box>}
                        </Grid>
                        <Grid className='ticket_card_list'>
                            <Box className='ticket_lines_list'>
                                {linesList?.map((i) => {
                                    return <Typography sx={{ pl: 2 }} key={i?.value} className={(lines?.length === i?.value) || (isSystematic?.isActive && i?.value === 'Systematic') ? 'active_tab' : ''}
                                        onClick={() => handleLines(i?.value)} >{i?.label}</Typography>
                                })}
                            </Box>
                            <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap' }}>
                                {isSystematic?.isActive ? <SystematicLotteryCard
                                    numbers={state?.lotteryById?.numbersPerLine?.totalShowNumber}
                                    powerNumbers={state?.lotteryById?.numbersPerLine?.totalShowPowerNumber}
                                    isSystematic={isSystematic}
                                    setSystematic={setSystematic}
                                    ticketLines={state?.lotteryById?.ticketLines}
                                /> :
                                    <>
                                        {lines?.map(({ numbers, powerNumbers }, index) => <LotteryCard
                                            key={index}
                                            index={index + 1}
                                            onMouseEnter={() => onMouseHandle(index + 1, true)}
                                            onMouseLeave={() => onMouseHandle(null, false)}
                                            activeCard={activeCard}
                                            numberCount={state?.lotteryById?.numbersPerLine?.totalShowNumber}
                                            powerNumberCount={state?.lotteryById?.numbersPerLine?.totalShowPowerNumber}
                                            maxSelectNumberCount={state?.lotteryById?.numbersPerLine?.maxSelectTotalNumber}
                                            maxSelectPowerNumberCount={state?.lotteryById?.numbersPerLine?.maxSelectTotalPowerNumber}
                                            ticket={{ numbers, powerNumbers }}
                                            singleQuickSearch={singleQuickSearch}
                                            lineQuickSearch={lineQuickSearch}
                                        />)}
                                    </>
                                }
                            </Box>
                        </Grid>
                        {state?.lotteryById?.multiplier > 1 && <Box className='inner_option'>
                            <Box className='power_play__section'>
                                <Box className='power_play'>
                                    <Checkbox className="term-checkbox" name='multiple' onChange={(e) => setMultiply({ isActive: e?.target?.checked })} />
                                    <Box sx={{ display: 'flex' }}>Multiply your prize up to {state?.lotteryById?.multiplier} times for <PrizeConverter n={state?.lotteryById?.multiplierPricePerLine} /> per line</Box>
                                </Box>
                            </Box>
                        </Box>}

                        {/* show Entry types section*/}
                        <EntryType entryType={entryType} setEntryType={setEntryType} lines={lines} />
                        <Box className='play-request-summary'>
                            <Box component={"form"} noValidate onSubmit={formik?.handleSubmit}>
                                <Box className='coupon_div'>
                                    <Box>
                                        <OutlinedInput
                                            placeholder={t('coupon.coupon_placeholder')}
                                            value={formik?.values?.coupon}
                                            size="small"
                                            name="coupon"
                                            onChange={formik?.handleChange}
                                        />
                                    </Box>
                                    <Box className='actions__row'>
                                        <Button type='submit' variant='contained' disabled={!formik?.values?.coupon} color='primary'>
                                            {authState?.couponLoading ? <CircularProgress size={30} color='inherit' /> : t('coupon.apply_coupon')}
                                        </Button>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                        <Box className='play-request-summary'>
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
                            {/* <CalculateTicketAmount isSystematic={isSystematic} lines={lines} multiply={multiply} /> */}
                            <Button variant='contained' className='play_button' onClick={() => handleSubmitTicket()}>{t('key.play')}</Button>
                        </Box>
                        <Grid className='description_section'>
                            <Box className='description_section_text'>
                                <Box dangerouslySetInnerHTML={{ __html: `${t(state?.dynamicContent?.content[window.localStorage.getItem('language') || 'en'])}` }}></Box>
                            </Box>
                        </Grid>
                    </Grid>
                    <PaypalIntegration isShow={!!isShow?.paypal}
                        tickets={lines}
                        totalCount={totalCount}
                        systematicNumber={isSystematic?.ticket}
                        handleClose={handleClose}
                        multiplier={multiply.isActive} />
                    <LoginDialog open={!!isShow?.login} handleClose={handleClose} />
                </Grid >}
        </>
    )
}
export default Layout(LotteryTicketDetail)