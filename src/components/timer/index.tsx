import {IconButton, Box, Button, Container, Paper, Typography} from '@mui/material';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import {red,green, purple} from '@mui/material/colors';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import DeleteIcon from '@mui/icons-material/Delete';

// bgcolor: green["50"],

const Timer = () => {
    return (
        <Paper sx={{
            bgcolor: red["500"],
            p: 2,
            width: "500px",
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            rowGap:'10px',
        }}>
            <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <Typography variant="h1" gutterBottom sx={{mb: 2}}>
                    00:00
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                    iteration: 1
                </Typography>
            </Box>
            <Box>
                <Button variant="contained" size="large" sx={{width:"180px"}}>Start</Button>
                <IconButton aria-label="skip" size="large" sx={{ml:1}}> <SkipNextIcon fontSize="inherit"/></IconButton>
            </Box>
            <Box sx={{width: "100%", textAlign: "right", pt: 3, }}>
                <Button variant="contained" size="small" color="warning" startIcon={<DeleteIcon/>}>Reset</Button>
            </Box>
        </Paper>
    );
};

export default Timer;
