import React from 'react'
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom';
import { handleDynamicContent } from '../../redux/actions/lottery.action';
import Layout from './layout';
import { Box } from '@mui/material';

const DynamicPage = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const state = useSelector(state => state?.LotteryReducer)
    const { page } = useParams()
    useEffect(() => {
        dispatch(handleDynamicContent(page))
    }, [page, dispatch])
    return (
        <Box dangerouslySetInnerHTML={{ __html: `${t(state?.dynamicContent?.content[window.localStorage.getItem('language')|| 'en'])}` }}></Box>
    )
}

export default Layout(DynamicPage)