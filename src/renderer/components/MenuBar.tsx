import Box from '@mui/material/Box'
import { useAtomValue, useSetAtom } from 'jotai'
import * as atoms from '../stores/atoms'
import { useTranslation } from 'react-i18next'
import icon from '@/static/icon.png'
import List from '@mui/material/List';
import { Link } from 'react-router-dom';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { IconButton } from '@mui/material'
import TextsmsOutlinedIcon from '@mui/icons-material/TextsmsOutlined';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import { MessageSquareShare, Settings2, Settings, BotMessageSquare, LayoutGrid } from 'lucide-react'

export default function MenuBar() {
    const { t } = useTranslation()
    const currentSession = useAtomValue(atoms.currentSessionAtom)

    return (
        <div className='w-[50px] bg-[#f2f2f2] flex flex-col justify-between'
        //style={{ '-webkit-app-region': 'drag' }}
        >
            <div className='w-full'>
                <List
                    sx={{ width: '100%', backgroundColor: 'transparent' }}
                >
                    <ListItemButton component={Link} to="/" disableRipple>
                        <ListItemIcon sx={{ padding: 0 }}>
                            <MessageSquareShare size="20" strokeWidth={1.5} />
                        </ListItemIcon>
                    </ListItemButton>
                    <ListItemButton component={Link} to="/AgentFlow" disableRipple>
                        <ListItemIcon sx={{ padding: 0 }}>
                            <BotMessageSquare size="20" strokeWidth={1.5} />
                        </ListItemIcon>
                    </ListItemButton>
                </List>
            </div>
            <div>
                <List
                    sx={{ width: '100%', backgroundColor: 'transparent' }}>
                    <ListItemButton disableRipple>
                        <ListItemIcon sx={{ padding: 0 }}>
                            <LayoutGrid size="20" strokeWidth={1.5} />
                        </ListItemIcon>
                    </ListItemButton>

                    <ListItemButton disableRipple>
                        <ListItemIcon sx={{ padding: 0 }}>
                            <Settings size="20" strokeWidth={1.5} />
                        </ListItemIcon>
                    </ListItemButton>
                </List>
            </div>
        </div>
    )
}
