import { Box } from '@mui/material'
import InputBox from '@/components/InputBox'
import MessageList from '@/components/MessageList'
import Header from '@/components/Header'
import ChatList from '@/ChatList'
import MainPane from '@/MainPane'
import React from 'react'
import { useAtom, useAtomValue } from 'jotai'
import * as atoms from '@/stores/atoms'

interface Props { }
export default function ChatView(props: Props) {
    const currentSession = useAtomValue(atoms.currentSessionAtom)

    const [openSettingWindow, setOpenSettingWindow] = useAtom(atoms.openSettingDialogAtom)

    const [openAboutWindow, setOpenAboutWindow] = React.useState(false)

    const [openCopilotWindow, setOpenCopilotWindow] = React.useState(false)
    return (
        <div className='h-full w-full flex'>
            <ChatList
                openCopilotWindow={() => setOpenCopilotWindow(true)}
                openAboutWindow={() => setOpenAboutWindow(true)}
                setOpenSettingWindow={setOpenSettingWindow} />

            <MainPane />
        </div>
    )
}
