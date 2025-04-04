import { useAtom, useAtomValue } from 'jotai'
import * as atoms from '../stores/atoms'
import { Box, Grid } from '@mui/material'
//import Sidebar from '../Sidebar'
import ChatList from '../ChatHistory'
import MainPane from './ChatView/ChatPane'
import React from 'react'
import SettingDialog from './SettingDialog'
import ChatConfigWindow from './ChatConfigWindow'
import CleanWidnow from './CleanWindow'
import AboutWindow from './AboutWindow'
import useAppTheme from '../hooks/useAppTheme'
import CopilotWindow from './CopilotWindow'
import RemoteDialogWindow from './RemoteDialogWindow'
import Toasts from '../components/Toasts'
import TitleBar from '@/components/TitleBar'
import MenuBar from '@/components/MenuBar'
import ChatView from '@/desktop/ChatView'
import AgentFlow from '@/desktop/AgentFlow'
import { HashRouter as Router, Route, Routes, Navigate } from 'react-router-dom'

export default function Main() {
    const spellCheck = useAtomValue(atoms.spellCheckAtom)

    const [openSettingWindow, setOpenSettingWindow] = useAtom(atoms.openSettingDialogAtom)

    const [openAboutWindow, setOpenAboutWindow] = React.useState(false)

    const [openCopilotWindow, setOpenCopilotWindow] = useAtom(atoms.openCopilotWindowAtom)

    return (
        <Router>
            <Box className="box-border App w-screen h-screen flex flex-col" spellCheck={spellCheck}>
                <TitleBar />

                <div className="grow w-full flex overflow-auto">
                    {/*<MenuBar />*/}

                    <div
                        className="rounded-sm border-t-[0.5px] border-l-[0.5px] border-[#00000028] grow h-full border-solid"
                        style={{ overflow: 'auto' }}
                    >
                        <Routes>
                            <Route path="/" element={<ChatView />} />
                            <Route path="/AgentFlow" element={<AgentFlow />} />
                            {/*<Route path="/about" element={<About />} />*/}
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </div>
                </div>

                <SettingDialog
                    open={!!openSettingWindow}
                    targetTab={openSettingWindow || undefined}
                    close={() => setOpenSettingWindow(null)}
                />
                <AboutWindow open={openAboutWindow} close={() => setOpenAboutWindow(false)} />
                <ChatConfigWindow />
                <CleanWidnow />
                {/*<CopilotWindow open={openCopilotWindow} close={() => setOpenCopilotWindow(false)} />*/}
                {/*<RemoteDialogWindow />*/}
                <Toasts />
            </Box>
        </Router>
    )
}
