import React from 'react'
import Layout from '../hoc/layout';
import { Box, Button, CircularProgress, FormHelperText, Grid, OutlinedInput, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { useFormik } from "formik";
import * as yup from "yup";
import { toast } from 'react-toastify';
import { Services } from '../../services';

const ChangePassword = () => {
    const { t } = useTranslation();
    const [info, setInfo] = useState({
        oldPassword: '',
        newPassword: '',
        loading: false
    })

    const validationSchema = yup.object({
        newPassword: yup.string().required(t('error.password')),
        oldPassword: yup.string().required(t('error.password')),
    })

    const formik = useFormik({
        initialValues: { newPassword: "", oldPassword: '' },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            setInfo({ ...info, loading: true })
            try {
                const result = await Services.changePassword(values);
                setInfo({ ...info, loading: false })
                if (result?.status < 400) toast['success']('Password updated successfully!')
            } catch (err) { setInfo({ ...info, loading: false }) }
        }
    });

    return (
        <Box className='forgot_pwd_container'>
            <Typography className='forgot_pwd_heading'>{t('key.update_pwd')}</Typography>
            <Box component={"form"}
                noValidate
                onSubmit={formik?.handleSubmit}
            >
                <Grid container sx={{ display: 'flex', mt: 2, justifyContent: 'space-between' }}>
                    <Grid item lg={4}>
                        <Typography className='text_gray'>{t('key.old_password')} :
                            <Typography variant='span' sx={{ color: 'red' }}> *</Typography>
                        </Typography>
                    </Grid>
                    <Grid item lg={8} className='forget_pwd_sub'>
                        <OutlinedInput size='small' name='oldPassword' onChange={formik?.handleChange} />
                        {formik.errors?.oldPassword && (
                            <FormHelperText htmlFor="form-selector" error={!!formik.errors?.oldPassword}>
                                {formik.errors?.oldPassword}
                            </FormHelperText>
                        )}
                    </Grid>
                </Grid>
                <Grid container sx={{ display: 'flex', mt: 2, justifyContent: 'space-between' }}>
                    <Grid item lg={4}>
                        <Typography className='text_gray'>{t('key.new_password')} :
                            <Typography variant='span' sx={{ color: 'red' }}> *</Typography>
                        </Typography>
                    </Grid>
                    <Grid item lg={8} className='forget_pwd_sub'>
                        <OutlinedInput size='small' name='newPassword' onChange={formik?.handleChange} />
                        {formik.errors?.newPassword && (
                            <FormHelperText htmlFor="form-selector" error={!!formik.errors?.newPassword}>
                                {formik.errors?.newPassword}
                            </FormHelperText>
                        )}
                        <Button variant='contained' type='submit'
                            disabled={info?.loading}
                            className='submit_format'>
                            {info?.loading ? <CircularProgress size={20} /> : t('key.update')}
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    )
}

export default Layout(ChangePassword)