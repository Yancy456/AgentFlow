import Box from '@mui/material/Box'
import { useAtomValue, useSetAtom } from 'jotai'
import * as atoms from '../stores/atoms'
import { useTranslation } from 'react-i18next'
import icon from '@/static/icon.png'
import List from '@mui/material/List'
import { Link } from 'react-router-dom'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import { IconButton } from '@mui/material'
import TextsmsOutlinedIcon from '@mui/icons-material/TextsmsOutlined'
import SendOutlinedIcon from '@mui/icons-material/SendOutlined'
import {
    MessageSquareShare,
    Settings2,
    Settings,
    BotMessageSquare,
    LayoutGrid,
    Plus,
    Menu as MenuIcon,
} from 'lucide-react'
import { useAtom } from 'jotai'
import { useState } from 'react'
import { Menu, MenuItem } from '@mui/material'
import { ChevronRightIcon } from 'lucide-react'
import { MenuItemProps } from '../types/MenuItemProps'
import TitleMenu from './TitleMenu'

export default function MenuBar() {
    const { t } = useTranslation()
    const currentSession = useAtomValue(atoms.currentSessionAtom)
    const [openSettingWindow, setOpenSettingWindow] = useAtom(atoms.openSettingDialogAtom)
    const [openCopilotWindow, setOpenCopilotWindow] = useAtom(atoms.openCopilotWindowAtom)
    const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null)

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setMenuAnchorEl(event.currentTarget)
    }

    const handleMenuClose = () => {
        setMenuAnchorEl(null)
    }

    const menuItems: MenuItemProps[] = [
        {
            name: 'File',
            onClick: handleMenuOpen,
            subMenuItems: [
                { name: 'New', onClick: () => console.log('New clicked') },
                { name: 'Open', onClick: () => console.log('Open clicked') },
                { name: 'Save', onClick: () => console.log('Save clicked') },
            ],
        },
        {
            name: 'View',
            onClick: handleMenuOpen,
            subMenuItems: [
                { name: 'Chat', onClick: () => console.log('Chat clicked') },
                { name: 'Agent Design', onClick: () => console.log('Agent Design clicked') },
            ],
        },
        { name: 'Agent', onClick: () => console.log('Agent clicked') },
        { name: 'Setting', onClick: () => setOpenSettingWindow('ai') },
    ]

    return (
        <div className="w-[50px] bg-[#f2f2f2] flex flex-col justify-between">
            <div className="w-full">
                <List sx={{ width: '100%', backgroundColor: 'transparent' }}>
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
                    <ListItemButton disableRipple>
                        <ListItemIcon sx={{ padding: 0 }} onClick={() => setOpenCopilotWindow(true)}>
                            <Plus size="20" strokeWidth={1.5} />
                        </ListItemIcon>
                    </ListItemButton>
                </List>
            </div>
            <div>
                <List sx={{ width: '100%', backgroundColor: 'transparent' }}>
                    <ListItemButton disableRipple>
                        <ListItemIcon sx={{ padding: 0 }}>
                            <LayoutGrid size="20" strokeWidth={1.5} />
                        </ListItemIcon>
                    </ListItemButton>

                    <ListItemButton onClick={handleMenuOpen} disableRipple>
                        <ListItemIcon sx={{ padding: 0 }}>
                            <MenuIcon size="20" strokeWidth={1.5} />
                        </ListItemIcon>
                    </ListItemButton>
                </List>
            </div>
            <TitleMenu menuItems={menuItems} />
            <Menu
                id="menu"
                anchorEl={menuAnchorEl}
                open={Boolean(menuAnchorEl)}
                onClose={() => setMenuAnchorEl(null)}
                MenuListProps={{
                    'aria-labelledby': 'menu-button',
                }}
                sx={{
                    '& .MuiPaper-root': {
                        borderRadius: '12px',
                        boxShadow: '1px',
                    },
                }}
            >
                {menuItems.map((item, index) => (
                    <MenuItem
                        key={index}
                        onClick={(event) => {
                            setMenuAnchorEl(event.currentTarget)
                            item.onClick()
                        }}
                    >
                        <div className="w-full flex justify-between">
                            <div>{item.name}</div>
                            {item.subMenuItems && <ChevronRightIcon size="20" strokeWidth="1.5" />}
                        </div>
                        {item.subMenuItems && (
                            <Menu
                                id={`sub-menu-${index}`}
                                anchorEl={menuAnchorEl}
                                open={Boolean(menuAnchorEl)}
                                onClose={() => setMenuAnchorEl(null)}
                                MenuListProps={{
                                    'aria-labelledby': `submenu-button-${index}`,
                                }}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                                sx={{
                                    '& .MuiPaper-root': {
                                        borderRadius: '12px',
                                        boxShadow: '1px',
                                    },
                                }}
                            >
                                {item.subMenuItems &&
                                    item.subMenuItems.map((subItem, subIndex) => (
                                        <MenuItem key={subIndex} onClick={subItem.onClick}>
                                            {subItem.name}
                                        </MenuItem>
                                    ))}
                            </Menu>
                        )}
                    </MenuItem>
                ))}
            </Menu>
        </div>
    )
}
