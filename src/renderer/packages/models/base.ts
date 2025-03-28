import { Message } from '@/stores/session/data'
import {
    ApiError,
    NetworkError,
    AIProviderNoImplementedPaintError,
    BaseError,
    AIProviderNoImplementedChatError,
} from './errors'
import { createParser } from 'eventsource-parser'
import _ from 'lodash'

export default class Base {
    public name = 'Unknown'

    constructor() {}

    async callChatCompletion(
        messages: Message[],
        onResultChange: onResultChange,
        signal?: AbortSignal
    ): Promise<void> {
        throw new AIProviderNoImplementedChatError(this.name)
    }

    async chat(messages: Message[], onResultUpdated: () => void): Promise<void> /*
     */ {
        messages = await this.preprocessMessage(messages)
        await this._chat(messages, onResultUpdated)
    }

    protected async _chat(messages: Message[], onResultUpdated: () => void): Promise<void> {
        let canceled = false
        const controller = new AbortController()
        const stop = () => {
            canceled = true
            controller.abort()
        }
        try {
            await this.callChatCompletion(messages,  onResultUpdated,controller.signal)
        } catch (error) {
            if (canceled) {
                //return result
            }
            throw error
        }
        //return result
    }

    async preprocessMessage(messages: Message[]): Promise<Message[]> {
        return messages
    }

    async handleSSE(response: Response, onMessage: (message: string) => void) {
        //Establish the Sever-Sent Event(SSE), which the web has a long connection with the server,
        // and the server sends back messages from time to time
        if (!response.ok) {
            const errJson = await response.json().catch(() => null)
            throw new ApiError(errJson ? JSON.stringify(errJson) : `${response.status} ${response.statusText}`)
        }
        if (!response.body) {
            throw new Error('No response body')
        }
        const parser = createParser((event) => {
            if (event.type === 'event') {
                onMessage(event.data)
            }
        })
        for await (const chunk of this.iterableStreamAsync(response.body)) {
            const str = new TextDecoder().decode(chunk)
            parser.feed(str)
        }
    }

    async handleNdjson(response: Response, onMessage: (message: string) => void) {
        if (!response.ok) {
            const errJson = await response.json().catch(() => null)
            throw new ApiError(errJson ? JSON.stringify(errJson) : `${response.status} ${response.statusText}`)
        }
        if (!response.body) {
            throw new Error('No response body')
        }
        let buffer = ''
        for await (const chunk of this.iterableStreamAsync(response.body)) {
            let data = new TextDecoder().decode(chunk)
            buffer = buffer + data
            let lines = buffer.split('\n')
            if (lines.length <= 1) {
                continue
            }
            buffer = lines[lines.length - 1]
            lines = lines.slice(0, -1)
            for (const line of lines) {
                if (line.trim() !== '') {
                    onMessage(line)
                }
            }
        }
    }

    async *iterableStreamAsync(stream: ReadableStream): AsyncIterableIterator<Uint8Array> {
        const reader = stream.getReader()
        try {
            while (true) {
                const { value, done } = await reader.read()
                if (done) {
                    return
                } else {
                    yield value
                }
            }
        } finally {
            reader.releaseLock()
        }
    }

    async post(
        url: string,
        headers: Record<string, string>,
        body: Record<string, any>,
        signal?: AbortSignal,
        retry = 3
    ) {
        let requestError: ApiError | NetworkError | null = null
        for (let i = 0; i < retry + 1; i++) {
            // retry if error
            try {
                //console.log(headers)
                const res = await fetch(url, {
                    method: 'POST',
                    headers,
                    body: JSON.stringify(body),
                    signal,
                })
                if (!res.ok) {
                    const err = await res.text().catch((e) => null)
                    console.log(`error:${err}`)
                    throw new ApiError(`Status Code ${res.status}, ${err}`)
                }
                //console.log(await res.json())
                return res
            } catch (e) {
                if (e instanceof BaseError) {
                    requestError = e
                } else {
                    const err = e as Error
                    const origin = new URL(url).origin
                    requestError = new NetworkError(err.message, origin)
                }
                await new Promise((resolve) => setTimeout(resolve, 500))
            }
        }
        if (requestError) {
            throw requestError
        } else {
            throw new Error('Unknown error')
        }
    }

    async get(url: string, headers: Record<string, string>, signal?: AbortSignal, retry = 3) {
        let requestError: ApiError | NetworkError | null = null
        for (let i = 0; i < retry + 1; i++) {
            try {
                const res = await fetch(url, {
                    method: 'GET',
                    headers,
                    signal,
                })
                if (!res.ok) {
                    const err = await res.text().catch((e) => null)
                    throw new ApiError(`Status Code ${res.status}, ${err}`)
                }
                return res
            } catch (e) {
                if (e instanceof BaseError) {
                    requestError = e
                } else {
                    const err = e as Error
                    const origin = new URL(url).origin
                    requestError = new NetworkError(err.message, origin)
                }
            }
        }
        if (requestError) {
            throw requestError
        } else {
            throw new Error('Unknown error')
        }
    }
}

export type onResultChange = () => void
