import express from 'express';
import {registerController, loginController, userDataController, updateUsername, updatePassword} from '../controller/UserController';
import { authenticateJwt } from '../middlewares/auth';

const router = express.Router();

router.post('/register', registerController);
router.post('/login', loginController);
router.get('/check-auth', authenticateJwt);
router.get('/get-user-data', userDataController)
router.put('/update-username', updateUsername);
router.put('/update-password', updatePassword);

export default router;