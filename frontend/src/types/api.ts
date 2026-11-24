type TPaginated<T> = {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
};

type TApiErrorBody = {
  message?: string | string[];
  error?: string;
  statusCode?: number;
};

export type { TPaginated, TApiErrorBody };
