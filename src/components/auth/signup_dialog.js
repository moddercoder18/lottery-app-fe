import React, { useState } from 'react';
import Button from '@mui/material/Button';
import { FormControl, InputLabel, Box, OutlinedInput, Typography, Checkbox, InputAdornment, IconButton, FormHelperText, Select, MenuItem, RadioGroup, FormControlLabel, CircularProgress } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import './index.scss'
import Countries from '../../utils/countryList';
import { useFormik } from "formik";
import * as yup from "yup";
import { toast } from 'react-toastify';
import Services from '../../services/services';
import { useTranslation } from 'react-i18next';

const SignupDialog = ({ open, isSign }) => {
    const {t}= useTranslation()
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false)
    const [tc, setTc] = useState(false)

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const validationSchema = yup.object({
        name: yup.string().required(t("error.name")),
        email: yup.string().required(t("error.email")),
        password: yup.string().required(t("error.password")),
        country: yup.string().required(t("error.country")),
    })

    const formik = useFormik({
        initialValues: { name: "", email: "", password: '', country: "" },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            if (!tc) {
                toast['error']('Please Accept terms and conditions.')
            } else {
                setLoading(true)
                try {
                    const result = await Services.signup(formik?.values);
                    if (result.data && result.data.token) {
                        toast['success']('User created successfully!')
                        isSign()
                        setLoading(false)
                    }
                } catch (err) {
                    setLoading(false)
                }
            }
        },
    });
    return (
        <>
            <Box className='auth_title'>{t("signup.title")}</Box>
            <Box sx={{ display: 'flex', flexDirection: 'column' }} component={'form'} noValidate onSubmit={formik?.handleSubmit} >
                <OutlinedInput placeholder={t("key.name")}
                    name='name'
                    size='small'
                    error={!!formik.errors?.name}
                    onChange={formik?.handleChange}
                />

                {formik.errors?.name && (
                    <FormHelperText htmlFor="form-selector" error={!!formik.errors?.name}>
                        {formik.errors?.name}
                    </FormHelperText>
                )}

                <OutlinedInput placeholder={t("key.email")}
                    name='email'
                    size='small'
                    sx={{ mt: 2 }}
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

                <FormControl fullWidth sx={{ mt: 3 }}>
                    <InputLabel className='country_label' id="demo-simple-select-label">{t("signup.country")}</InputLabel>
                    <Select labelId="demo-simple-select-label" value={formik?.values?.country}
                        label={t("signup.country")}
                        size='small'
                        name='country'
                        onChange={formik?.handleChange}
                        error={!!formik.errors?.country}>
                        {Countries?.map((country, index) => <MenuItem value={country} key={index}>{country}</MenuItem>)}
                    </Select>

                    {formik.errors?.country && (
                        <FormHelperText htmlFor="form-selector" error={!!formik.errors?.country}>
                            {formik.errors?.country}
                        </FormHelperText>
                    )}

                </FormControl>
                <RadioGroup>
                    <Box sx={{ display: 'flex', mt: 1 }} >
                        <Checkbox className='checkbox_sign' name='tc' onChange={(e) => setTc(e.target.checked)} />
                        <Typography className="info_text">{t("signup.t&c")}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', mt: 1 }} >
                        <Checkbox className='checkbox_sign' defaultChecked={true} />
                        <Typography className="info_text">{t("signup.promotion_emails")}</Typography>
                    </Box>
                </RadioGroup>
                <Button variant='contained' type='submit' disabled={loading} className='auth_button' >{t("key.signup")}</Button>
                <Box className='auth_shuffle_text'>
                    <Typography className='info_text' sx={{ m: 1 }}>{t("login.or")}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography className='info_text'>{t("signup.registered")}</Typography>
                        <Typography className='hyper_text' sx={{ ml: 1 }} onClick={isSign}>{t("signup.click_here")}</Typography>
                        <Typography className='info_text' sx={{ ml: 1 }}>{t("signup.to_login")}.</Typography>
                    </Box>
                </Box>
            </Box>
        </>
    )
}

export default SignupDialog