import z from "zod";
import { updateProrileSchema } from "@/schemes/updateProfile";

export type Profile = z.infer<typeof updateProrileSchema>

export interface ProfileDto extends Profile {
    id: number;
}
