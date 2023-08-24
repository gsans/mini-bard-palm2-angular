// Source: https://cloud.google.com/vertex-ai/docs/generative-ai

export function createPrompt(
  prompt: string = "What is the largest number with a name?",
  temperature: number = 0,
  maxOutputTokens: number = 100,
  topP: number = 0.70,
  topK: number = 40
): TextRequest {
  const request : TextRequest = {
    "instances": [
      {
        "prompt": `${prompt}`
      }
    ],
    "parameters": {
      "temperature": temperature,
      "maxOutputTokens": maxOutputTokens,
      "topP": topP,
      "topK": topK
    }
  }
  return request;
}  

// Text API
export interface TextRequest {
  instances: TextInstance[];
  parameters: Parameters;
}

export interface TextInstance {
  prompt: string;
}

export interface TextResponse {
  predictions: TextPrediction[];
  metadata: Metadata;
}

export interface TextPrediction {
  content: string;
  citationMetadata: CitationMetadata;
  safetyAttributes: SafetyAttributes;
}


// Chat API
export interface ChatRequest {
  instances: ChatInstance[];
  parameters: Parameters;
}

export interface ChatInstance {
  prompt: string;
}

export interface ChatResponse {
  predictions: ChatPrediction[];
  metadata: Metadata;
}

export interface ChatPrediction {
  candidates: Candidate[];
  citationMetadata: CitationMetadata;
  safetyAttributes: SafetyAttributes;
}


// Code API  
export interface CodeRequest {
  instances: CodeInstance[];
  parameters: Parameters;
}

export interface CodeInstance {
  prompt: string;
}

export interface CodeResponse {
  predictions: CodePrediction[];
  metadata: Metadata;
}

export interface CodePrediction {
  candidates: Candidate[];
  citationMetadata: CitationMetadata;
  safetyAttributes: SafetyAttributes;
}


// Imagen API
export interface ImagenRequest {
  instances: ImagenInstance[];
}

export interface ImagenInstance {
  prompt: string;
}

export interface ImagenResponse {
  predictions: string[];
  deployedModelId?: string;
  model?: string;
  modelDisplayName?: string;
  modelVersionId?: string;
}


// Shared types
export interface Parameters {
  temperature: number;
  maxOutputTokens: number;
  topP: number;
  topK: number;
}

export interface Candidate {
  author: string;
  content: string;
}

export interface CitationMetadata {
  citations: any[];
}

export interface SafetyAttributes {
  categories: string[];
  blocked: boolean;
  scores: number[];
}

export interface Metadata {
  tokenMetadata: TokenMetadata;
}

export interface TokenMetadata {
  inputTokenCount: InputTokenCount;
  outputTokenCount: InputTokenCount;
}

export interface InputTokenCount {
  totalBillableCharacters: number;
  totalTokens: number;
}

/// Chat

export interface Prompt {
  context?: string;
  examples?: PromptExample[];
  messages: PromptMessage[];
}

export interface PromptExample {
  input: { content: string };
  output: { content: string };
}

export interface PromptMessage {
  content: string;
}

export interface MessageRequest {
  model: string;
  temperature?: number;
  candidateCount?: number;
  prompt: Prompt;
}

export function createMessage(
  model: string,
  text: string = "What is the largest number with a name?",
  temperature: number = 0.5,
  candidateCount: number = 1,
  context?: string,
  examples?: PromptExample[],
): MessageRequest {
  const request: MessageRequest = {
    model: model,
    temperature: temperature, 
    candidateCount: candidateCount,
    prompt: {
      messages: [{ content: text }],
    }
  };
  if (context) {
    request.prompt.context = context;
  }
  if (examples) {
    request.prompt.examples = examples;
  }
  return request;
}


export interface Message {
  author: string;
  content: string;
}

export interface MessageResponse {
  candidates: Candidate[];
  messages: Message[];
}


/// Embeddings

export interface EmbeddingRequest {
  model: string,
  text: string;
}
export function createEmbedding(
  model: string,
  text: string = "What is the largest number with a name?",
): EmbeddingRequest {
  const request: EmbeddingRequest = {
    "model": model,
    "text": text
  }
  return request;
}

export interface EmbeddingResponse {
  embedding: {
    value: number[];
  };
}