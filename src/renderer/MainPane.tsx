import { Box } from '@mui/material'
import * as atoms from './stores/atoms'
import { useAtomValue } from 'jotai'
import InputBox from './components/InputBox'
import MessageList from './components/MessageList'
//import { drawerWidth } from './Sidebar'
import Header from './components/Header'
import { isMobile } from './packages/checkOS'

interface Props {}

const drawerWidth = isMobile() ? 0 : 240
export default function MainPane(props: Props) {
    const currentSession = useAtomValue(atoms.currentSessionAtom)

    return (
        <Box
            className="flex flex-col flex-grow"
            sx={{
                //flexGrow: 1,
                marginLeft: `${drawerWidth}px`,
            }}
        >
            <div className="flex-grow-[8]">
                <MessageList />
            </div>
            <div className="flex-grow-[2]">
                <InputBox currentSessionId={currentSession.id} currentSessionType={currentSession.type || 'chat'} />
            </div>
        </Box>
    )
}
