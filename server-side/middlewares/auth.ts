import { Request, Response, NextFunction } from 'express';
import jwt, { VerifyErrors, Secret } from 'jsonwebtoken';

interface AuthenticatedRequest extends Request{
    token?: string;
    authData?: any
};

const secretKey: Secret = process.env.JWT_SECRET || "defaultSecret";
export const authenticateJwt = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const bearerHeader = req.headers.authorization || req.cookies.token;

        if (typeof bearerHeader !== 'undefined') {
            const token = bearerHeader.split(' ')[1];
            req.token = token;

            jwt.verify(req.token, secretKey, (error: VerifyErrors | null, decoded: any) => {
                if (error) {
                    if (error.name === "TokenExpiredError") {
                        res.status(401).json({ message: 'Token Expired' });
                    } else {
                        res.status(401).json({ message: 'Token Invalid' });
                    }
                } else {
                    req.authData = decoded.user;
                    res.status(200).json({message: "Token Validated" });
                    next();
                }
            });
        }
    } catch (error) {
        res.status(401).json({ message: 'Invalid Token' });
    }
};