"use client"
import {IconButton, Box, Button, Container, Paper, Typography} from '@mui/material';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import {red, green, purple} from '@mui/material/colors';
import DeleteIcon from '@mui/icons-material/Delete';
import {Iteration, IterationSet} from '@/lib/pomodro';
import {useEffect, useState} from "react";

import useInterval from 'use-interval'

const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return m.toString().padStart(2, '0') + ":" + s.toString().padStart(2, '0');
};

type IterationValue = {
    seconds: number;
    running: boolean;
};

const generateInitialIterationSet=()=>{
   return new IterationSet() ;
}

const Timer = () => {
    const [iterationValue, setIterationValue] = useState<IterationValue | null>(null);
    const [iterationSet, setIterationSet] = useState(generateInitialIterationSet());

    useInterval(() => {
        const iteration = iterationSet.getCurrentIteration();
        setIterationValue({seconds: iteration.seconds, running: iteration.running});
    }, 300);


    const startTimer = () => {
        iterationSet.getCurrentIteration().start();
    }
    const stopTimer = () => {
        iterationSet.getCurrentIteration().stop();
    }

    const startStopButton = () => {
        if (iterationValue?.running) {
            return (<Button variant="contained" size="large" sx={{width: "180px"}} onClick={stopTimer}>stop</Button>)
        } else {
            return (<Button variant="contained" size="large" sx={{width: "180px"}} onClick={startTimer}>start</Button>)
        }
    }
    const iterationCount = () => {
        if (iterationSet.state == 'WORK') {
            return iterationSet.workCount + 1;
        } else {
            return iterationSet.workCount;
        }
    };
    const bgcolor = () => {
        return iterationSet.state == "WORK" ? red["400"] : green["200"];
    };

    const skipBreak = () => {
        iterationSet.goToNext();
        // const iteration = iterationSet.getCurrentIteration();
        // setIterationValue({seconds: iteration.seconds, running: iteration.running});
    }

    const onClickReset = () => {
        iterationSet.iteration.stop();
        setIterationSet(generateInitialIterationSet());
    }

    return (
        <Paper sx={{
            bgcolor: bgcolor(),
            p: 2,
            width: "500px",
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            rowGap: '10px',
        }}>
            <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <Typography variant="h1" gutterBottom sx={{mb: 2}}>
                    {iterationValue ? formatTime(iterationValue.seconds) : ""}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                    iteration: {iterationCount()}
                </Typography>
            </Box>
            <Box>
                {startStopButton()}

                {iterationSet.state != 'WORK' &&
                    <IconButton aria-label="skip" size="large" sx={{ml: 1}} onClick={skipBreak}>
                        <SkipNextIcon fontSize="inherit"/>
                    </IconButton>
                }
            </Box>
            <Box sx={{width: "100%", textAlign: "right", pt: 3,}}>
                <Button variant="contained" size="small" color="warning" startIcon={<DeleteIcon/>}
                        onClick={onClickReset}>Reset</Button>
            </Box>
        </Paper>
    );
};

export default Timer;
