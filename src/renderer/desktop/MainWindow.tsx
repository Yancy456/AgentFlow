import { useAtom, useAtomValue } from 'jotai'
import * as atoms from '../stores/atoms'
import { Box, Grid } from '@mui/material'
import Sidebar from '../Sidebar'
import MainPane from '../MainPane'
import React from 'react'
import SettingDialog from './SettingDialog'
import ChatConfigWindow from './ChatConfigWindow'
import CleanWidnow from './CleanWindow'
import AboutWindow from './AboutWindow'
import useAppTheme from '../hooks/useAppTheme'
import CopilotWindow from './CopilotWindow'
import RemoteDialogWindow from './RemoteDialogWindow'
import Toasts from '../components/Toasts'

export default function Main() {

    const spellCheck = useAtomValue(atoms.spellCheckAtom)

    const [openSettingWindow, setOpenSettingWindow] = useAtom(atoms.openSettingDialogAtom)

    const [openAboutWindow, setOpenAboutWindow] = React.useState(false)

    const [openCopilotWindow, setOpenCopilotWindow] = React.useState(false)

    return (
        <Box className="box-border App" spellCheck={spellCheck}>
            <Grid container className="h-full">
                <Sidebar
                    openCopilotWindow={() => setOpenCopilotWindow(true)}
                    openAboutWindow={() => setOpenAboutWindow(true)}
                    setOpenSettingWindow={setOpenSettingWindow}
                />
                <MainPane />
            </Grid>
            <SettingDialog
                open={!!openSettingWindow}
                targetTab={openSettingWindow || undefined}
                close={() => setOpenSettingWindow(null)}
            />
            <AboutWindow open={openAboutWindow} close={() => setOpenAboutWindow(false)} />
            <ChatConfigWindow />
            <CleanWidnow />
            <CopilotWindow open={openCopilotWindow} close={() => setOpenCopilotWindow(false)} />
            <RemoteDialogWindow />
            <Toasts />
        </Box>
    )
}