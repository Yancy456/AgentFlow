import React, { useRef, useState } from 'react'
import { Typography, useTheme } from '@mui/material'
import { SessionType, createMessage } from '../../shared/types'
import { useTranslation } from 'react-i18next'
import * as atoms from '../stores/atoms'
import { useSetAtom } from 'jotai'
import * as sessionActions from '../stores/sessionActions'
import { SendHorizontal, Settings2 } from 'lucide-react'
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
    const inputRef = useRef<HTMLTextAreaElement | null>(null)

    const handleSubmit = (needGenerating = true) => {
        if (messageInput.trim() === '') {
            return
        }
        const newMessage = createMessage('user', messageInput)
        /*newMessage = {
            id: uuidv4(),
            content: content,
            role: role,
            timestamp: new Date().getTime(),
        }*/

        sessionActions.submitNewUserMessage({
            currentSessionId: props.currentSessionId,
            newUserMsg: newMessage,
            needGenerating,
        })
        setMessageInput('')
        //trackingEvent('send_message', { event_category: 'user' }) // Telemetry data collection
    }

    const minTextareaHeight = 20
    const maxTextareaHeight = 40

    const onMessageInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const input = event.target.value
        setMessageInput(input)
    }

    const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.keyCode === 13 && !event.shiftKey && !event.ctrlKey && !event.altKey && !event.metaKey) {
            event.preventDefault()
            handleSubmit()
            return
        }
        if (event.keyCode === 13 && event.ctrlKey) {
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
                <div
                    className="flex flex-row flex-nowrap justify-between"
                    //className="flex flex-row flex-nowrap justify-between py-1"
                >
                    <div className="flex flex-row items-center">
                        <MiniButton
                            className="mr-2"
                            style={{ color: theme.palette.text.primary }}
                            onClick={() => setChatConfigDialogSession(sessionActions.getCurrentSession())}
                            tooltipTitle={
                                <div className="text-center inline-block">
                                    <span>{t('Customize settings for the current conversation')}</span>
                                </div>
                            }
                            tooltipPlacement="top"
                        >
                            <Settings2 size="20" strokeWidth={1} />
                        </MiniButton>
                    </div>
                    <div className="flex flex-row items-center">
                        <MiniButton
                            className="w-8 ml-2"
                            style={
                                {
                                    //color: theme.palette.getContrastText(theme.palette.primary.main),
                                    //backgroundColor: theme.palette.primary.main,
                                }
                            }
                            tooltipTitle={
                                <Typography variant="caption">
                                    {t('[Enter] send, [Shift+Enter] line break, [Ctrl+Enter] send without generating')}
                                </Typography>
                            }
                            tooltipPlacement="top"
                            onClick={() => handleSubmit()}
                        >
                            <SendHorizontal size="20" strokeWidth={1} />
                        </MiniButton>
                    </div>
                </div>
            </div>
        </div>
    )
}
