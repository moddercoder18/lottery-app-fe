import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { Box, OutlinedInput, Typography, InputAdornment, IconButton, FormHelperText, CircularProgress } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import './index.scss'
import { useNavigate } from 'react-router-dom';
import DialogTitle from '@mui/material/DialogTitle';
import CloseIcon from "@mui/icons-material/Close";
import { useFormik } from "formik";
import * as yup from "yup";

import SignupDialog from './signup_dialog';
import { useDispatch, useSelector } from 'react-redux';
import { handleLoginAction } from '../../redux/actions/auth.action';
import { useTranslation } from "react-i18next";

const LoginDialog = ({ open, handleClose }) => {

  const naviagte = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const state = useSelector(state => state);
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setLogin] = useState(true);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  useEffect(() => {
    if (!!state?.AuthReducer?.userData) {
      handleClose()
    }
  }, [state?.AuthReducer?.userData])

  const handleForgot = () => {
    naviagte('/forgot-password');
    handleClose()
  }

  const validationSchema = yup.object({
    email: yup.string().required(t("error.email")),
    password: yup.string().required(t("error.password")),
  })

  const formik = useFormik({
    initialValues: { email: "", password: '' },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      dispatch(handleLoginAction(values))
    },
  });

  return (
    <>
      <Dialog open={open}>
        <DialogTitle sx={{ textAlign: 'end' }}>
          <CloseIcon className='pointer' onClick={handleClose} />
        </DialogTitle>
        <DialogContent sx={{ p: 7, width: '350px' }}>
          {isLogin ? <>
            <Box className='auth_title'>{t('login.title')}</Box>
            <Box sx={{ display: 'flex', flexDirection: 'column' }} component={'form'} noValidate onSubmit={formik?.handleSubmit} >
              <OutlinedInput placeholder={t("key.email")}
                name='email'
                size='small'
                error={!!formik.errors?.email}
                onChange={formik?.handleChange}
              />

              {formik.errors?.email && (
                <FormHelperText htmlFor="form-selector" error={!!formik.errors?.email}>
                  {formik.errors?.email}
                </FormHelperText>
              )}

              <OutlinedInput
                size='small' name='password'
                autoComplete='off'
                type={showPassword ? 'text' : 'password'}
                placeholder={t("key.password")}
                sx={{ mt: 2 }}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => handleClickShowPassword('password')}
                      onMouseDown={(e) => e.preventDefault()}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                error={!!formik.errors?.password}
                onChange={formik?.handleChange}
              />

              {formik.errors?.password && (
                <FormHelperText htmlFor="form-selector" error={!!formik.errors?.password}>
                  {formik.errors?.password}
                </FormHelperText>
              )}

              <Button variant='contained' className='auth_button' type='submit' disabled={state?.AuthReducer?.loading}>
                {state?.AuthReducer?.loading ? <CircularProgress size={30} /> : `${t('login.login')}`}
              </Button>
              <Box className='auth_shuffle_text'>
                <Typography className='hyper_text' onClick={() => handleForgot()}>{t('login.forgot_password')}</Typography>
                <Typography className='info_text' sx={{ m: 1 }}>{t('login.or')}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography className='info_text'>{t('login.not_register')}</Typography>
                  <Typography className='hyper_text' sx={{ ml: 1 }} onClick={() => setLogin(false)}>{t('login.create_new')} </Typography>
                </Box>
              </Box>
            </Box>
          </> :
            <>
              <SignupDialog isSign={() => setLogin(true)} />
            </>
          }
        </DialogContent>
      </Dialog>
    </>
  )
}

export default LoginDialog