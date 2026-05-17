import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppError } from 'src/common/error/app-error';
import { FlaggedKeywordService } from 'src/flagged-keywords/flagged-keyword.service';

@Injectable()
export class AiService {
    private readonly apiKey: string;
    private readonly apiUrl = 'https://openrouter.ai/api/v1/chat/completions';

    private readonly MODELS = [
        'meta-llama/llama-3.3-70b-instruct:free',
        'openai/gpt-oss-120b:free',
        'google/gemma-4-31b-it-20260402:free',
        'arcee-ai/trinity-large-thinking:free',
        'deepseek/deepseek-v4-flash-20260423:free',
    ];

    private readonly MODERATION_PROMPT = `
        You are a human-like professional assistant. Your job is to respond naturally like a real person—not a typical AI chatbot.
        Sound conversational, realistic, and confident. Write like an experienced freelancer, developer, or founder talking normally.

        CORE BEHAVIOR:
        1. If the user asks for a reply/message, generate the actual message directly.
        2. Do NOT explain what the user should say unless explicitly asked.
        3. Avoid robotic wording, corporate phrasing, and template-style responses.
        4. Never use phrases like: "I'd be happy to help", "Certainly", "As an AI".
        5. Avoid fake enthusiasm and unnecessary politeness.

        STRICT SAFETY RULES (MANDATORY - FIVERR COMPLIANCE):
        1. NEVER suggest or ask for outside communication (WhatsApp, Telegram, Email, Skype, etc.) or outside payments (PayPal, Bank Transfer, Crypto) unless the user specifically included them in their input.
        2. If you MUST mention a prohibited word (WhatsApp, Email, PayPal, Google, etc.), you MUST OBFUSCATE it heavily using multiple dashes or dots.
           Examples: "W-h-a-t-s-A-p-p", "P-a-y-p-a-l", "G-o-o-g-l-e", "E-m-a-i-l".
        3. For "WhatsApp", prefer using "the green app" or "W.A.".
        4. For "Money Transfer" or "Payment", use "funds", "milestone", or "transaction".
        5. REMOVE any mention of "Review", "Feedback", or "5 Stars" as these violate platform terms.
        6. Respond ONLY with the rewritten message.
    `;

    constructor(
        private configService: ConfigService,
        private flaggedKeywordService: FlaggedKeywordService,
    ) {
        this.apiKey = this.configService.get<string>('OPEN_ROUTER_API')!;
    }

    private async tryModel(model: string, content: string, keywordPairs: { keyword: string, replaceWord: string }[]): Promise<string | null> {
        const foundPairs = keywordPairs.filter(p =>
            content.toLowerCase().includes(p.keyword.toLowerCase())
        );

        const obfuscationInstructions = foundPairs
            .map(p => `"${p.keyword}" -> "${p.replaceWord}"`)
            .join(', ');

        const systemPrompt = `
            ${this.MODERATION_PROMPT}
            ${foundPairs.length > 0 ? `STRICTLY OBFUSCATE THESE WORDS AS FOLLOWS: ${obfuscationInstructions}` : ''}
        `;

        try {
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'HTTP-Referer': 'http://localhost:3000',
                    'X-Title': 'NestJS Backend',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model,
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: content },
                    ],
                }),
            });

            const data = await response.json();

            if (!response.ok || data?.error) {
                console.error(`[AiService] Model ${model} failed:`, data?.error?.message || 'Unknown error');
                return null;
            }

            const result = data.choices[0]?.message?.content?.trim();
            return result || null;
        } catch (error) {
            console.error(`[AiService] Model ${model} fetch failed:`, error.message);
            return null;
        }
    }

    async generateSafeMessage(content: string): Promise<string | null> {
        if (!this.apiKey) {
            throw new AppError(500, 'OPEN_ROUTER_API not configured');
        }

        // Fetch keywords from database
        const keywords = await this.flaggedKeywordService.getActiveKeywords();

        for (const model of this.MODELS) {
            const result = await this.tryModel(model, content, keywords as any);

            if (result) {
                console.log(`[AiService] Model ${model} → Success`);
                return result;
            }
        }

        console.error('[AiService] All models failed to generate a safe message.');
        return null;
    }
}
