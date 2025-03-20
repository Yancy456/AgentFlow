import { Menu, MenuItem } from '@mui/material'
import { ChevronRightIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAtom } from 'jotai'
import * as atoms from '../stores/atoms'
import React, { useState } from 'react'

interface MenuItemProps {
    name: string
    onClick: () => void
    subMenuItems?: { name: string; onClick: () => void }[]
}

interface TitleMenuProps {
    menuItems: MenuItemProps[]
    isOpen: boolean
    anchorEl: HTMLElement | null
    onClose: () => void
}

export default function TitleMenu({ menuItems, isOpen, anchorEl, onClose }: TitleMenuProps) {
    const [openSettingWindow, setOpenSettingWindow] = useAtom(atoms.openSettingDialogAtom)

    const [openSubMenuIndex, setOpenSubMenuIndex] = useState<number | null>(null)
    const [subMenuAnchorEl, setSubMenuAnchorEl] = useState<null | HTMLElement>(null)

    const handleSubMenuToggle = (event: React.MouseEvent<HTMLElement>, index: number) => {
        setSubMenuAnchorEl(event.currentTarget)
        setOpenSubMenuIndex(openSubMenuIndex === index ? null : index)
    }

    return (
        <Menu
            id="menu"
            anchorEl={anchorEl}
            open={isOpen}
            onClose={onClose}
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
                <MenuItem key={index} onClick={(event) => handleSubMenuToggle(event, index)}>
                    <div className="flex justify-between w-full">
                        <span>{item.name}</span>
                        <ChevronRightIcon size="20" strokeWidth={1.5} />
                    </div>
                    {item.subMenuItems && (
                        <Menu
                            id={`sub-menu-${index}`}
                            open={openSubMenuIndex === index}
                            onClose={() => setOpenSubMenuIndex(null)}
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
                            anchorEl={subMenuAnchorEl}
                        >
                            {item.subMenuItems.map((subItem, subIndex) => (
                                <MenuItem key={subIndex} onClick={subItem.onClick}>
                                    {subItem.name}
                                </MenuItem>
                            ))}
                        </Menu>
                    )}
                </MenuItem>
            ))}
        </Menu>
    )
}
