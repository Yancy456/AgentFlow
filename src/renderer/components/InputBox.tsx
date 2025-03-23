import React, { useRef, useState } from 'react'
import { Typography, useTheme } from '@mui/material'
import { SessionType, createMessage } from '../../shared/types'
import { useTranslation } from 'react-i18next'
import * as atoms from '../stores/atoms'
import { useSetAtom } from 'jotai'
import * as sessionActions from '../stores/session/sessionActions'
import { Paperclip, SendHorizontal, Settings2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import icon from '../static/icon.png'
import { trackingEvent } from '@/packages/event'
import MiniButton from './MiniButton'
import _ from 'lodash'

export interface Props {
    currentSessionId: string
    currentSessionType: SessionType
}

export default function InputBox(props: Props) {
    const theme = useTheme()
    const setChatConfigDialogSession = useSetAtom(atoms.chatConfigDialogAtom)
    const { t } = useTranslation()
    const [messageInput, setMessageInput] = useState('') // the variable that stores the input text, maybe rich text editor layer?
    const [generating, setGenerating] = useState(false)
    const inputRef = useRef<HTMLTextAreaElement | null>(null)

    const handleSubmit = async (needGenerating = true) => {
        if (messageInput.trim() === '') {
            return
        }
        const newMessage = createMessage('user', messageInput)
        /*format of newMessage = {
            id: uuidv4(),
            content: content,
            role: role,
            timestamp: new Date().getTime(),
        }*/
        setMessageInput('')
        setGenerating(true)
        await sessionActions.submitNewUserMessage({
            currentSessionId: props.currentSessionId,
            newUserMsg: newMessage,
            needGenerating,
        })
        setGenerating(false)

        //trackingEvent('send_message', { event_category: 'user' }) // Telemetry data collection
    }

    const minTextareaHeight = 20
    const maxTextareaHeight = 40

    const onMessageInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const input = event.target.value
        setMessageInput(input)
    }

    const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Enter' && !event.shiftKey && !event.ctrlKey && !event.altKey && !event.metaKey) {
            event.preventDefault()
            handleSubmit()
            return
        }
        if (event.key === 'Enter' && event.ctrlKey) {
            event.preventDefault()
            handleSubmit(false)
            return
        }
    }

    return (
        <div
            className="m-3 rounded-lg"
            style={{
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: theme.palette.divider,
            }}
        >
            <div className={cn('w-full mx-auto flex flex-col', 'p-1')}>
                <textarea
                    className={cn(
                        `w-full max-h-[${maxTextareaHeight}px]`,
                        'resize-none border-none outline-none',
                        'overflow-y resize-none border-none outline-none',
                        'bg-transparent p-2'
                        //'bg-transparent p-1'
                    )}
                    value={messageInput}
                    onChange={onMessageInput}
                    onKeyDown={onKeyDown}
                    ref={inputRef}
                    style={{
                        height: 'auto',
                        minHeight: minTextareaHeight + 'px',
                        color: theme.palette.text.primary,
                        fontFamily: theme.typography.fontFamily,
                        fontSize: theme.typography.body1.fontSize,
                    }}
                    placeholder={t('How can I help you ?') || ''}
                />

                <div className="flex items-center flex-row-reverse">
                    <MiniButton
                        className=" relative"
                        style={{
                            opacity: generating ? 0.7 : 1,
                            cursor: generating ? 'not-allowed' : 'pointer',
                        }}
                        tooltipTitle={
                            <Typography variant="caption">
                                {t('[Enter] send, [Shift+Enter] line break, [Ctrl+Enter] send without generating')}
                            </Typography>
                        }
                        tooltipPlacement="top"
                        onClick={() => !generating && handleSubmit()}
                        disabled={generating}
                    >
                        {generating ? (
                            <div className="relative w-full h-full">
                                <svg
                                    className="absolute inset-0 w-full h-full"
                                    style={{ transform: 'rotate(-90deg)' }}
                                    viewBox="0 0 100 100"
                                >
                                    <rect
                                        x="2.5"
                                        y="2.5"
                                        width="95"
                                        height="95"
                                        fill="none"
                                        stroke={theme.palette.primary.main}
                                        strokeWidth="5"
                                        strokeDasharray="25 375"
                                        strokeDashoffset="0"
                                        style={{
                                            animation: 'progress 2s linear infinite',
                                        }}
                                    />
                                </svg>
                                <SendHorizontal size="20" strokeWidth={1} />
                            </div>
                        ) : (
                            <div className="flex items-center justify-center w-full h-full">
                                <SendHorizontal size="20" strokeWidth={1} />
                            </div>
                        )}
                    </MiniButton>
                    <MiniButton
                        className=" relative"
                        style={{
                            opacity: generating ? 0.7 : 1,
                            cursor: generating ? 'not-allowed' : 'pointer',
                        }}
                        tooltipTitle={<Typography variant="caption">{t('Attach files')}</Typography>}
                        tooltipPlacement="top"
                        onClick={() => !generating && handleSubmit()}
                        disabled={generating}
                    >
                        <Paperclip size="20" strokeWidth={1} />
                    </MiniButton>
                </div>
            </div>
            <style>
                {`
                    @keyframes progress {
                        from {
                            stroke-dashoffset: 0;
                        }
                        to {
                            stroke-dashoffset: -400;
                        }
                    }
                `}
            </style>
        </div>
    )
}
