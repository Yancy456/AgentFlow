import { useRef } from 'react'
import {
    Box,
    Badge,
    ListItemText,
    MenuList,
    IconButton,
    Stack,
    MenuItem,
    ListItemIcon,
    Typography,
    Divider,
    useTheme,
} from '@mui/material'
import SettingsIcon from '@mui/icons-material/Settings'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { useTranslation } from 'react-i18next'
import icon from './static/icon.png'
import SmartToyIcon from '@mui/icons-material/SmartToy'
import AddIcon from '@mui/icons-material/AddCircleOutline'
import useVersion from './hooks/useVersion'
import SessionList from './components/SessionList'
import * as sessionActions from './stores/session/sessionActions'
import MenuOpenIcon from '@mui/icons-material/MenuOpen'
import { useSetAtom } from 'jotai'
import * as atoms from './stores/atoms'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'
//import { trackingEvent } from './packages/event'
import { isMobile } from './packages/checkOS'

export const drawerWidth = 240

interface Props {
    openCopilotWindow(): void
    openAboutWindow(): void
    setOpenSettingWindow(name: 'ai' | 'display' | null): void
}

export default function ChatHistory(props: Props) {
    const { t } = useTranslation()
    const versionHook = useVersion()

    const sessionListRef = useRef<HTMLDivElement>(null)
    const handleCreateNewSession = () => {
        sessionActions.createEmpty('chat')
        if (sessionListRef.current) {
            sessionListRef.current.scrollTo(0, 0)
        }
        //trackingEvent('create_new_conversation', { event_category: 'user' })
    }

    const theme = useTheme()
    return (
        <div
            className="h-full"
            style={{
                boxSizing: 'border-box',
                width: drawerWidth,
                borderRightWidth: '1px',
                borderRightStyle: 'solid',
                borderRightColor: theme.palette.divider,
            }}
        >
            <div className="ToolBar h-full">
                <Stack
                    className="pl-2 pr-1"
                    sx={{
                        height: '100%',
                    }}
                >
                    <SessionList sessionListRef={sessionListRef} />
                </Stack>
            </div>
        </div>
    )
}
