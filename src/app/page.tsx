import Image from 'next/image'
import styles from './page.module.css'
import {Box, Button, Typography} from '@mui/material'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'

export default function Home() {
    return (
        <main className={styles.main}>
            <div className={styles.description}>
                <Button variant="contained">Hello world</Button>
            </div>
        </main>
    )
}
