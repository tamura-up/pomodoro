"use client"
import {Box, Button, IconButton, Paper, Typography} from '@mui/material';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import DeleteIcon from '@mui/icons-material/Delete';
import {IterationSet, TaskConfig} from '@/lib/pomodro';
import {useEffect, useState} from "react";

import useInterval from 'use-interval'
import {useAtom} from "jotai";
import {bgcolorAtom} from "@/lib/jotaiAtom";
import {sound1, sound2} from "@/lib/sound";
import {Colors} from '@/lib/constant';

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
    'WORK': Colors.red,
    'BREAK': Colors.green,
};

const alarm1SoundDataUri = "data:audio/mp3;base64," + sound1;
const alarm2SoundDataUri = "data:audio/mp3;base64," + sound2;

const Timer = () => {
    const generateInitialIterationSet = () => {

        return new IterationSet(new TaskConfig());
    }
    const [iterationValue, setIterationValue] = useState<IterationValue | null>(null);
    const [iterationSet, setIterationSet] = useState(generateInitialIterationSet());
    const [_, setBGColorAtom] = useAtom(bgcolorAtom);
    const [blink, setBlink] = useState(false);
    useEffect(() => {
        let timer: any;
        if (blink) {
            let no = 0;
            const color = iterationSet.state == 'WORK' ? colors['WORK'] : colors['BREAK'];
            setBGColorAtom(color);
            timer = setInterval(() => {
                setBGColorAtom(no % 2 ? color : '#FFF');
                no += 1;
            }, 500);
            return () => {
                clearInterval(timer);
            };
        } else {
            if (!!timer) clearInterval(timer);
            timer = undefined;
        }
    }, [blink]);

    useInterval(() => {
        const iteration = iterationSet.getCurrentIteration();
        setIterationValue({seconds: iteration.seconds, running: iteration.running});
        if (!blink) {
            setBGColorAtom(iterationSet.state == "WORK" ? colors['WORK'] : colors['BREAK']);
        }
    }, 200);


    const startTimer = () => {
        // ipad対応のため、ボタンクリックのタイミングでオブジェクト生成
        // https://webfrontend.ninja/js-audio-autoplay-policy-and-delay/
        const alarmSoundElement = new Audio(alarm1SoundDataUri);
        const alarm2SoundElement = new Audio(alarm2SoundDataUri);
        iterationSet.handlers = new Map([
            ["WORK", () => {
                setBlink(true);
                if (!!alarmSoundElement) alarmSoundElement.play();
            }],
            ["SHORT_BREAK", () => {
                setBlink(true);
                if (!!alarm2SoundElement) alarm2SoundElement.play();
            }],
            ["LONG_BREAK", () => {
                setBlink(true);
                if (!!alarm2SoundElement) alarm2SoundElement.play();
            }],
        ]);
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
        return iterationSet.state == "WORK" ? colors['WORK'] : colors['BREAK'];
    };

    const skipBreak = () => {
        iterationSet.goToNext();
    }

    const onClickReset = () => {
        iterationSet.iteration.stop();
        setIterationSet(generateInitialIterationSet());
    }

    const stopNotification = () => {
        setBlink(false);
    }

    return (
        <Paper
            elevation={5}
            sx={{
                bgcolor: bgcolor(),
                p: 4,
                width: "80vw",
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                rowGap: '10px',
                userSelect: 'none',
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
