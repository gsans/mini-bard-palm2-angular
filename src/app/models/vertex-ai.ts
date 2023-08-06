// Author: @gerardsans
// version: 1.0
// Date: 6-Aug-2023
// Source: https://cloud.google.com/vertex-ai/docs/generative-ai

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