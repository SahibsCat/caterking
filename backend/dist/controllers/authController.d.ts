import { type Request, type Response } from 'express';
export declare const loginWithMobile: (req: Request, res: Response) => Promise<void>;
export declare const verifyOtp: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createGuestSession: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=authController.d.ts.map