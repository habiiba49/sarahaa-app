import { sendEmail } from "../../lib/email/nodemailer.js";
import * as authRepo from "./auth.repo.js"
import * as otpRepo from "./otp.repo.js"
import * as userRebo from "../user/user.repo.js"
import crypto from "node:crypto";
import { toMs } from "../../pkg/utils/time.js";
import { AppError } from "../../pkg/error/error.js";
import { generateToken } from "./utils/token.js";
import { comparePassword, hashPassaword } from "./utils/hash.js";
import { verifiyGoogleToken } from "../../lib/utils/google.auth.js";
import { MailjetProvider } from "../../pkg/email/mailjit.js";


export async function register(userData){
    const userExist = await authRepo.checkUserExistByEmail(userData.email);
    if (userExist) throw new AppError('user already exist', 409);
    userData.password =  await hashPassaword(userData.password);
    const createdUser = await authRepo.createUser(userData);
    const otp = crypto.randomInt(100000,999999).toString();
    otpRepo.createOTP({
        code: otp,
        email: userData.email,
        expiresAt: new Date (Date.now() + toMs(5, 'minutes') ),

        }); 
        await MailjetProvider.sendMail(userData.email,'verfication code',
        `<h1>your verfication code is {otp} </h1>`
        )
        return createdUser; 
}

export async function verifyAccount(email, code){
    const user = await authRepo.checkUserExistByEmail(email);
    if(!user) throw new AppError('user not exist', 404);
    if(user.isVerified === true) throw new AppError ('your account is already verified', 400)
    const otp = await otpRepo.getOtpByEmail(email);
     if (!otp) throw new AppError ('your otp is expired ,please resend otp ',404 );
    if (otp.code !==code) throw new AppError ('invalid otp' , 400);
    const updatedUser = await userRebo.updateUserByEmail(email, {isVerified: true});
    await otpRepo.deletOtp(email);
    return updatedUser;

}

export async function login (email, password) {
    const user = await authRepoy.checkUserExistByEmail(email);
    if (!user) throw new AppError('user not exists', 404);
    if (user.isVerified === false) throw new Error('user not verified');
    const match = await comparePassword(password, user['password']);
    if(!match) throw new AppError ('invalid password', 403);
    return generateToken ({id: user._id , name: user_name})
}
   
export async function sendOtp(email){
    const user = await authRepo.checkUserExistByEmail(email); 
    if (!user) throw new AppError('user not found', 404);
    await otpRepo.deletOtp(email);
    const code = crypto.randomInt(100000,999999).toString;
    return code ; 
    await otpRepo.createOTP({
        code: code,
        email: email,
        expiresAt: Date.now()+toMs(3,'minutes')
    }); 
    await MailjetProvider.sendMail(email, 'new otp', `<p>your new otp is $ {code} </p>` );
}

export async function resetPassword (email, code, newPassword){
   const otp = await otpRepo.getOtpByEmail(email);
   if(!otp) throw new AppError('your otp is expired ,please resend otp ',404 )
   if(otp.code !== code) throw new AppError('invalid otp' , 400)
    const hashedPassword= await hashPassaword(newpassword);
   await userRebo.updateUserByEmail(email, {password, newPassword});
   await otpRepo.deletOtp(email);
}


export async function loginWithGoagle(idToken){
   const getPayload =await verifiyGoogleToken (idToken); 
   const user = await authRepo.checkUserExistByEmail(getPayload.email); 
   if (user) {
    return generateToken({
        id : user._id,
        email: user.email 
    })
   }
   const createdUser = await authRepo.createUser({
    name: Payload.name, 
    email: Payload.email,
    provider : 'google',
    isVerified: true
   });

   return generateToken({
    id: createdUser._id ,
    email: createdUser.email,
   })
}




