
export interface Source {
  title: string;
  uri: string;
}

export interface FactCheckResult {
  isFact: boolean | null; // null for inconclusive
  explanation: string;
  sources: Source[];
}
