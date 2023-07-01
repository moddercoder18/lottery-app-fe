import React, { useEffect, useState } from 'react';
import { Box, Grid, Divider, Typography, Table, TableRow, TableCell, TableBody, RadioGroup, FormControlLabel, Radio } from '@mui/material'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { factorialCount, generateQuickPicArray } from '../../utils/helper';
import './index.scss';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

const SystematicLotteryCard = ({
    powerNumbers,
    numbers,
    ticketLines,
    isSystematic,
    setSystematic
}) => {
    const { t } = useTranslation();
    const state = useSelector(state => state?.LotteryReducer);
    const authState = useSelector(state => state?.AuthReducer?.settings?.setting);
    const [combination, setCombination] = useState([])
    const handleCombination = (number, index = 5) => {
        const a = factorialCount(number - index);
        return factorialCount(number) / (factorialCount(index) * a)
    }

    // cell selection in lines
    const singleQuickSearch = (property, ticketNumber, length) => {
        if (isSystematic?.ticket[property]?.includes(ticketNumber)) {
            isSystematic?.ticket[property]?.splice(isSystematic?.ticket[property]?.indexOf(ticketNumber), 1)
        } else if (isSystematic?.ticket[property].length < length) {
            isSystematic?.ticket[property].push(ticketNumber)
        }
        setSystematic({ ...isSystematic })
    }

    // lines auto selection 
    const lineQuickSearch = (action) => {
        const count = state?.lotteryById?.numbersPerLine;
        let ticket = {
            numbers: (action === 'pick') ? generateQuickPicArray(isSystematic?.activeNumber, count?.totalShowNumber) : [],
            powerNumbers: (action === 'pick') ? generateQuickPicArray(1, count?.totalShowPowerNumber) : []
        }
        setSystematic({ ...isSystematic, ticket })
    }

    const createLines = (maxCount) => {
        let n = 6;
        let combinations = []
        for (let line = 6; line <= maxCount; n++) {
            line = handleCombination(n)
            if (line < maxCount) {
                combinations.push({
                    number: n,
                    combinationOfNumber: line
                })
            } else { break }
        }
        setCombination([...combinations])
    }

    const handleSystematicNumberRatio = (number) => {
        if (isSystematic?.ticket?.numbers?.length > number) {
            setSystematic({
                ...isSystematic, activeNumber: number, ticket: { numbers: [] }
            })
        } else {
            setSystematic({ ...isSystematic, activeNumber: number })
        }
    }

    useEffect(() => {
        createLines(ticketLines);
    }, [])

    const nCount = isSystematic?.activeNumber - (isSystematic?.ticket?.numbers?.length || 0);
    const pCount = 1 - (isSystematic?.ticket?.powerNumbers?.length || 0);
    const deleteIcon = isSystematic?.ticket?.numbers?.length > 0 || isSystematic?.ticket?.powerNumbers?.length > 0;
    return (
        <Grid className='systematic_lottery_card_section'>
            <Box className='systematic__lottery_section'>
                <Grid className={`ticket_card_container`}>
                    <Grid className={`ticket-line active__card`} sx={{ mt: 0, boxShadow: 'none' }}>
                        <Box className='card__filter__section'>
                            <Box className='filter_section'>
                                <Box className='quick_pick' onClick={() => lineQuickSearch('pick')} >{t('key.quick_pick')}</Box>
                                {!!deleteIcon && <Box className='quick_pick' onClick={() => lineQuickSearch('delete')}>
                                    <DeleteOutlineIcon fontSize="small" className='pointer' />
                                </Box>}
                            </Box>
                        </Box>
                        <Box className='ticket_line_content'>
                            <Box className='choose_section'>
                                {nCount > 0 && <>
                                    <Typography> + {t('key.choose')} {nCount}</Typography>
                                    <Divider className='divider_class' />
                                </>}
                            </Box>
                            <Box className='card_count'>
                                <Table className='card_table'>
                                    <TableBody >
                                        <TableRow className='card_tr' >
                                            {Array(numbers)?.fill()?.map((number, i) =>
                                                //  active number class * ${isSystematic?.ticket?.numbers?.find(num => num === i + 1) ? 'card__selected' : ''} *
                                                <TableCell className={`card_td ${((isSystematic?.ticket?.numbers?.find(num => num === i + 1)) && authState?.enableCustomerPickNumber) ? 'card__selected' : ''} `}
                                                    key={i} onClick={() => singleQuickSearch('numbers', i + 1, isSystematic?.activeNumber)}>
                                                    <Typography variant='span'>{i + 1}</Typography>
                                                </TableCell>
                                            )}
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </Box>
                            <Box className='choose_section' sx={{ mt: 1 }}>
                                {pCount > 0 && <Typography> + {t('key.choose')} {pCount}</Typography>}
                                <Divider className='divider_class' />
                            </Box>
                            <Box className='card_count'>
                                <Table className='card_table'>
                                    <TableBody >
                                        <TableRow className='card_tr' >
                                            {Array(powerNumbers)?.fill()?.map((number, i) =>
                                                // active power number class * ${isSystematic?.ticket?.powerNumbers?.find(num => num === i + 1) ? 'card_power_selected' : ''} *
                                                <TableCell className={`card_td ${((isSystematic?.ticket?.powerNumbers?.find(num => num === i + 1)) && !authState?.enableCustomerPickNumber) ? 'card_power_selected' : ''} `}
                                                    key={i} onClick={() => singleQuickSearch('powerNumbers', i + 1, 1)}
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
            </Box>
            <Box className='systematic_details'>
                <Typography className='box_title'>What is a systematic form?</Typography>
                <Typography className='box_description'>A systematic form allows you to play more numbers than a standard ticket. You participate with an entry covering every combination of your selected numbers to increase your chance of winning a prize.</Typography>
                <Box className='box_line_number'>
                    {combination?.map(({ number, combinationOfNumber }, i) => <RadioGroup
                        key={i}
                        aria-labelledby="demo-radio-buttons-group-label"
                        name="radio-buttons-group">
                        <FormControlLabel control={
                            <Radio
                                id={`numbers${i}`}
                                size='small'
                                color={'info'}
                                name="numbers"
                                value={i}
                                checked={isSystematic?.activeNumber === number}
                                onChange={() => handleSystematicNumberRatio(number)} />}
                            label={`${number} ${t('key.numbers')} = ${combinationOfNumber} ${t('key.lines')}`} />
                    </RadioGroup>)}
                </Box>
            </Box>
        </Grid>
    )
}

export default SystematicLotteryCard