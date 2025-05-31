import { z } from "zod";

export const useStudioSettingsSchema = z.object({
    screen: z.string(),
    audio: z.string(),
    preset: z.enum(['HD', 'SD']),
})