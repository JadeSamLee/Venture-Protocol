import { z } from 'zod'

export const CreateTokenSchema = z.object({
  name: z.string(),
  symbol: z.string(),
  merchantAddress: z.string().optional(),
  canDistribute: z.boolean().optional(),
  canLP: z.boolean().optional()
})

export const DistributeTokenSchema = z.object({
  tokenAddress: z.string(),
  userId: z.string(),
  amount: z.number()
})

export const CreateLiquiditySchema = z.object({
  tokenAddress: z.string(),
  amount: z.number()
})

export const SpendTokenSchema = z.object({
  tokenAddress: z.string(),
  userId: z.string(),
  amount: z.number()
})

export const WithdrawTokenSchema = z.object({
  tokenAddress: z.string(),
  userId: z.string(),
  amount: z.number()
})

export type CreateTokenInput = z.infer<typeof CreateTokenSchema>
export type DistributeTokenInput = z.infer<typeof DistributeTokenSchema>
export type CreateLiquidityInput = z.infer<typeof CreateLiquiditySchema>
export type SpendTokenInput = z.infer<typeof SpendTokenSchema>
export type WithdrawTokenInput = z.infer<typeof WithdrawTokenSchema>

export interface ActionResponse<T = any> {
  success: boolean
  data?: T
  error?: string
} 