export interface ApiKeyInfo {
  id: string;
  name: string | null;
  prefix: string | null;
  start: string | null;
  createdAt: string;
}

export interface ApiKeyCreated {
  key: string;
  id: string;
  prefix: string | null;
  start: string | null;
}