import React from 'react';
import { Box, Grid, Divider, Typography, Table, TableRow, TableCell, TableBody } from '@mui/material'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import './index.scss';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

const LotteryCard = ({
    index,
    onMouseEnter,
    onMouseLeave,
    activeCard,
    numberCount,
    powerNumberCount,
    maxSelectNumberCount,
    maxSelectPowerNumberCount,
    ticket,
    singleQuickSearch,
    lineQuickSearch }) => {
    const { t } = useTranslation();
    const authState = useSelector(state => state?.AuthReducer?.settings?.setting);
    const nCount = maxSelectNumberCount - ticket?.numbers?.length;
    const pCount = maxSelectPowerNumberCount - ticket?.powerNumbers?.length;
    const deleteIcon = ticket?.numbers?.length > 0 || ticket?.powerNumbers?.length > 0;

    return (
        <>
            <Grid className={`ticket_card_container`} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
                <Grid className={`ticket-line ${(activeCard?.isActiveCard && activeCard?.activeIndex === index) ? 'active__card' : ''}`}>
                    <Box className='card__filter__section'>
                        {authState?.enableCustomerPickNumber && <Box className='filter_section'>
                            <Box className='quick_pick' onClick={() => lineQuickSearch(index - 1, 'pick')} >{t('key.quick_pick')}</Box>
                            {!!deleteIcon && <Box className='quick_pick' onClick={() => lineQuickSearch(index - 1, 'delete')} ><DeleteOutlineIcon fontSize="small" /></Box>}
                        </Box>}
                    </Box>
                    <Box className='ticket_line_content'>
                        <Box className='choose_section'>
                            {nCount > 0 && <>
                                <Typography> + {t('key.choose')} {nCount}</Typography>
                                <Divider className='divider_class' />
                            </>}
                        </Box>
                        <Box className='card_count'>
                            <Box className='watermark'>{index}</Box>
                            <Table className='card_table'>
                                <TableBody>
                                    <TableRow className='card_tr' >
                                        {Array(numberCount)?.fill()?.map((number, i) =>
                                            // active button class for numbers * ${ticket?.numbers?.find(num => num === i + 1) ? 'card__selected' : ''} *
                                            <TableCell className={`card_td  ${((ticket?.numbers?.find(num => num === i + 1)) && authState?.enableCustomerPickNumber) ? 'card__selected' : ''} `} key={i}
                                                onClick={() => (authState?.enableCustomerPickNumber ? singleQuickSearch(index - 1, 'numbers', i + 1, maxSelectNumberCount) : '')}
                                            >
                                                <Typography variant='span'>{i + 1}</Typography>
                                            </TableCell>
                                        )}
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </Box>
                        <Box className='choose_section' sx={{ mt: 1 }}>
                            {pCount > 0 && <Typography> + {t('key.choose')} {pCount}</Typography>}
                        </Box>
                        <Divider className='divider_class' />
                        <Box className='card_count'>
                            <Table className='card_table'>
                                <TableBody>
                                    <TableRow className='card_tr' >
                                        {Array(powerNumberCount)?.fill()?.map((number, i) =>
                                            // active button class for powerNumber *  ${ticket?.powerNumbers?.find(num => num === i + 1) ? 'card_power_selected' : ''}*
                                            <TableCell className={`card_td ${((ticket?.powerNumbers?.find(num => num === i + 1)) && authState?.enableCustomerPickNumber) ? 'card_power_selected' : ''} `}
                                                key={i}
                                                onClick={() => (authState?.enableCustomerPickNumber ? singleQuickSearch(index - 1, 'powerNumbers', i + 1, maxSelectPowerNumberCount) : '')}
                                            >
                                                <Typography variant='span'>{i + 1}</Typography>
                                            </TableCell>
                                        )}
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </>
    )
}

export default LotteryCard


// const lines = [{numbers: [1,6,7,8,2], powerNumbers: [1,2]}, {numbers: [1,7,6,8,2], powerNumbers: [1,2]},{numbers: [1,6,7,5,2], powerNumbers: [1,2]},{numbers: [1,6,3,8,2], powerNumbers: [1,2]}]
// lines.reduce((res, {numbers, powerNumbers}, index) => {
//     const key = `numbers_${numbers.sort().join(',')}_powerNumbers_${powerNumbers.sort().join(',')}`;
//     res.set(key, [...(res.get(key) || []), index])
//     return res;
// }, new Map())