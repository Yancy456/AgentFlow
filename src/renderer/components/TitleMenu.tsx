import React, { useState, useRef, useEffect } from 'react'
import { Menu, MenuItem, Accordion, AccordionSummary, AccordionDetails } from '@mui/material'
import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'

// 菜单项接口定义
interface MenuItemDefinition {
    name: string
    click?: () => void
    link?: string
    subMenu?: MenuItemDefinition[]
}

interface TitleMenuProps {
    menuItems: MenuItemDefinition[]
    mainMenuAnchorEl: HTMLElement | null
    mainMenuOpen: boolean
    handleMainMenuClose: () => void
}

// 子菜单组件 - 使用弹出式菜单
const MenuItemWithSubMenu = ({
    item,
    handleMenuItemClick,
    handleMainMenuClose,
}: {
    item: MenuItemDefinition
    handleMenuItemClick: (item: MenuItemDefinition) => void
    handleMainMenuClose: () => void
}) => {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
    const menuRef = useRef<HTMLLIElement | null>(null)
    const [parentWidth, setParentWidth] = useState(0)
    const [parentHt, setParentHeight] = useState(0)

    useEffect(() => {
        if (menuRef.current) {
            const { offsetWidth, offsetHeight } = menuRef.current
            setParentWidth(offsetWidth)
            setParentHeight(offsetHeight)
        }
    }, [menuRef])

    const handleSubMenuOpen = (event: React.MouseEvent<HTMLLIElement>) => {
        event.stopPropagation()
        event.preventDefault()
        setAnchorEl(event.currentTarget)
    }

    const handleSubMenuClose = () => {
        setAnchorEl(null)
    }

    const handleSubItemClick = (subItem: MenuItemDefinition, event?: React.MouseEvent) => {
        // 阻止冒泡，只处理子菜单项的点击
        event?.stopPropagation()
        handleMenuItemClick(subItem)
        handleSubMenuClose()
        // 如果子菜单项有点击处理函数，则只关闭子菜单
        // 如果没有子菜单，则关闭整个主菜单
        if (!subItem.subMenu && subItem.click) {
            handleMainMenuClose()
        }
    }

    return (
        <>
            <MenuItem
                ref={menuRef}
                id={item.name}
                disableRipple
                onClick={
                    item.subMenu && item.subMenu.length > 0
                        ? handleSubMenuOpen
                        : (event) => {
                              event.stopPropagation()
                              handleMenuItemClick(item)
                          }
                }
            >
                <div className="w-full flex justify-between">
                    <div>{item.name}</div>
                    {item.subMenu && item.subMenu.length > 0 && <ChevronRight size="20" strokeWidth={1.5} />}
                </div>
            </MenuItem>
            {item.subMenu && item.subMenu.length > 0 && (
                <Menu
                    id={`${item.name}-submenu`}
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={(event, reason) => {
                        handleSubMenuClose()
                    }}
                    MenuListProps={{
                        'aria-labelledby': item.name,
                    }}
                    onClick={(e) => e.stopPropagation()}
                    disableAutoFocusItem
                    sx={{
                        '& .MuiPaper-root': {
                            borderRadius: '12px',
                            boxShadow: '1px',
                            zIndex: 1400,
                        },
                    }}
                    disablePortal={false}
                    disableRestoreFocus
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                >
                    {item.subMenu.map((subItem, index) => (
                        <MenuItem
                            key={`${item.name}-submenu-item-${index}`}
                            disableRipple
                            onClick={(event) => handleSubItemClick(subItem, event)}
                        >
                            <div className="w-full flex justify-between">
                                <div>{subItem.name}</div>
                            </div>
                        </MenuItem>
                    ))}
                </Menu>
            )}
        </>
    )
}

export default function TitleMenu({ menuItems, mainMenuAnchorEl, mainMenuOpen, handleMainMenuClose }: TitleMenuProps) {
    // 处理菜单项点击
    const handleMenuItemClick = (item: MenuItemDefinition) => {
        if (item.click) {
            item.click()
        }

        // 如果没有子菜单，点击后关闭主菜单
        if (!item.subMenu || item.subMenu.length === 0) {
            handleMainMenuClose()
        }
    }

    // 添加全局点击事件监听器，当点击发生在菜单外部时关闭菜单
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            // 检查点击是否发生在任何菜单元素外部
            if (
                mainMenuOpen &&
                !(event.target as Element).closest('.MuiMenu-root') &&
                !(event.target as Element).closest('#main-menu-button')
            ) {
                handleMainMenuClose()
            }
        }

        // 添加事件监听器
        document.addEventListener('mousedown', handleClickOutside)

        // 清理函数
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [mainMenuOpen, handleMainMenuClose])

    return (
        // 主菜单
        <Menu
            id="main-menu"
            anchorEl={mainMenuAnchorEl}
            open={mainMenuOpen}
            onClose={(event, reason) => {
                // 无论什么原因关闭，都调用handleMainMenuClose
                handleMainMenuClose()
            }}
            MenuListProps={{
                'aria-labelledby': 'main-menu-button',
            }}
            disableAutoFocusItem
            // 确保主菜单不会因为子菜单的点击而关闭
            keepMounted
            // 设置主菜单的z-index
            sx={{
                '& .MuiPaper-root': {
                    borderRadius: '12px',
                    boxShadow: '1px',
                    zIndex: 1300, // 确保比子菜单的z-index低
                },
            }}
        >
            {menuItems.map((item, index) => (
                <MenuItemWithSubMenu
                    key={`main-menu-item-${index}`}
                    item={item}
                    handleMenuItemClick={handleMenuItemClick}
                    handleMainMenuClose={handleMainMenuClose}
                />
            ))}
        </Menu>
    )
}
