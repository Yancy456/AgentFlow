import ChatHistory from '@/ChatHistory'
import ChatPane from '@/desktop/ChatView/ChatPane'
import React from 'react'
import { useAtom, useAtomValue } from 'jotai'
import * as atoms from '@/stores/atoms'

interface Props {}
export default function ChatView(props: Props) {
    const currentSession = useAtomValue(atoms.currentSessionAtom)

    const [openSettingWindow, setOpenSettingWindow] = useAtom(atoms.openSettingDialogAtom)

    const [openAboutWindow, setOpenAboutWindow] = React.useState(false)

    const [openCopilotWindow, setOpenCopilotWindow] = React.useState(false)
    return (
        <div className="h-full w-full flex">
            <ChatHistory
                openCopilotWindow={() => setOpenCopilotWindow(true)}
                openAboutWindow={() => setOpenAboutWindow(true)}
                setOpenSettingWindow={setOpenSettingWindow}
            />
            <ChatPane />
        </div>
    )
}
