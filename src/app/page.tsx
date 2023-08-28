import Image from 'next/image'
import styles from './page.module.css'
import {Box, Button, Typography} from '@mui/material'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import Timer from '@/components/timer'

export default function Home() {
    return (
        <main className={styles.main}>
            <Timer />
        </main>
    )
}
