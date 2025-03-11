/*
Below defines the type of Session
*/
export type SessionType = 'chat'

export interface Session {
    id: string 
    type?: SessionType 
    name: string // the name of current session
    picUrl?: string
    messages: Message[] 
    copilotId?: string
}


/*
Below defines the structure of single message in the session
*/

export const MessageRoleEnum = {
    System: 'system',
    User: 'user',
    Assistant: 'assistant',
} as const

export type MessageRole = (typeof MessageRoleEnum)[keyof typeof MessageRoleEnum]

export enum ModelProvider {
    ChatboxAI = 'chatbox-ai',
    OpenAI = 'openai',
    Claude = 'claude',
    Ollama = 'ollama',
    SiliconFlow = 'silicon-flow',
    LMStudio = 'lm-studio',
    PPIO = 'ppio',
}

export interface Message {
    id: string

    role: MessageRole
    content: string
    reasoning_content?: string
    name?: string

    cancel?: () => void // why is function?
    generating?: boolean

    aiProvider?: ModelProvider
    model?: string

    errorCode?: number
    error?: string
    errorExtra?: {
        [key: string]: any
    }

    wordCount?: number
    tokenCount?: number
    tokensUsed?: number
    timestamp?: number
}

