import { useAtom, useAtomValue } from 'jotai'
import * as atoms from '../stores/atoms'
import { Box, Grid } from '@mui/material'
//import Sidebar from '../Sidebar'
//import MainPane from '../MainPane'
import React from 'react'
//import SettingDialog from './SettingDialog'
//import ChatConfigWindow from './ChatConfigWindow'
//import CleanWidnow from './CleanWindow'
//import AboutWindow from './AboutWindow'
//import useAppTheme from '../hooks/useAppTheme'
//import CopilotWindow from './CopilotWindow'
//import RemoteDialogWindow from './RemoteDialogWindow'
import Toasts from '../components/Toasts'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
//import MenuOpen from '@mui/icons-material/MenuOpen';
//import MenuItem from '@mui/material/MenuItem';
import MenuIcon from '@mui/icons-material/Menu'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import Divider from '@mui/material/Divider'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import InboxIcon from '@mui/icons-material/MoveToInbox'
import MailIcon from '@mui/icons-material/Mail'
import { useTranslation } from 'react-i18next'
import Sidebar from '../Sidebar'
import MainPane from '@/MainPane'

import SettingDialog from './SettingDialog'
import ChatConfigWindow from './ChatConfigWindow'
import CleanWidnow from './CleanWindow'
import AboutWindow from './AboutWindow'
import useAppTheme from '../hooks/useAppTheme'
import CopilotWindow from './CopilotWindow'
import RemoteDialogWindow from './RemoteDialogWindow'

export default function Main() {
    const spellCheck = useAtomValue(atoms.spellCheckAtom)
    const { t } = useTranslation()
    const [openSideBar, setSideBar] = React.useState(false)

    const [openSettingWindow, setOpenSettingWindow] = useAtom(atoms.openSettingDialogAtom)

    const [openAboutWindow, setOpenAboutWindow] = React.useState(false)

    const [openCopilotWindow, setOpenCopilotWindow] = React.useState(false)

    const toggleDrawer = () => {
        setSideBar(!openSideBar)
    }

    return (
        <Box className="box-border App" spellCheck={spellCheck}>
            <div className="flex flex-col h-screen">
                <AppBar position="static" sx={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
                    <Toolbar>
                        <IconButton
                            size="large"
                            edge="start"
                            //color="inherit"
                            aria-label="menu"
                            sx={{ mr: 2 }}
                            onClick={toggleDrawer}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Drawer open={openSideBar} onClose={toggleDrawer}>
                            <Sidebar
                                openCopilotWindow={() => setOpenCopilotWindow(true)}
                                openAboutWindow={() => setOpenAboutWindow(true)}
                                setOpenSettingWindow={setOpenSettingWindow}
                            />
                        </Drawer>
                    </Toolbar>
                </AppBar>

                <MainPane />
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
            </div>
        </Box>
    )
}
