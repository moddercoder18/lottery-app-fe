import React, { useEffect, useState } from 'react'
import Layout from '../hoc/layout';
import './index.scss';
import { Typography, Box, Paper, OutlinedInput, Button, FormHelperText, CircularProgress } from '@mui/material';
import user from '../../assets/images/user_demo_image.jpeg';
import EditIcon from '@mui/icons-material/Edit';
import { redirect, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from "formik";
import * as yup from "yup";
import { Services } from '../../services';
import { toast } from 'react-toastify';
import { getUserAction } from '../../redux/actions/auth.action';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { useTranslation } from 'react-i18next';

const MyAccount = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const userInfo = useSelector(state => state?.AuthReducer);
    const [active, setEdit] = useState({
        isEdit: false,
        loading: false
    })

    useEffect(() => {
        if (!userInfo?.userData) {
            navigate('/lottery-tickets')
        }
    }, [userInfo?.userData])

    const validationSchema = yup.object({
        name: yup.string().required(t('error.name')),
    });
    const formik = useFormik({
        initialValues: { name: "" },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            setEdit({ ...active, loading: true })
            const payload = {
                email: userInfo?.userData?.email,
                name: values.name,
            };
            const result = await Services.userUpdate(payload);
            if (result.status < 400) {
                toast.success("User updated successfully!");
                dispatch(getUserAction())
                setEdit({ isEdit: false, loading: false });
            }
        },
    });

    const handleEditData = () => {
        setEdit({ isEdit: true })
        formik.setValues({ name: userInfo?.userData?.name });
    }

    const changePicture = async (e) => {
        if (e?.target?.files[0]) {
            let formData = new FormData();
            formData.append("file", e?.target?.files[0]);
            const result = await Services.userProfilePicture(formData);
            if (result.status < 400) {
                dispatch(getUserAction())
                toast.success("Profile updated successfully!");
            }
        }
    };

    const handleCopyCode = () => {
        toast.success('Promo code copied!')
        navigator?.clipboard?.writeText(userInfo?.userData?.coupon?.code)
    }
    return (
        <>
            <Box className='container'>
                <Typography variant='h4'>{t('key.my_account')}</Typography>
                <Box className='account_conatainer'>
                    <Typography sx={{ mb: 1 }}>{t('titles.personal_details')}</Typography>
                    <Paper sx={{ p: 2, display: 'flex' }}>
                        <Box className='profile__img'>
                            <>
                                <input
                                    type="file"
                                    onChange={changePicture}
                                    accept="image/*"
                                    style={{ display: "none" }}
                                    id="contained-button-file"
                                />
                                <label htmlFor="contained-button-file" className='contained-button-file'>
                                    {/* <Box
                                        color="primary"
                                        component="span"
                                        className="linear-button change-profile-button"
                                        variant="outlined"
                                    >
                                    </Box> */}
                                </label>
                            </>
                            <Box component={'img'} src={userInfo?.userData?.profilePicture || ''}
                                onError={(event) => {
                                    event.target.src = user;
                                    event.onerror = null;
                                }} />
                        </Box>

                        <Box className='profile__details'>
                            {!active?.isEdit ? <>
                                <Box className='profile__text'>{t('titles.account_status')}< EditIcon className='pointer' onClick={(e) => handleEditData(e)} /></Box>
                                <Typography className='text_name'>{userInfo?.userData?.name}</Typography>
                                <Typography>{userInfo?.userData?.email}</Typography>
                            </> :
                                <Box component={"form"}
                                    noValidate
                                    onSubmit={formik?.handleSubmit}>
                                    <Typography>{t('key.name')}</Typography>
                                    <OutlinedInput
                                        disabled={!active?.isEdit}
                                        placeholder={t('key.name')}
                                        value={formik?.values?.name}
                                        size="small"
                                        fullWidth
                                        name="name"
                                        onChange={formik?.handleChange}
                                        error={formik.touched.name && Boolean(formik.errors.name)}
                                    />
                                    {formik.errors?.name && (
                                        <FormHelperText error={Boolean(formik.errors?.name)}>
                                            {formik.errors?.name}
                                        </FormHelperText>
                                    )}
                                    <Box className='actions__row'>
                                        <Button color='secondary' onClick={() => setEdit({ isEdit: false })}>{t('key.back')}</Button>
                                        <Button type='submit' variant='contained' color='secondary'>
                                            {active?.loading ? <CircularProgress size={30} /> : t('key.update')}
                                        </Button>
                                    </Box>
                                </Box>
                            }
                        </Box>
                    </Paper>
                </Box >

                <Box className=''>
                    <Typography sx={{ mb: 1 }}>{t('coupon.coupons')}</Typography>
                    <Paper sx={{ p: 2, display: 'flex' }}>
                        <Box className='coupon____copy'>
                            <Typography>{t('coupon.promo_code')} : {userInfo?.userData?.coupon?.code}</Typography>
                            <ContentCopyIcon sx={{ ml: 3 }} className='pointer' onClick={() => handleCopyCode()} />
                        </Box>
                        {/* <Button onClick={() => navigate(`https://web.whatsapp.com/send?text=${userInfo?.userData?.coupon?.code}`)}> */}
                        {/* <WhatsAppIcon onClick={() => redirect(`https://web.whatsapp.com/send?text=${userInfo?.userData?.coupon?.code}`)} /> */}
                        {/* </Button> */}
                    </Paper>
                </Box>
            </Box >
        </>
    )
}

export default Layout(MyAccount)