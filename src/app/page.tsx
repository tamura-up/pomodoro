"use client"
import Image from 'next/image'
import styles from './page.module.css'
import {Box, Button, Container, Typography} from '@mui/material'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import Timer from '@/components/timer'
import {useAtom} from "jotai";
import {bgcolorAtom} from "@/lib/jotaiAtom";

export default function Home() {
    const [bgcolor]=useAtom(bgcolorAtom);
    return (
        <main>
            <Box sx={{
                bgcolor:bgcolor,
                height: '100vh',
                width: '100vw',
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',
                pt:'100px',
            }}>
                <Timer/>
            </Box>
        </main>
    )
}
