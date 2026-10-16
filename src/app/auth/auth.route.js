
import {Router} from 'express';
import * as authController from "./auth.controller.js";
import { idempotency } from '../../lib/idempotency/idempotency.js';

const authRouter= Router();
authRouter.post ('/register', authController.register);
authRouter.patch('/verify-account', authController.verifyAccount);
authRouter.post ('/login', authController.login);
authRouter.post('/send-otp', authController.sendOtp);
authRouter.patch('./reset-password',idempotency(), authController.resetPassword);
authRouter.post('./login-with-google', authController.loginWithGoagle);


export default authRouter;
