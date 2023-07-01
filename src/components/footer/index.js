import React from 'react';
import { Box, Divider, Grid, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import './index.scss';
import app_store from '../../assets/images/app_store.png';
import android_store from '../../assets/images/android_app.png';
import fb from '../../assets/images/fb.png';
import yt from '../../assets/images/yt.png';
import twitter from '../../assets/images/twitter.png';
import insta from '../../assets/images/insta.png';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useNavigate } from 'react-router-dom';

const FooterSection = () => {
    const navigate = useNavigate();
    return (
        <>
            <Grid className='footer-container'>
                <Grid className='footer_section'>
                    <Grid className='footer__details_container'>
                        <Grid className='footer_social_icons'>
                            <Box className='footer__apps'>
                                <Box component={'img'} src={app_store} alt='img' width='120px' height='40px' />
                                <Box component={'img'} sx={{ ml: 3 }} src={android_store} alt='img' width='120px' height='40px' />
                            </Box>
                            <Box className='footer_social_app'>
                                <Box component={'img'} src={fb} alt='img' width='40px' height='40px' />
                                <Box component={'img'} src={yt} alt='img' width='40px' height='40px' />
                                <Box component={'img'} src={twitter} alt='img' width='40px' height='40px' />
                                <Box component={'img'} src={insta} alt='img' width='40px' height='40px' />
                            </Box>
                        </Grid>
                        <Divider sx={{ mt: 4, mb: 5 }} />
                        <Box>
                            <Typography className='footer_text'>
                                This website is operated by Lotto Direct Limited, a company registered in Malta (registration number: C77583) having its registered office at Vision Exchange Building, Level 1, Triq it-Territorjals, Zone 1, Central Business District, CBD 1070, Birkirkara, Malta. Phone number: +44 20 3150 0476. Lotto Direct Limited is licensed and regulated by the Malta Gaming Authority (License: MGA/CRP/402/2017 issued on 01/08/2018).
                            </Typography>
                            <Typography className='footer_text' sx={{ mt: 4 }}>
                                Lotto Direct Limited and its associated brands operate as an independent ticket purchasing service and are neither associated with nor endorsed by MUSL, Française des Jeux, Loterías y Apuestas del Estado, or any company that manages any product for which their services are employed.
                            </Typography>
                            <Typography sx={{ mt: 2 }} className='link_text'><ErrorOutlineIcon /> Gambling can be harmful if not controlled. Please play responsibly.</Typography>
                        </Box>
                        <Table className='footer_table_container'>
                            <TableHead>
                                <TableRow>
                                    <TableCell variant='head'>Policies</TableCell>
                                    <TableCell variant='head'>About Us</TableCell>
                                    <TableCell variant='head'>Information</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell onClick={() => navigate(`/content/terms-of-use`)}>Terms of Use</TableCell>
                                    <TableCell onClick={() => navigate(`/content/about-us`)}>About Us</TableCell>
                                    <TableCell>Payment Methods</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Cookie Policy</TableCell>
                                    <TableCell>theLotter Affiliates</TableCell>
                                    <TableCell>FAQ</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell onClick={() => navigate(`/content/privacy-policy`)}>Privacy Notice</TableCell>
                                    <TableCell onClick={() => navigate(`/content/contact-us`)}>Contact Us</TableCell>
                                    <TableCell>Lottery Taxes</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell></TableCell>
                                    <TableCell>RSS</TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </Grid>
                </Grid>
            </Grid>
        </>
    )
}

export default FooterSection