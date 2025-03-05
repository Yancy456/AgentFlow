import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: '6d5444da-0f1d-4ab8-b0b0-9f5a783c5d8b',
    baseURL: 'https://ark.cn-beijing.volces.com/api/v3',
});

async function main()
{
    // Streaming:
    console.log('----- streaming request -----')
    const stream = await openai.chat.completions.create({
        messages: [
            {role: 'system', content: '你是人工智能助手'},
            {role: 'user', content: '常见的十字花科植物有哪些？'},
        ],
        model: 'ep-20250216065055-p6bvt',
        stream: true,
    });
    console.log(stream)

    let i = 1
    for await (const part of stream)
    {
        process.stdout.write(String(i) + ' ')
        i++
        process.stdout.write(part.choices[0]?.delta?.content || '');
    }
    process.stdout.write('\n');
}

main();