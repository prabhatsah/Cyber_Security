import type { AgentProfile } from '../agents/types';

export interface TerminalProps {
  className?: string;
}

export interface TerminalHeaderProps {
  title?: string;
}

export interface TerminalResponseProps {
  agents: AgentProfile[];
}

export interface AgentIntroductionProps {
  agent: AgentProfile;
  delay: number;
}

export interface TypingEffectProps {
  text: string;
  delay?: number;
  className?: string;
}