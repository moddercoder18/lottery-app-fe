import React, { useState } from 'react';
import { Grid, Box, List, ListItem } from '@mui/material'
import './index.scss';
import logo from '../../assets/images/lottery_logo.png'
import LoginDialog from '../auth/login_dialog';
import { useLocation, useNavigate } from 'react-router-dom';
import TranslateIcon from '@mui/icons-material/Translate';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useDispatch, useSelector } from 'react-redux';
import { logoutAction } from '../../redux/actions/auth.action'
import i18next from 'i18next';
import { useTranslation } from "react-i18next";
import PrizeConverter from '../../utils/prizeConverter.js'

const HeaderSection = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { t } = useTranslation();

  const userInfo = useSelector(state => state?.AuthReducer?.userData)
  const [isAuth, setIsAuth] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchoE2, setAnchorE2] = useState(null)
  const open = Boolean(anchorEl);
  const openLanguage = Boolean(anchoE2)

  const handleLanguage = e => {
    const { myValue } = e.currentTarget.dataset;
    i18next.changeLanguage(myValue)
    window.localStorage.setItem('language', myValue)
    setAnchorE2(null)
  }
  const handleLogout = () => {
    dispatch(logoutAction())
    setAnchorEl(null)
    navigate('/lottery-tickets')
  }

  const handleChange = (key) => {
    navigate(`/${key}`);
    setAnchorEl(null)
  }

  return (
    <>
      <Grid className='header_main_container'>
        <Grid className='header-content-wrapper'>
          <Grid className='header_background'></Grid>
          <Grid className='header_container'>
            <Box className='header_seaction'>
              <List>
                <ListItem onClick={() => navigate('/lottery-tickets')}>
                  <Box component={'img'} src={logo} alt='logo' width={'100px'} className='pointer' />
                </ListItem>
                <ListItem onClick={() => handleChange('lottery-results')}
                  className={pathname.includes('lottery-results') ? "active_head_tab" : ''}>
                  {t('key.results')} | {t('key.info')}
                </ListItem>
                {/* <ListItem className="active_head_tab">{t('key.lotteries')}</ListItem> */}
              </List>
            </Box>
            <Box className='header_auth_section'>
              <List>
                {userInfo ? <ListItem onClick={() => navigate('/transactions')} aria-controls={openLanguage ? 'basic-wallet' : undefined} className='lanuage__button'>
                  <AccountBalanceWalletOutlinedIcon sx={{ fontSize: '17px' }} />
                  <Box className='wallet_amount'>
                    <PrizeConverter n={userInfo?.wallet?.amount} />
                  </Box>
                </ListItem> : ""}
                {!userInfo ? <ListItem className='header_auth_button' onClick={() => setIsAuth(true)}>
                  <PersonOutlinedIcon />{t('key.login')} / {t('key.signup')}
                </ListItem> :

                  <ListItem aria-controls={open ? 'basic-menu' : undefined} className='lanuage__button' onClick={(event) => setAnchorEl(event?.currentTarget)}>
                    <PersonOutlinedIcon />
                  </ListItem>
                }
                <Menu
                  id="basic-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={() => setAnchorEl(null)}
                  MenuListProps={{
                    'aria-labelledby': 'basic-button',
                  }}
                >
                  <MenuItem disabled>{userInfo?.name}</MenuItem>
                  <MenuItem onClick={() => handleChange('profile')}>{t('key.my_account')}</MenuItem>
                  <MenuItem onClick={() => handleChange('my-tickets')}>{t('key.my_tickets')}</MenuItem>
                  <MenuItem onClick={() => handleChange('change-password')}>{t('key.update_pwd')}</MenuItem>
                  <MenuItem onClick={() => handleLogout()}>{t('key.logout')}</MenuItem>
                </Menu>

                <ListItem aria-controls={openLanguage ? 'basic-language' : undefined} className='lanuage__button' onClick={(event) => setAnchorE2(event?.currentTarget)}>
                  <TranslateIcon />
                </ListItem>

                <Menu
                  id="basic-language"
                  anchorEl={anchoE2}
                  open={openLanguage}
                  onClose={() => setAnchorE2(null)}
                  MenuListProps={{
                    'aria-labelledby': 'basic-button',
                  }}
                >
                  <MenuItem data-my-value={'en'} onClick={handleLanguage}>English</MenuItem>
                  <MenuItem data-my-value={'hi'} onClick={handleLanguage}>हिंदी (Hindi)</MenuItem>
                  <MenuItem data-my-value={'zh'} onClick={handleLanguage}>中国人 (Chinese)</MenuItem>
                  <MenuItem data-my-value={'ko'} onClick={handleLanguage}>한국인 (Korean)</MenuItem>
                  <MenuItem data-my-value={'ja'} onClick={handleLanguage}>日本 (Japanese)</MenuItem>
                  <MenuItem data-my-value={'vi'} onClick={handleLanguage}>Tiếng Việt (Vietnamese)</MenuItem>
                  <MenuItem data-my-value={'fil'} onClick={handleLanguage}>Pilipino (Filipino)</MenuItem>
                  <MenuItem data-my-value={'ms'} onClick={handleLanguage}>Melayu (Malay)</MenuItem>
                  <MenuItem data-my-value={'id'} onClick={handleLanguage}>Indonesia (Indonesia)</MenuItem>
                </Menu>
              </List>
            </Box>
          </Grid>
        </Grid>
      </Grid >
      <LoginDialog open={isAuth} handleClose={() => setIsAuth(false)} />
    </>
  )
}

export default (HeaderSection)