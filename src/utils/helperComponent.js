import { Box, FormControlLabel, Grid, Radio, Typography } from "@mui/material"
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

export const bannerImages = () => {
    return (
        <Grid container className='ticket_details_banner' >
            <Grid item className='lottery_banner_join' sx={{ ml: { sm: 0 , md:4} }}>
                <Box component={'img'} alt='image_section' src={'https://www.thelotter.com/objects/dm.tlo?id=29476&v=20230402'} />
            </Grid>
            <Grid item className='lottery_banner_other'>
                <Grid item lg={4} className='icon-text-container'>
                    <Box component={'img'} alt='image_section' src={'https://www.thelotter.com/App_Themes/Default/images/JoinTheFunElement/safe-illustration-v2.png?v=20230402'} />
                    <Typography>Simple, safe & secure</Typography>
                </Grid>
                <Grid item lg={4} className='icon-text-container'>
                    <Box component={'img'} alt='image_section' src={'https://www.thelotter.com/App_Themes/Default/images/JoinTheFunElement/tickets-illustration-v2.png?v=20230402'} />
                    <Typography>Official tickets</Typography>
                </Grid>
                <Grid item lg={4} className='icon-text-container'>
                    <Box component={'img'} alt='image_section' src={'https://www.thelotter.com/App_Themes/Default/images/JoinTheFunElement/commission-illustration-v2.png?v=20230402'} />
                    <Typography> No commission on wins</Typography>
                </Grid>
            </Grid>
        </Grid>
    )
}

export const entryType = ({ entryType, setEntryType, lines }) => {
    return <Box className='entry__type'>
        <Box className='choosen_entry_type'>Choose entry type <HelpOutlineIcon /></Box>
        <Box sx={{ display: 'flex' }}>
            <Box sx={{ width: '180px' }}>
                <FormControlLabel value="one_time_entry" control={
                    <Radio onChange={() => setEntryType('one_time_entry')}
                        checked={entryType === 'one_time_entry'} />
                } label="One-Time Entry" />
            </Box>
            {/* <Box sx={{ display: 'flex', width: '506px' }}>
                <Box className='subscription' />
                <Box>
                    <FormControlLabel value="multi_draw" disabled={lines?.length > 5} control={
                        <Radio
                            // onChange={() => setEntryType('multi_draw')}
                            checked={entryType === 'multi_draw'} />
                    } label=" Multi-Draw" />
                    <select disabled={lines?.length > 5}>
                        <option value={'5 '}>5 Draws (15% Off)</option>
                        <option value={'10'}>10 Draws (20% Off) <Typography className='bolded'>Recommended!</Typography></option>
                        <option value={'15'}>15 Draws (21.5% Off)</option>
                        <option value={'25'}>25 Draws (22.5% Off)</option>
                        <option value={'52'}>52 Draws (25% Off)</option>
                    </select>
                </Box>
            </Box> */}
            {/* <Box>
                <FormControlLabel value="subscription" control={
                    <Radio
                        // onChange={() => setEntryType('subscription')}
                        checked={entryType === 'subscription'} />
                } label=" Subscription" />
                <Box className='sale-container'>
                    <Box className='arrow-up' />
                    <Box className='sale_title'>
                        <Typography>Every 7th ticket is FREE!</Typography>
                    </Box>
                </Box>
            </Box> */}
        </Box>
    </Box>
}