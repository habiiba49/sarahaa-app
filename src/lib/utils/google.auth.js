import { AppError } from "../../pkg/error/error.js";
import{env} from "../config/env.js"
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client()

export async function verifiyGoogleToken (idToken){
    try {
        const ticket = await client.verifyIdToken({
          idToken: idToken,
          audience: [env.google.webClientId,env.google.iosClientId]

        });
        return ticket.getPayload();
      } catch(error){
    throw new AppError('invalid google token')
} 
}