### Data Structure of ChatView

## Session

Each conversation between LLM and user is stored as a _session_. session has following structure defined in _scr/render/store/sessionActions.ts_:

```typescript

```

## Chat Send Process

Send Clicked-> function _handleSubmit_ in \<InputBox\\> (\src\render\ChatPane) trigger function _sessionActions.submitNewUserMessage_ in \src\render\stores\sessionActions.ts, which is a file that manages all session actions. -> all session information is stored in _\_sessionsAtom_ in /src/stores/atoms.ts ->

```typescript
export interface Session {
    id: string
    type?: SessionType
    name: string
    picUrl?: string
    messages: Message[]
    copilotId?: string
}
```

## ChatView

The whole chat page consists of three main components: _ChatHistory_, _Header_ and _ChatPane_. The ChatHistory is in charge of managing session history. ChatPane is in charge of managing how the chat is display and interacted.

## MessageList

How the session is displayed is defined in component _scr/renderer/components/MessageList_

The _Message_ is defined in _src/shared/types/ts_

```typescript
export interface Message {
    id: string

    role: MessageRole
    content: string
    name?: string

    cancel?: () => void
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
```
