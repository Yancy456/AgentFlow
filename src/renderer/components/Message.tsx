import { useEffect, useState, useRef } from 'react'
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import { Typography, Grid, useTheme } from '@mui/material'
import PersonIcon from '@mui/icons-material/Person'
import SmartToyIcon from '@mui/icons-material/SmartToy'
import SettingsIcon from '@mui/icons-material/Settings'
import { useTranslation } from 'react-i18next'
import { Message, SessionType } from '@/stores/session/data'
import { useAtomValue, useSetAtom } from 'jotai'
import {
    showMessageTimestampAtom,
    showTokenCountAtom,
    openSettingDialogAtom,
    enableMarkdownRenderingAtom,
} from '../stores/atoms'
import { currsentSessionPicUrlAtom, showTokenUsedAtom } from '../stores/atoms'
import * as scrollActions from '../stores/scrollActions'
import Markdown from '@/components/Markdown'
import '../static/Block.css'
import MessageErrTips from './MessageErrTips'
import * as dateFns from 'date-fns'
import { cn } from '@/lib/utils'
import { estimateTokensFromMessages } from '@/packages/token'
import { Collapse, IconButton, TextField, Button } from '@mui/material'
import * as React from 'react'
import { ChevronRight } from 'lucide-react'

export interface Props {
    id?: string
    sessionId: string
    sessionType: SessionType
    msg: Message
    className?: string
    collapseThreshold?: number
    hiddenButtonGroup?: boolean
    small?: boolean
}

export default function Message(props: Props) {
    const { t } = useTranslation()
    const theme = useTheme()

    const showMessageTimestamp = useAtomValue(showMessageTimestampAtom)
    const showTokenCount = useAtomValue(showTokenCountAtom)
    const showTokenUsed = useAtomValue(showTokenUsedAtom)
    const enableMarkdownRendering = useAtomValue(enableMarkdownRenderingAtom)
    const currentSessionPicUrl = useAtomValue(currsentSessionPicUrlAtom)
    const setOpenSettingWindow = useSetAtom(openSettingDialogAtom)
    const [isOpen, setOpen] = React.useState(true)

    const { msg, className, collapseThreshold, hiddenButtonGroup, small } = props

    const needCollapse =
        collapseThreshold &&
        JSON.stringify(msg.content).length > collapseThreshold &&
        JSON.stringify(msg.content).length - collapseThreshold > 50
    const [isCollapsed, setIsCollapsed] = useState(needCollapse)

    const ref = useRef<HTMLDivElement>(null)

    const tips: string[] = []
    if (props.sessionType === 'chat' || !props.sessionType) {
        if (showTokenCount && !msg.generating) {
            if (msg.tokenCount === undefined) {
                msg.tokenCount = estimateTokensFromMessages([msg])
            }
            tips.push(`token count: ${msg.tokenCount}`)
        }
        if (showTokenUsed && msg.role === 'assistant' && !msg.generating) {
            tips.push(`tokens used: ${msg.tokensUsed || 'unknown'}`)
        }
    }

    if (showMessageTimestamp && msg.timestamp !== undefined) {
        let date = new Date(msg.timestamp)
        let messageTimestamp: string
        if (dateFns.isToday(date)) {
            messageTimestamp = dateFns.format(date, 'HH:mm')
        } else if (dateFns.isThisYear(date)) {
            messageTimestamp = dateFns.format(date, 'MM-dd HH:mm')
        } else {
            messageTimestamp = dateFns.format(date, 'yyyy-MM-dd HH:mm')
        }

        tips.push('time: ' + messageTimestamp)
    }

    useEffect(() => {
        if (msg.generating) {
            scrollActions.scrollToBottom()
        }
    }, [msg.content])

    let content = msg.content
    if (typeof msg.content !== 'string') {
        content = JSON.stringify(msg.content)
    }
    if (msg.generating) {
        content += '...'
    }
    if (needCollapse && isCollapsed) {
        content = msg.content.slice(0, collapseThreshold) + '... '
    }

    const CollapseButton = (
        <span
            className="cursor-pointer inline-block font-bold text-blue-500 hover:text-white hover:bg-blue-500"
            onClick={() => setIsCollapsed(!isCollapsed)}
        >
            [{isCollapsed ? t('Expand') : t('Collapse')}]
        </span>
    )

    return (
        <Box
            ref={ref}
            id={props.id}
            key={msg.id}
            className={cn(
                'group/message',
                'msg-block',
                'px-2',
                msg.generating ? 'rendering' : 'render-done',
                {
                    user: 'user-msg',
                    system: 'system-msg',
                    assistant: 'assistant-msg',
                }[msg?.role || 'user'],
                className
            )}
            sx={{
                margin: '0',
                paddingBottom: '0.1rem',
                paddingX: '1rem',
                [theme.breakpoints.down('sm')]: {
                    paddingX: '0.3rem',
                },
            }}
        >
            <Grid container wrap="nowrap" spacing={1.5}>
                <Grid item>
                    <Box sx={{ marginTop: '8px' }}>
                        {
                            {
                                assistant: currentSessionPicUrl ? (
                                    <Avatar
                                        src={currentSessionPicUrl}
                                        sx={{
                                            width: '28px',
                                            height: '28px',
                                        }}
                                    />
                                ) : (
                                    <Avatar
                                        sx={{
                                            backgroundColor: theme.palette.primary.main,
                                            width: '28px',
                                            height: '28px',
                                        }}
                                    >
                                        <SmartToyIcon fontSize="small" />
                                    </Avatar>
                                ),
                                user: (
                                    <Avatar
                                        sx={{
                                            width: '28px',
                                            height: '28px',
                                        }}
                                        className="cursor-pointer"
                                        onClick={() => setOpenSettingWindow('chat')}
                                    >
                                        <PersonIcon fontSize="small" />
                                    </Avatar>
                                ),
                                system: (
                                    <Avatar
                                        sx={{
                                            backgroundColor: theme.palette.warning.main,
                                            width: '28px',
                                            height: '28px',
                                        }}
                                    >
                                        <SettingsIcon fontSize="small" />
                                    </Avatar>
                                ),
                            }[msg.role]
                        }
                    </Box>
                </Grid>
                <Grid item xs sm container sx={{ width: '0px', paddingRight: '15px' }}>
                    <Grid item xs>
                        {msg.reasoning_content ? (
                            <Box>
                                Reasoning process
                                <IconButton
                                    onClick={(e) => {
                                        setOpen(!isOpen)
                                    }}
                                    sx={{ ml: 1, p: 0 }}
                                >
                                    <ChevronRight
                                        size={24}
                                        style={{
                                            transition: 'transform 0.3s ease',
                                            transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
                                        }}
                                    />
                                </IconButton>
                                <Collapse in={isOpen}>
                                    <Box sx={{ p: 2, border: '1px solid #ccc', borderRadius: 1, bgcolor: '#fff' }}>
                                        <div>{msg.reasoning_content}</div>
                                    </Box>
                                </Collapse>
                            </Box>
                        ) : (
                            <Box></Box>
                        )}

                        <Box
                            className={cn('msg-content', { 'msg-content-small': small })}
                            sx={small ? { fontSize: theme.typography.body2.fontSize } : {}}
                        >
                            {enableMarkdownRendering && !isCollapsed ? (
                                <Markdown>{content}</Markdown>
                            ) : (
                                <div>
                                    {content}
                                    {needCollapse && isCollapsed && CollapseButton}
                                </div>
                            )}
                        </Box>
                        <MessageErrTips msg={msg} />
                        {needCollapse && !isCollapsed && CollapseButton}
                        <Typography variant="body2" sx={{ opacity: 0.5, paddingBottom: '2rem' }}>
                            {tips.join(', ')}
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    )
}
