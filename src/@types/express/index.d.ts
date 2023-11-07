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
        trainer_id: string;
        user_id: string;
      };

      student?: {
        student_id: string;
        user_id: string;
      };
    }
  }
}
