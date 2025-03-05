import Box from '@mui/material/Box'
import { useAtomValue, useSetAtom } from 'jotai'
import * as atoms from '../stores/atoms'
import { useTranslation } from 'react-i18next'
import icon from '@/static/icon.png'
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import TextsmsOutlinedIcon from '@mui/icons-material/TextsmsOutlined';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import { MessageSquareShare, Settings2, Settings, BotMessageSquare } from 'lucide-react'

export default function MenuBar() {
    const { t } = useTranslation()
    const currentSession = useAtomValue(atoms.currentSessionAtom)

    return (
        <div className='w-[50px] bg-[#f2f2f2] flex flex-col justify-between'
            style={{ '-webkit-app-region': 'drag' }}>
            <div>
                <List
                    sx={{ width: '100%', backgroundColor: 'transparent' }}
                    component="nav"
                    aria-labelledby="nested-list-subheader">
                    <ListItemButton>

                        <MessageSquareShare size="30" strokeWidth={1.5} />


                    </ListItemButton>
                    {/*<ListItemButton>
                        <ListItemIcon>

                        </ListItemIcon>
                        <ListItemText primary="Drafts" />
                    </ListItemButton>*/}
                </List>
            </div>
            <div>
                <List
                    sx={{ width: '100%', backgroundColor: 'transparent' }}
                    component="nav"
                    aria-labelledby="nested-list-subheader">
                    <ListItemButton>

                        <BotMessageSquare size="30" strokeWidth={1.5} />
                    </ListItemButton>

                    <ListItemButton>

                        <Settings size="30" strokeWidth={1.5} />
                    </ListItemButton>

                </List>

            </div>
        </div>
    )
}
