import { Box } from '@mui/material'
import * as atoms from '@/stores/atoms'
import { useAtomValue } from 'jotai'
import InputBox from '@/components/InputBox'
import MessageList from '@/components/MessageList'
//import { drawerWidth } from './Sidebar'
import Header from '@/components/Header'
import { isMobile } from '@/packages/checkOS'

interface Props {}

const drawerWidth = isMobile() ? 0 : 240
export default function MainPane(props: Props) {
    const currentSession = useAtomValue(atoms.currentSessionAtom)

    return (
        <div className="h-full grow" style={{ display: 'flex', flexDirection: 'column' }}>
            <Header />
            <MessageList />
            <InputBox currentSessionId={currentSession.id} currentSessionType={currentSession.type || 'chat'} />
        </div>
    )
}
