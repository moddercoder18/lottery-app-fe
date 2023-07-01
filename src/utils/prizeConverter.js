import React from 'react';
import { Typography, Box } from '@mui/material'
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

const PrizeConverter = ({ n, className }) => {
    const { t } = useTranslation();
    const setting = useSelector(state => state?.AuthReducer?.settings);
    const rates = setting?.currency?.rates || {};
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

    const currency = rateCurrencies[window.localStorage.getItem('language') || 'en']
    const multiplierPrize = (rates[currency] || 1)

    const converter = (e) => {
        const prize = e * multiplierPrize;
        return Intl.NumberFormat((window.localStorage.getItem('language') || 'en'), {
            style: 'currency',
            minimumIntegerDigits: 1,
            currency,
            currencyDisplay: 'symbol'
        }).format(prize);
    }

    return (
        <>
            {(n < 1e3) && <Box sx={{ display: 'flex' }}>
                <Typography className={className} sx={{ mr: 1, ml: 1 }}>{converter(n)}</Typography>
            </Box>}
            {(n >= 1e3 && n < 1e6) && <Box sx={{ display: 'flex' }}>
                <Typography className={className} sx={{ mr: 1, ml: 1 }}>{converter(n / 1e3)}</Typography>
                <Typography variant='span' className='prize_text'>K</Typography>
            </Box>}
            {(n >= 1e6 && n < 1e9) && <Box sx={{ display: 'flex' }}>
                <Typography className={className} sx={{ mr: 1, ml: 1 }}>{converter(n / 1e6)}</Typography>
                <Typography variant='span' className='prize_text'>{t('key.million')}</Typography>
            </Box>}
            {(n >= 1e9 && n < 1e12) && <Box sx={{ display: 'flex' }}>
                <Typography className={className} sx={{ mr: 1, ml: 1 }}>{converter(n / 1e9)}</Typography>
                <Typography variant='span' className='prize_text'>{t('key.billion')}</Typography>
            </Box>}
            {(n >= 1e12) && <Box sx={{ display: 'flex' }}>
                <Typography className={className} sx={{ mr: 1, ml: 1 }}>{converter(n / 1e12)}</Typography>
                <Typography variant='span' className='prize_text'>T</Typography>
            </Box>}
        </>
    )
}

export default PrizeConverter