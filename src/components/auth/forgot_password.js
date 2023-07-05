import React, { useState } from 'react'
import Layout from '../hoc/layout';
import { Box, Button, CircularProgress, FormHelperText, Grid, OutlinedInput, Typography } from '@mui/material'
import './index.scss';
import { useFormik } from "formik";
import * as yup from "yup";
import { toast } from 'react-toastify';
import { Services } from '../../services';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const ForgotPassword = () => {
    let { token } = useParams();
    const { t } = useTranslation();
    const [info, setInfo] = useState({
        email: '',
        loading: false
    })
    const validationSchema = yup.object({
        email: yup.string().required(t('error.email')),
        password: yup.string().required(t('error.password')),
    })

    const formik = useFormik({
        initialValues: { email: "", password: '' },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            setInfo({ ...info, loading: true })
            try {
                const payload = { ...values, passwordResetToken: token }
                const result = await Services.resetPassword(payload);
                setInfo({ ...info, loading: false })
                if (result?.status < 400) toast['success']('Password updated successfully!')
            } catch (err) { setInfo({ ...info, loading: false }) }
        }
    });

    const handleForgotPasswordMail = async () => {
        try {
            setInfo({ ...info, loading: true })
            const result = await Services.forgotPassword({ email: info.email });
            if (result?.status < 400) toast['success']('Mail sent successfully!')
            setInfo({ email: '', loading: false })
        } catch (err) { setInfo({ email: '', loading: false }) }
    }

    return (
        <>
            <Box className='forgot_pwd_container'>
                <Typography className='forgot_pwd_heading'>{t('titles.forgot_pwd')}</Typography>
                <Typography className='forgot_pwd_text text_gray'>{t('titles.forgot_pwd_subtitle')}</Typography>
                {token ?
                    <Box component={"form"}
                        noValidate
                        onSubmit={formik?.handleSubmit}
                    >
                        <Grid container sx={{ display: 'flex', mt: 2, justifyContent: 'space-between' }}>
                            <Grid item lg={4}>
                                <Typography className='text_gray'>{t('key.email')}: <Typography variant='span' sx={{ color: 'red' }}>*</Typography></Typography>
                            </Grid>
                            <Grid item lg={8} className='forget_pwd_sub'>
                                <OutlinedInput size='small' name='email' onChange={formik?.handleChange} />
                                {formik.errors?.email && (
                                    <FormHelperText htmlFor="form-selector" error={!!formik.errors?.email}>
                                        {formik.errors?.email}
                                    </FormHelperText>
                                )}
                            </Grid>
                        </Grid>
                        <Grid container sx={{ display: 'flex', mt: 2, justifyContent: 'space-between' }}>
                            <Grid item lg={4}>
                                <Typography className='text_gray'>{t('key.password')}: <Typography variant='span' sx={{ color: 'red' }}>*</Typography></Typography>
                            </Grid>
                            <Grid item lg={8} className='forget_pwd_sub'>
                                <OutlinedInput size='small' name='password' onChange={formik?.handleChange} />
                                {formik.errors?.password && (
                                    <FormHelperText htmlFor="form-selector" error={!!formik.errors?.password}>
                                        {formik.errors?.password}
                                    </FormHelperText>
                                )}
                                <Button variant='contained' type='submit'
                                    disabled={info?.loading}
                                    className='submit_format'>
                                    {info?.loading ? <CircularProgress size={20} /> : t('key.submit')}
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                    : <Grid container sx={{ display: 'flex', mt: 2, justifyContent: 'space-between' }}>
                        <Grid item lg={4}>
                            <Typography className='text_gray'>{t('key.email')}: <Typography variant='span' sx={{ color: 'red' }}>*</Typography></Typography>
                        </Grid>
                        <Grid item lg={8} className='forget_pwd_sub'>
                            <OutlinedInput size='small' onChange={(e) => setInfo({ ...info, email: e?.target?.value })} />
                            <Button variant='contained' className='submit_format' disabled={info?.loading} onClick={handleForgotPasswordMail}>
                                {info?.loading ? <CircularProgress size={20} /> : t('key.submit')}</Button>
                        </Grid>
                    </Grid>}
            </Box>
        </>
    )
}

export default Layout(ForgotPassword)