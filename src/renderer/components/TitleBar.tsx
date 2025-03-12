import Box from '@mui/material/Box'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import * as atoms from '../stores/atoms'
import { useTranslation } from 'react-i18next'
import icon from '@/static/icon.png'
import { Button, IconButton, Menu, MenuItem } from '@mui/material'
import React, { useState } from 'react'
import { AlignJustify, ChevronRightIcon, MenuIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
export default function TitleBar() {
    const { t } = useTranslation()
    const currentSession = useAtomValue(atoms.currentSessionAtom)

    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }
    const [subFileAnchorEl, setSubFileAnchorEl] = useState(null)

    const handleOpenMenu = (event) => {
        setAnchorEl(event.currentTarget)
    }

    const handleCloseMenu = () => {
        setAnchorEl(null)
        setSubFileAnchorEl(null) // Close any open submenus too
    }

    const handleFileSubMenuOpen = (event) => {
        setSubFileAnchorEl(event.currentTarget)
    }

    const handleSubMenuClose = () => {
        setSubFileAnchorEl(null)
    }
    const [openSettingWindow, setOpenSettingWindow] = useAtom(atoms.openSettingDialogAtom)
    return (
        <div
            className="h-[30.5px] shrink-0 w-full bg-[#f2f2f2] flex content-center items-center justify-between"
            style={{ '-webkit-app-region': 'drag' }}
        >
            <div className="h-full flex content-center">
                <div style={{ '-webkit-app-region': 'none' }}>
                    <IconButton
                        id="icon-button"
                        aria-controls={open ? 'icon-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleClick}
                        disableRipple
                    >
                        <MenuIcon size="20" strokeWidth={1.5} color="black" />
                    </IconButton>
                </div>

                <img src={icon} className="w-5 h-5  mt-[7px]" />
            </div>
            <div>ChatFlow</div>
            <div className="w-[150px]"></div>
            <Menu
                id="menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleCloseMenu}
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
                <MenuItem onClick={handleFileSubMenuOpen}>
                    <div className="w-full flex justify-between">
                        <div>File</div>

                        <ChevronRightIcon size="20" strokeWidth={1.5} />
                    </div>
                </MenuItem>
                <Menu
                    id="sub-menu"
                    anchorEl={subFileAnchorEl}
                    open={Boolean(subFileAnchorEl)}
                    onClose={handleSubMenuClose}
                    MenuListProps={{
                        'aria-labelledby': 'submenu-button',
                    }}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right', // Align submenu to the right of the main menu
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
                    <MenuItem onClick={handleSubMenuClose}>New</MenuItem>
                    <MenuItem onClick={handleSubMenuClose}>Open</MenuItem>
                    <MenuItem onClick={handleSubMenuClose}>Save</MenuItem>
                </Menu>

                <MenuItem onClick={handleFileSubMenuOpen}>
                    <div className="w-full flex justify-between">
                        <div>View</div>

                        <ChevronRightIcon size="20" strokeWidth={1.5} />
                    </div>
                </MenuItem>
                <Menu
                    id="sub-menu"
                    anchorEl={subFileAnchorEl}
                    open={Boolean(subFileAnchorEl)}
                    onClose={handleSubMenuClose}
                    MenuListProps={{
                        'aria-labelledby': 'submenu-button',
                    }}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right', // Align submenu to the right of the main menu
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
                    <MenuItem>
                        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                            Chat
                        </Link>
                    </MenuItem>
                    <MenuItem>
                        <Link to="/AgentFlow" style={{ textDecoration: 'none', color: 'inherit' }}>
                            Agent Design
                        </Link>
                    </MenuItem>
                </Menu>

                <MenuItem onClick={() => setOpenSettingWindow('ai')}>
                    <div className="w-full flex justify-between">
                        <div>Settings</div>

                        <ChevronRightIcon size="20" strokeWidth={1.5} />
                    </div>
                </MenuItem>

                <MenuItem onClick={handleCloseMenu}>
                    <div className="w-full flex justify-between">
                        <div>Help</div>
                        <ChevronRightIcon size="20" strokeWidth={1.5} />
                    </div>
                </MenuItem>
            </Menu>
        </div>
    )
}
