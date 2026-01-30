import { z } from "zod";

export const applyLawyerSchema = z.object({
  barRegistrationNumber: z.string().min(5),
  barCouncilState: z.string().min(2),
  specialization: z.array(z.string()).min(1),
  experienceYears: z.number().min(0),
});
