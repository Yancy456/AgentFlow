import { Message } from 'src/shared/types'
import { ApiError, ChatboxAIAPIError } from './errors'
import Base, { onResultChange } from './base'

interface Options {
    openaiKey: string
    apiHost: string
    apiPath?: string
    model: Model | 'custom-model'
    openaiCustomModel?: string
    temperature: number
    topP: number
}

export default class OpenAI extends Base {
    public name = 'OpenAI'

    public options: Options
    constructor(options: Options) {
        super()
        this.options = options
        if (this.options.apiHost && this.options.apiHost.trim().length === 0) {
            this.options.apiHost = 'https://api.openai.com'
        }
        if (this.options.apiHost && this.options.apiHost.startsWith('https://openrouter.ai/api/v1')) {
            this.options.apiHost = 'https://openrouter.ai/api'
        }
        if (this.options.apiPath && !this.options.apiPath.startsWith('/')) {
            this.options.apiPath = '/' + this.options.apiPath
        }
    }

    async callChatCompletion(
        rawMessages: Message[],
        onResultChange: onResultChange,
        signal?: AbortSignal,
    ): Promise<void> {
        try {
            await this._callChatCompletion(rawMessages,  onResultChange,signal)
        } catch (e) {
            if (
                e instanceof ApiError &&
                e.message.includes('Invalid content type. image_url is only supported by certain models.')
            ) {
                throw ChatboxAIAPIError.fromCodeName('model_not_support_image', 'model_not_support_image')
            }
            throw e
        }
    }

    async _callChatCompletion(
        rawMessages: Message[],
        onResultChange: onResultChange,
        signal?: AbortSignal
    ): Promise<void> {
        const model = this.options.model === 'custom-model' ? this.options.openaiCustomModel || '' : this.options.model

        //rawMessages = injectModelSystemPrompt(model, rawMessages)

        //if (model.startsWith('o1')) {
        //    const messages = await populateO1Message(rawMessages)
        //    this.requestChatCompletionsNotStream({ model, messages }, signal, onResultChange)
        //}

        const messages = await populateGPTMessage(rawMessages.slice(1, rawMessages.length - 1))
        console.log(`messages:${JSON.stringify(messages)}`)
        await this.requestChatCompletionsStream(
            {
                messages,
                model,
                // vision 模型的默认 max_tokens 极低，基本很难回答完整，因此手动设置为模型最大值
                max_tokens:
                    this.options.model === 'gpt-4-vision-preview'
                        ? openaiModelConfigs['gpt-4-vision-preview'].maxTokens
                        : undefined,
                temperature: this.options.temperature,
                top_p: this.options.topP,
                stream: true,
            },
            (delta)=>{
                if (delta?.reasoning_content) {
                    // 安全地拼接reasoning_content，处理undefined的情况
                    const currentContent = rawMessages[rawMessages.length - 1].reasoning_content || ''
                    rawMessages[rawMessages.length - 1].reasoning_content = currentContent + delta.reasoning_content
                }

                if (delta?.content) {
                    // 安全地拼接content，处理undefined的情况
                    const currentContent = rawMessages[rawMessages.length - 1].content || ''
                    rawMessages[rawMessages.length - 1].content = currentContent + delta.content
                }
                onResultChange()
            },
            signal
        )
    }

    async requestChatCompletionsStream(
        requestBody: Record<string, any>,
        updateMessage: (response: any) => void,
        signal?: AbortSignal
    ): Promise<void> {
        const apiPath = this.options.apiPath || '/chat/completions'
        const response = await this.post(`${this.options.apiHost}${apiPath}`, this.getHeaders(), requestBody, signal)
        await this.handleSSE(response, (message) => {
            if (message === '[DONE]') {
                return
            }
            const data = JSON.parse(message)
            if (data.error) {
                throw new ApiError(`Error from OpenAI: ${JSON.stringify(data)}`)
            }
            
            console.log(JSON.stringify(data.choices[0]?.delta))
            if(data.choices[0]?.delta){
                updateMessage(data.choices[0]?.delta)
            }
        })
    }

    async requestChatCompletionsNotStream(
        requestBody: Record<string, any>,
        signal?: AbortSignal
    ): Promise<{ content: string; reasoning_content?: string }> {
        // Send post request to get completion.
        const apiPath = this.options.apiPath || '/chat/completions'

        console.log(`response json:${JSON.stringify(requestBody, null, 2)}`)

        const response = await this.post(`${this.options.apiHost}${apiPath}`, this.getHeaders(), requestBody, signal)
        const json = await response.json()

        console.log(`response json:${json}`)
        if (json.error) {
            throw new ApiError(`Error from OpenAI: ${JSON.stringify(json)}`)
        }

        return {
            content: json.choices[0].message.content,
            reasoning_content: json.choices[0].message?.reasoning_content,
        }
    }

    getHeaders() {
        const headers: Record<string, string> = {
            Authorization: `Bearer ${this.options.openaiKey}`,
            'Content-Type': 'application/json',
        }
        if (this.options.apiHost.includes('openrouter.ai')) {
            headers['HTTP-Referer'] = 'https://chatboxai.app'
            headers['X-Title'] = 'Chatbox AI'
        }
        return headers
    }
}

// Ref: https://platform.openai.com/docs/models/gpt-4
export const openaiModelConfigs = {
    'gpt-3.5-turbo': {
        maxTokens: 4096,
        maxContextTokens: 16_385,
    },
    'gpt-3.5-turbo-16k': {
        maxTokens: 4096,
        maxContextTokens: 16_385,
    },
    'gpt-3.5-turbo-1106': {
        maxTokens: 4096,
        maxContextTokens: 16_385,
    },
    'gpt-3.5-turbo-0125': {
        maxTokens: 4096,
        maxContextTokens: 16_385,
    },
    'gpt-3.5-turbo-0613': {
        maxTokens: 4096,
        maxContextTokens: 4_096,
    },
    'gpt-3.5-turbo-16k-0613': {
        maxTokens: 4096,
        maxContextTokens: 16_385,
    },

    'gpt-4o-mini': {
        maxTokens: 4_096,
        maxContextTokens: 128_000,
    },
    'gpt-4o-mini-2024-07-18': {
        maxTokens: 4_096,
        maxContextTokens: 128_000,
    },

    'gpt-4o': {
        maxTokens: 4_096,
        maxContextTokens: 128_000,
    },
    'gpt-4o-2024-05-13': {
        maxTokens: 4_096,
        maxContextTokens: 128_000,
    },
    'gpt-4o-2024-08-06': {
        maxTokens: 16_384,
        maxContextTokens: 128_000,
    },
    'gpt-4o-2024-11-20': {
        maxTokens: 16_384,
        maxContextTokens: 128_000,
    },
    'chatgpt-4o-latest': {
        maxTokens: 16_384,
        maxContextTokens: 128_000,
    },

    'o1-preview': {
        maxTokens: 32_768,
        maxContextTokens: 128_000,
    },
    'o1-preview-2024-09-12': {
        maxTokens: 32_768,
        maxContextTokens: 128_000,
    },
    'o1-mini': {
        maxTokens: 100_000,
        maxContextTokens: 200_000,
    },
    'o1-mini-2024-09-12': {
        maxTokens: 65_536,
        maxContextTokens: 128_000,
    },
    'o1-mini-2024-12-17': {
        maxTokens: 100_000,
        maxContextTokens: 200_000,
    },
    'o3-mini': {
        maxTokens: 100_000,
        maxContextTokens: 200_000,
    },
    'o3-mini-2025-01-31': {
        maxTokens: 100_000,
        maxContextTokens: 200_000,
    },
    'gpt-4': {
        maxTokens: 4_096,
        maxContextTokens: 8_192,
    },
    'gpt-4-turbo': {
        maxTokens: 4_096,
        maxContextTokens: 128_000,
    },
    'gpt-4-turbo-2024-04-09': {
        maxTokens: 4_096,
        maxContextTokens: 128_000,
    },
    'gpt-4-0613': {
        maxTokens: 4_096,
        maxContextTokens: 8_192,
    },
    'gpt-4-32k': {
        maxTokens: 4_096,
        maxContextTokens: 32_768,
    },
    'gpt-4-32k-0613': {
        maxTokens: 4_096,
        maxContextTokens: 32_768,
    },
    'gpt-4-1106-preview': {
        maxTokens: 4_096,
        maxContextTokens: 128_000,
    },
    'gpt-4-0125-preview': {
        maxTokens: 4_096,
        maxContextTokens: 128_000,
    },
    'gpt-4-turbo-preview': {
        maxTokens: 4_096,
        maxContextTokens: 128_000,
    },
    'gpt-4-vision-preview': {
        maxTokens: 4_096,
        maxContextTokens: 128_000,
    },

    // https://platform.openai.com/docs/models/continuous-model-upgrades
    'gpt-3.5-turbo-0301': {
        maxTokens: 4096,
        maxContextTokens: 4096,
    },
    'gpt-4-0314': {
        maxTokens: 4096,
        maxContextTokens: 8192,
    },
    'gpt-4-32k-0314': {
        maxTokens: 4096,
        maxContextTokens: 32768,
    },
}
export type Model = keyof typeof openaiModelConfigs
export const models = Array.from(Object.keys(openaiModelConfigs)).sort() as Model[]

export async function populateGPTMessage(rawMessages: Message[]): Promise<OpenAIMessage[]> {
    const messages: OpenAIMessage[] = rawMessages.map((m) => ({
        role: m.role,
        content: m.content,
    }))
    return messages
}

export async function populateO1Message(rawMessages: Message[]): Promise<OpenAIMessage[]> {
    const messages: OpenAIMessage[] = rawMessages.map((m) => ({
        role: m.role === 'system' ? 'user' : m.role,
        content: m.content,
    }))
    return messages
}

export function injectModelSystemPrompt(model: string, messages: Message[]) {
    const metadataPrompt = `
Current model: ${model}
Current date: ${new Date().toISOString()}

`
    let hasInjected = false
    return messages.map((m) => {
        if (m.role === 'system' && !hasInjected) {
            m = { ...m }
            m.content = metadataPrompt + m.content
            hasInjected = true
        }
        return m
    })
}

export interface OpenAIMessage {
    role: 'system' | 'user' | 'assistant'
    content: string
    name?: string
}
