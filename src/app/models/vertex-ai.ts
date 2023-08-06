// Author: @gerardsans
// version: 1.0
// Date: 6-Aug-2023
// Source: https://cloud.google.com/vertex-ai/docs/generative-ai

export interface RequestText {
  instances: Instance[];
  parameters: Parameters;
}

export interface Parameters {
  temperature: number;
  maxOutputTokens: number;
  topP: number;
  topK: number;
}

export interface Instance {
  prompt: string;
}

export interface ResponseText {
  predictions: PredictionText[];
}
export interface ResponseChat {
  predictions: PredictionChat[];
}
export interface ResponseCode {
  predictions: PredictionCode[];
}

export interface ResponseImagen {
  predictions: string[];
  deployedModelId?: string;
  model?: string;
  modelDisplayName?: string;
  modelVersionId?: string;
}

export interface PredictionText {
  content: string;
}

interface PredictionChat {
  candidates: Candidate[] | undefined;
}

interface PredictionCode {
  candidates: Candidate[] | undefined;
}

export interface PredictionBase extends PredictionText, PredictionChat, PredictionCode {
  citationMetadata: CitationMetadata;
  safetyAttributes: SafetyAttributes;
}

export interface SafetyAttributes {
  categories: string[];
  blocked: boolean;
  scores: number[];
}

export interface CitationMetadata {
  citations: any[];
}

interface Candidate {
  author: string;
  content: string;
}