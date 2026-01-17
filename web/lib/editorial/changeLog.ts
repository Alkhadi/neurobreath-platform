import type { EditorialChangeLogEntry, ChangeLogType } from './pageEditorial';

export const createChangeLogEntry = (date: string, summary: string, type: ChangeLogType): EditorialChangeLogEntry => ({
  date,
  summary,
  type,
});

export const createChangeLog = (entries: EditorialChangeLogEntry[]): EditorialChangeLogEntry[] => {
  return [...entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};
