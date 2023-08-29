"use client"
import {IconButton, Box, Button, Container, Paper, Typography} from '@mui/material';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import {red, green, purple} from '@mui/material/colors';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import DeleteIcon from '@mui/icons-material/Delete';
import {Iteration} from '@/lib/pomodro';
import {useEffect, useState} from "react";

import useInterval from 'use-interval'
// bgcolor: green["50"],

const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return m.toString().padStart(2, '0') + ":" + s.toString().padStart(2, '0');
};
const Timer = () => {
    const [count, setCount] = useState(0);
    const [seconds, setSeconds] = useState(0);
    const [timerRunning, setTimerRunning] = useState(false);

    const finishIteration = () => {
        setCount((v) => v + 1);
        setIteration(new Iteration(5, finishIteration));
    }
    const [iteration, setIteration] = useState(new Iteration(3, finishIteration));

    useInterval(() => {
        setSeconds(() => iteration.seconds);
        setTimerRunning(() => iteration.running);
    }, 300);


    const startTimer = () => {
        iteration.start();
    }
    const stopTimer = () => {
        iteration.stop();
    }

    const startStopButton = () => {
        if (timerRunning) {
            return (<Button variant="contained" size="large" sx={{width: "180px"}} onClick={stopTimer}>stop</Button>)
        } else {
            return (<Button variant="contained" size="large" sx={{width: "180px"}} onClick={startTimer}>start</Button>)
        }
    }

    return (
        <Paper sx={{
            bgcolor: red["500"],
            p: 2,
            width: "500px",
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            rowGap: '10px',
        }}>
            <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <Typography variant="h1" gutterBottom sx={{mb: 2}}>
                    {formatTime(iteration.seconds)}
                    {/*{iteration.seconds}*/}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                    iteration: {count + 1}
                </Typography>
            </Box>
            <Box>
                {startStopButton()}
                <IconButton aria-label="skip" size="large" sx={{ml: 1}}> <SkipNextIcon fontSize="inherit"/></IconButton>
            </Box>
            <Box sx={{width: "100%", textAlign: "right", pt: 3,}}>
                <Button variant="contained" size="small" color="warning" startIcon={<DeleteIcon/>}>Reset</Button>
            </Box>
        </Paper>
    );
};

export default Timer;
