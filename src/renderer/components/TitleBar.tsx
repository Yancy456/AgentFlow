import React, { useState } from 'react'
import { useAtom, useAtomValue } from 'jotai'
import * as atoms from '../stores/atoms'
import { useTranslation } from 'react-i18next'
import { IconButton } from '@mui/material'
import { Menu as MenuIcon } from 'lucide-react'
import icon from '@/static/icon.png'
import TitleMenu from './TitleMenu'
import { useNavigate } from 'react-router-dom'

export default function TitleBar() {
    const currentSession = useAtomValue(atoms.currentSessionAtom)
    const [openSettingWindow, setOpenSettingWindow] = useAtom(atoms.openSettingDialogAtom)
    const navigate = useNavigate()

    // 主菜单状态
    const [mainMenuAnchorEl, setMainMenuAnchorEl] = useState<null | HTMLElement>(null)
    const mainMenuOpen = Boolean(mainMenuAnchorEl)

    // 打开主菜单
    const handleMainMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setMainMenuAnchorEl(event.currentTarget)
    }

    // 关闭主菜单
    const handleMainMenuClose = () => {
        setMainMenuAnchorEl(null)
    }
    const { t } = useTranslation()
    // 定义菜单项
    const menuItems = [
        {
            name: t('File'),
            subMenu: [
                { name: t('Open Work Space'), click: () => console.log('New file') },
                { name: t('Open'), click: () => console.log('Open file') },
                { name: t('Save'), click: () => console.log('Save file') },
            ],
        },
        {
            name: t('View'),
            subMenu: [
                { name: t('Chat'), click: () => navigate('/') },
                { name: t('Agent Design'), click: () => navigate('/AgentFlow') },
            ],
        },
        {
            name: t('Settings'),
            click: () => setOpenSettingWindow('ai'),
        },
        {
            name: t('Help'),
            subMenu: [
                { name: t('About'), click: () => console.log('About') },
                { name: t('Documentation'), click: () => console.log('Documentation') },
            ],
        },
    ]

    // 标题栏配置
    const title = 'ChatFlow'

    return (
        <div
            className="h-[30.5px] shrink-0 w-full bg-[#f2f2f2] flex content-center items-center justify-between"
            style={{ WebkitAppRegion: 'drag' }}
        >
            <div className="h-full flex content-center">
                <div style={{ WebkitAppRegion: 'none' }}>
                    <IconButton
                        id="icon-button"
                        aria-controls={mainMenuOpen ? 'main-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={mainMenuOpen ? 'true' : undefined}
                        onClick={handleMainMenuOpen}
                        disableRipple
                    >
                        <MenuIcon size={20} strokeWidth={1.5} color="black" />
                    </IconButton>
                </div>

                <img src={icon} className="w-5 h-5 mt-[7px]" alt="ChatFlow Icon" />
            </div>
            <div>{title}</div>
            <div className="w-[150px]"></div>

            <TitleMenu
                menuItems={menuItems}
                mainMenuAnchorEl={mainMenuAnchorEl}
                mainMenuOpen={mainMenuOpen}
                handleMainMenuClose={handleMainMenuClose}
            />
        </div>
    )
}
