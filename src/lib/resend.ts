import { env } from "@/env.js"
import { Resend } from "resend"

// Создаем объект только если ключ существует, иначе оставляем null
export const resend = env.RESEND_API_KEY 
  ? new Resend(env.RESEND_API_KEY) 
  : null
