import type { DiagnosticScaleQuestionContent } from '@/services/diagnostic-scale/typings.d';

export interface OptionRow {
  key: string;
  label: string;
  score: number;
}

export interface ScoreEntry {
  _id: string;
  answer: string;
  score: number;
}

let seId = 0;
export function nextSeId(): string {
  return `se_${++seId}`;
}

export function toOptionRows(
  content?: DiagnosticScaleQuestionContent,
): OptionRow[] {
  if (!content) return [];
  return content.options.map((opt) => ({
    key: opt.key,
    label: opt.label,
    score: content.score_map[opt.key] ?? content.default_score,
  }));
}

export function fromOptionRows(
  rows: OptionRow[],
  allowMultiple: boolean,
  defaultScore: number,
): DiagnosticScaleQuestionContent {
  const options = rows.map((r) => ({ key: r.key, label: r.label }));
  const scoreMap: Record<string, number> = {};
  for (const r of rows) {
    scoreMap[r.key] = r.score;
  }
  return {
    options,
    score_map: scoreMap,
    allow_multiple: allowMultiple,
    default_score: defaultScore,
  };
}

export function toScoreEntries(
  content?: DiagnosticScaleQuestionContent,
): ScoreEntry[] {
  if (!content) return [];
  return Object.entries(content.score_map).map(([answer, score]) => ({
    _id: nextSeId(),
    answer,
    score,
  }));
}

export function fromScoreEntries(
  entries: ScoreEntry[],
  defaultScore: number,
): DiagnosticScaleQuestionContent {
  const scoreMap: Record<string, number> = {};
  for (const e of entries) {
    scoreMap[e.answer] = e.score;
  }
  return {
    options: [],
    score_map: scoreMap,
    allow_multiple: false,
    default_score: defaultScore,
  };
}
