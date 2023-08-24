// Source: https://developers.generativeai.google/api/rest/generativelanguage/models

export interface CitationMetadata {
  citationSources?: CitationSource[];
}

export interface CitationSource {
  startIndex?: number;
  endIndex?: number;
  uri?: string;
  license?: string;
}

export enum HarmCategory {
  HARM_CATEGORY_UNSPECIFIED = 0,
  HARM_CATEGORY_DEROGATORY = 1,
  HARM_CATEGORY_TOXICITY = 2,
  HARM_CATEGORY_VIOLENCE = 3,
  HARM_CATEGORY_SEXUAL = 4,
  HARM_CATEGORY_MEDICAL = 5,
  HARM_CATEGORY_DANGEROUS = 6
}

export interface ContentFilter {
  reason?: ContentFilter.BlockedReason;
  message?: string;
}

export namespace ContentFilter {
  export enum BlockedReason {
    BLOCKED_REASON_UNSPECIFIED = 0,
    SAFETY = 1,
    OTHER = 2
  }
}

export interface SafetyFeedback {
  rating?: SafetyRating;
  setting?: SafetySetting;
}

export interface SafetyRating {
  category: HarmCategory;
  probability: SafetyRating.HarmProbability;
}

export namespace SafetyRating {
  export enum HarmProbability {
    HARM_PROBABILITY_UNSPECIFIED = 0,
    NEGLIGIBLE = 1,
    LOW = 2,
    MEDIUM = 3,
    HIGH = 4
  }
}

export interface SafetySetting {
  category: HarmCategory;
  threshold: SafetySetting.HarmBlockThreshold;
}

export namespace SafetySetting {
  export enum HarmBlockThreshold {
    HARM_BLOCK_THRESHOLD_UNSPECIFIED = 0,
    BLOCK_LOW_AND_ABOVE = 1,
    BLOCK_MEDIUM_AND_ABOVE = 2,
    BLOCK_ONLY_HIGH = 3
  }
}

export interface TextRequest {
  model: string;
  prompt?: TextPrompt;
  temperature?: number;
  candidateCount?: number;
  maxOutputTokens?: number;
  topP?: number;
  topK?: number;
  safetySettings?: SafetySetting[];
  stopSequences?: string[];
}

export interface TextResponse {
  candidates?: TextCompletion[];
  filters?: ContentFilter[];
  safetyFeedback?: SafetyFeedback[];
}

export interface TextPrompt {
  text: string;
}

export interface TextCompletion {
  output?: string;
  safetyRatings?: SafetyRating[];
  citationMetadata?: CitationMetadata;
}

export interface EmbedTextRequest {
  model: string;
  text: string;
}

export interface EmbedTextResponse {
  embedding?: Embedding;
}

export interface Embedding {
  value?: number[];
}

export interface Model {
  name: string;
  baseModelId: string;
  version: string;
  displayName?: string;
  description?: string;
  inputTokenLimit?: number;
  outputTokenLimit?: number;
  supportedGenerationMethods?: string[];
  temperature?: number;
  topP?: number;
  topK?: number;
}

export interface GetModelRequest {
  name: string;
}

export interface ListModelsRequest {
  pageSize?: number;
  pageToken?: string;
}

export interface ListModelsResponse {
  models?: Model[];
  nextPageToken?: string;
}

export interface MessageRequest {
  model: string;
  prompt: MessagePrompt;
  temperature?: number;
  candidateCount?: number;
  topP?: number;
  topK?: number;
}

export interface MessageResponse {
  candidates?: Message[];
  messages?: Message[];
  filters?: ContentFilter[];
}

export interface Message {
  author?: string;
  content: string;
  citationMetadata?: CitationMetadata;
}

export interface MessagePrompt {
  context?: string;
  examples?: Example[];
  messages: Message[];
}

export interface Example {
  input: Message;
  output: Message;
}

export interface CountMessageTokensRequest {
  model: string;
  prompt: MessagePrompt;
}

export interface CountMessageTokensResponse {
  tokenCount: number;
}


export function createTextRequest(
  model: string = "text-bison-001",
  text: string,
  temperature: number = 0,
  candidateCount: number = 1,
  maxOutputTokens: number = 100,
  topP: number = 0.70,
  topK: number = 40,
  safetySettings?: SafetySetting[],
  stopSequences?: string[],
): TextRequest {
  const request: TextRequest = {
    model,
    "prompt": {
      "text": text
    },
    temperature,
    candidateCount,
    maxOutputTokens,
    topP,
    topK
  }
  /// Example [{ "category": "HARM_CATEGORY_DEROGATORY", "threshold": 1 }, { "category": "HARM_CATEGORY_TOXICITY", "threshold": 1 }, { "category": "HARM_CATEGORY_VIOLENCE", "threshold": 2 }, { "category": "HARM_CATEGORY_SEXUAL", "threshold": 2 }, { "category": "HARM_CATEGORY_MEDICAL", "threshold": 2 }, { "category": "HARM_CATEGORY_DANGEROUS", "threshold": 2 }]
  if (safetySettings) {
    request.safetySettings = safetySettings
  }
  if (stopSequences) {
    request.stopSequences = stopSequences
  }
  return request;
}

function createMessagePrompt(text: string, context?: string, examples?: Example[]): MessagePrompt {
  let prompt = {
    messages: [{ content: text }],
    ...(context && { context }),
    ...(examples && { examples }),
  };
  return prompt;
}

export function createMessage(
  model: string = "text-bison-001",
  text: string,
  temperature: number = 0.5,
  candidateCount: number = 1,
  topP: number = 0.70,
  topK: number = 40,
  context?: string,
  examples?: Example[],
): MessageRequest {
  const prompt = createMessagePrompt(text, context, examples);
  const request: MessageRequest = {
    model,
    prompt,
    temperature,
    topK,
    topP,
    candidateCount,
  };

  return request;
}

export function createEmbedding(
  model: string = "text-bison-001",
  text: string,
): EmbedTextRequest {
  const request: EmbedTextRequest = {
    "model": model,
    "text": text
  }
  return request;
}