export type publicUser = {
  id: string;
  name: string;
  document: string;
  email: string;
  created_at: Date;
  updated_at: Date;
};

export type userData = {
  document: string;
  email: string;
};

export type userIndexes =
  | {
      email: string;
    }
  | {
      document: string;
    }
  | {
      id: string;
    };
