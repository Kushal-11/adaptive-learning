// User types
export interface User {
  _id: string;
  name: string;
  email: string;
  role: "buyer" | "seller" | "both";
  createdAt: number;
}

// Agent types
export interface AgentPreferences {
  categories: string[];
  maxPrice?: number;
  minPrice?: number;
  location?: string;
  urgency: "low" | "medium" | "high";
}

export interface AgentThresholds {
  maxNegotiationRounds: number;
  acceptableMargin: number; // percentage
  timeoutMinutes: number;
}

export interface Agent {
  _id: string;
  userId: string;
  name: string;
  type: "buyer" | "seller";
  preferences: AgentPreferences;
  thresholds: AgentThresholds;
  status: "active" | "inactive" | "negotiating";
  createdAt: number;
}

// Deal types
export interface DealItem {
  name: string;
  description: string;
  category: string;
  initialPrice: number;
}

export interface LastOffer {
  price: number;
  fromAgent: "buyer" | "seller";
  timestamp: number;
}

export interface NegotiationState {
  currentPrice: number;
  rounds: number;
  lastOffer: LastOffer;
}

export interface Deal {
  _id: string;
  buyerAgentId: string;
  sellerAgentId: string;
  item: DealItem;
  negotiationState: NegotiationState;
  finalPrice?: number;
  status: "active" | "completed" | "failed" | "timeout";
  createdAt: number;
  completedAt?: number;
}

export interface EnrichedDeal extends Deal {
  buyerAgent?: Agent;
  sellerAgent?: Agent;
}

// Event types
export interface EventData {
  price?: number;
  reason?: string;
}

export interface Event {
  _id: string;
  dealId: string;
  message: string;
  timestamp: number;
  agentActor: "buyer" | "seller" | "system";
  eventType: "offer" | "counteroffer" | "accept" | "reject" | "timeout" | "system";
  data?: EventData;
}

export interface EnrichedEvent extends Event {
  deal?: Deal;
}

// Form types
export interface AgentFormData {
  name: string;
  type: "buyer" | "seller";
  preferences: AgentPreferences;
  thresholds: AgentThresholds;
}

export interface CreateDealFormData {
  buyerAgentId: string;
  sellerAgentId: string;
  item: DealItem;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Negotiation types
export interface NegotiationStep {
  success: boolean;
  action?: "offer" | "counteroffer" | "accept" | "timeout";
  price?: number;
  actor?: "buyer" | "seller";
  reason?: string;
}

export interface AgentDecision {
  action: "offer" | "accept" | "reject";
  price?: number;
  reasoning: string;
}

// Enums
export enum AgentType {
  BUYER = "buyer",
  SELLER = "seller"
}

export enum AgentStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  NEGOTIATING = "negotiating"
}

export enum DealStatus {
  ACTIVE = "active",
  COMPLETED = "completed",
  FAILED = "failed",
  TIMEOUT = "timeout"
}

export enum EventType {
  OFFER = "offer",
  COUNTEROFFER = "counteroffer",
  ACCEPT = "accept",
  REJECT = "reject",
  TIMEOUT = "timeout",
  SYSTEM = "system"
}

export enum Urgency {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high"
}

export enum UserRole {
  BUYER = "buyer",
  SELLER = "seller",
  BOTH = "both"
}
