"use client"
import {IconButton, Box, Button, Container, Paper, Typography} from '@mui/material';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import {red, green, purple} from '@mui/material/colors';
import DeleteIcon from '@mui/icons-material/Delete';
import {Iteration, IterationSet, TaskConfig} from '@/lib/pomodro';
import {useEffect, useState} from "react";

import useInterval from 'use-interval'
import {useAtom} from "jotai";
import {bgcolorAtom} from "@/lib/jotaiAtom";
import {clickSound, sound1, sound2} from "@/lib/sound";

const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return m.toString().padStart(2, '0') + ":" + s.toString().padStart(2, '0');
};

type IterationValue = {
    seconds: number;
    running: boolean;
};

const colors = {
    'WORK': red["400"],
    'BREAK': green["300"]
};

const clickSoundDataUri = "data:audio/mp3;base64," + clickSound;
// const clickSoundElement = new Audio(clickSoundDataUri);

const playClickSound = () => {
    // clickSoundElement.play();
}

const alermSoundDataUri = "data:audio/mp3;base64," + sound1;
// const alermSoundElement = new Audio(alermSoundDataUri);

const playSound2 = () => {
    const alermSoundDataUri = "data:audio/mp3;base64," + sound2;
    const sound = new Audio(alermSoundDataUri);
    sound.play();
}

const Timer = () => {
    const generateInitialIterationSet = () => {

        return new IterationSet(new TaskConfig(),
            () => {
                finishWork()
            },
            () => {
                finishBreak()
            },
            () => {
                finishBreak()
            }
        );
    }
    const [iterationValue, setIterationValue] = useState<IterationValue | null>(null);
    const [iterationSet, setIterationSet] = useState(generateInitialIterationSet());
    const [_, setBGColorAtom] = useAtom(bgcolorAtom);
    const [notification, setNotification] = useState(false);
    const [alarmElement, setAlarmElement] = useState<any>(null);
    useEffect(() => {
        let timer: any;
        if (notification) {
            let no = 0;
            timer = setInterval(() => {
                no += 1;
                setBGColorAtom(no % 2 ? colors['BREAK'] : '#FFF');
            }, 500);
            return () => {
                clearInterval(timer);
            };
        } else {
            if (!!timer) clearInterval(timer);
            timer = undefined;
        }
    }, [notification]);

    useInterval(() => {
        const iteration = iterationSet.getCurrentIteration();
        setIterationValue({seconds: iteration.seconds, running: iteration.running});
        if (!notification) {
            setBGColorAtom(iterationSet.state == "WORK" ? colors['WORK'] : colors['BREAK']);
        }
    }, 300);


    const startTimer = () => {
        const alarmSoundElement = new Audio(alermSoundDataUri);
        console.log("a",alarmSoundElement)
        setAlarmElement("test");

        playClickSound();
        setNotification(false);
        iterationSet.getCurrentIteration().start();
        iterationSet.handler= ()=>{
            console.log("chk",alarmSoundElement)
            if (!!alarmSoundElement) alarmSoundElement.play();
        };
    }
    const stopTimer = () => {
        playClickSound();
        setNotification(false);
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
        return iterationSet.state == "WORK" ? colors['WORK'] : colors['BREAK'];
    };

    const skipBreak = () => {
        iterationSet.goToNext();
    }

    const onClickReset = () => {
        iterationSet.iteration.stop();
        setIterationSet(generateInitialIterationSet());
        // setNotification(false);
    }

    const finishWork = () => {
        console.log(alarmElement)
        if (!!alarmElement) alarmElement.play();
        setNotification(true);
    }
    const finishBreak = () => {
        console.log(alarmElement)
        if (!!alarmElement) alarmElement.play();
    }
    const stopNotification = () => {
        setNotification(false);
    }

    return (
        <Paper
            elevation={5}
            sx={{
                bgcolor: bgcolor(),
                p: 4,
                width: "800px",
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                rowGap: '10px',
            }}
            onClick={stopNotification}
        >
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
