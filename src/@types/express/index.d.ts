export {};

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        name: string;
        document: string;
        email: string;
        created_at: Date;
        updated_at: Date;
      };

      trainer?: {
        id: string;
        user_id: string;
      };

      student?: {
        id: string;
        user_id: string;
      };
    }
  }
}
