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
import TitleBar from '@/components/TitleBar'

export default function Main() {
    const spellCheck = useAtomValue(atoms.spellCheckAtom)

    const [openSettingWindow, setOpenSettingWindow] = useAtom(atoms.openSettingDialogAtom)

    const [openAboutWindow, setOpenAboutWindow] = React.useState(false)

    const [openCopilotWindow, setOpenCopilotWindow] = React.useState(false)

    return (
        <Box className="box-border App w-screen h-screen flex flex-col" spellCheck={spellCheck}>

            <TitleBar />

            <div className="grow w-full flex">

                <div className='w-[40px] bg-[#f2f2f2]'
                    style={{ '-webkit-app-region': 'drag' }}
                >
                </div>
                <div className='rounded-sm border-t-[0.5px] border-l-[0.5px] border-[#00000028] grow flex flex-row w-full h-full border-solid' style={{ overflow: 'hidden' }}>
                    <Sidebar
                        openCopilotWindow={() => setOpenCopilotWindow(true)}
                        openAboutWindow={() => setOpenAboutWindow(true)}
                        setOpenSettingWindow={setOpenSettingWindow} />

                    {/*<MainPane />*/}
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
            <CopilotWindow open={openCopilotWindow} close={() => setOpenCopilotWindow(false)} />
            <RemoteDialogWindow />
            <Toasts />


        </Box>
    )
}

{/*<div className="h-full w-full" style={{ display: 'flex' }}>

<div className='w-[40px] bg-[#f2f2f2]'
    style={{}}
>
</div>
<div className='rounded-sm border-t-[0.5px] border-l-[0.5px] border-[#00000028] grow border-solid'>
    {/*<Sidebar
    openCopilotWindow={() => setOpenCopilotWindow(true)}
    openAboutWindow={() => setOpenAboutWindow(true)}
    setOpenSettingWindow={setOpenSettingWindow}
/>
<MainPane />*/}
//</div>


//</div>*/}