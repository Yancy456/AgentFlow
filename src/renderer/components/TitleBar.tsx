import Box from '@mui/material/Box'
import { useAtomValue } from 'jotai'
import * as atoms from '../stores/atoms'
import { useTranslation } from 'react-i18next'
import icon from '@/static/icon.png'
import { IconButton } from '@mui/material'
import React, { useState } from 'react'
import { MenuIcon } from 'lucide-react'
import TitleMenu from './TitleMenu'

export default function TitleBar() {
    const { t } = useTranslation()
    const currentSession = useAtomValue(atoms.currentSessionAtom)
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget)
        setIsMenuOpen(!isMenuOpen)
    }

    const handleClose = () => {
        setAnchorEl(null)
        setIsMenuOpen(false)
    }

    return (
        <div
            className="h-[30.5px] shrink-0 w-full bg-[#f2f2f2] flex content-center items-center justify-between"
            style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
        >
            <div className="h-full flex content-center">
                <div style={{ WebkitAppRegion: 'none' } as React.CSSProperties}>
                    <IconButton id="icon-button" onClick={handleClick} disableRipple>
                        <MenuIcon size="20" strokeWidth={1.5} color="black" />
                    </IconButton>
                </div>

                <img src={icon} className="w-5 h-5  mt-[7px]" />
            </div>
            <div>ChatFlow</div>
            <div className="w-[150px]"></div>
            <TitleMenu
                isOpen={isMenuOpen}
                menuItems={[
                    {
                        name: 'File',
                        onClick: () => {
                            console.log('New Chat')
                        },
                        subMenuItems: [
                            {
                                name: 'New Chat',
                                onClick: () => {
                                    console.log('New Chat')
                                },
                            },
                        ],
                    },
                    {
                        name: 'View',
                        onClick: () => {
                            console.log('Edit')
                        },
                        subMenuItems: [
                            {
                                name: 'New Chat',
                                onClick: () => {
                                    console.log('New Chat')
                                },
                            },
                        ],
                    },
                    {
                        name: 'Settings',
                        onClick: () => {
                            console.log('Settings')
                        },
                        subMenuItems: [
                            {
                                name: 'New Chat',
                                onClick: () => {
                                    console.log('New Chat')
                                },
                            },
                        ],
                    },
                    {
                        name: 'Agent',
                        onClick: () => {
                            console.log('Help')
                        },
                        subMenuItems: [
                            {
                                name: 'New Chat',
                                onClick: () => {
                                    console.log('New Chat')
                                },
                            },
                        ],
                    },
                ]}
                anchorEl={anchorEl}
                onClose={handleClose}
            />
        </div>
    )
}
