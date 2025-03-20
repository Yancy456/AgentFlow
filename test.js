import OpenAI from 'openai'
const openai = new OpenAI({
    apiKey: '6d5444da-0f1d-4ab8-b0b0-9f5a783c5d8b',
    baseURL: 'https://ark.cn-beijing.volces.com/api/v3',
})

async function chatCompletionSSE(messages)
{
    const startTime = performance.now();
    let firstTokenTime = 0;
    let hasReceivedFirstToken = false;

    const response = await fetch('https://ark.cn-beijing.volces.com/api/v3/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer 6d5444da-0f1d-4ab8-b0b0-9f5a783c5d8b`,
        },
        body: JSON.stringify({
            messages: messages,
            model: 'ep-20250216065055-p6bvt',
            stream: true
        })
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let result = '';

    while (true)
    {
        const {done, value} = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines)
        {
            if (line.startsWith('data: '))
            {
                const data = line.slice(6);
                if (data === '[DONE]')
                {
                    return {result, firstTokenLatency: firstTokenTime};
                }
                try
                {
                    const parsed = JSON.parse(data);
                    if (parsed.choices[0].delta.content)
                    {
                        if (!hasReceivedFirstToken)
                        {
                            firstTokenTime = performance.now() - startTime;
                            hasReceivedFirstToken = true;
                            console.log(`SSE 首个 token 响应时间: ${firstTokenTime.toFixed(2)}ms`);
                        }
                        result += parsed.choices[0].delta.content;
                        process.stdout.write(parsed.choices[0].delta.content);
                    }
                } catch (e)
                {
                    console.error('Error parsing SSE data:', e);
                }
            }
        }
    }
    return {result, firstTokenLatency: firstTokenTime};
}

async function main()
{
    const messages = [
        {role: 'system', content: '你是人工智能助手'},
        {role: 'user', content: '用一句话介绍下你自己'},
    ];

    // Non-streaming:
    console.log('----- 标准请求 -----')
    const standardStartTime = performance.now();
    const completion = await openai.chat.completions.create({
        messages: messages,
        model: 'ep-20250216065055-p6bvt',
    });
    const standardLatency = performance.now() - standardStartTime;
    console.log(`标准请求响应时间: ${standardLatency.toFixed(2)}ms`);
    console.log(completion.choices[0]);

    // SSE streaming:
    console.log('\n----- SSE 流式请求 -----')
    const {result, firstTokenLatency} = await chatCompletionSSE(messages);

    console.log('\n\n性能对比：');
    console.log(`标准请求响应时间: ${standardLatency.toFixed(2)}ms`);
    console.log(`SSE 首个 token 响应时间: ${firstTokenLatency.toFixed(2)}ms`);
    console.log(`差异: ${(standardLatency - firstTokenLatency).toFixed(2)}ms`);
}

main()
