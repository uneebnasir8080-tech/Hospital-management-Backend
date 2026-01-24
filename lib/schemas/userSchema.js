import z from "zod";

// --- Define the Schema ---
const createUserSchema = z.object({
  // Validation for req.body
  body: z.object({
    name: z.string().min(3, "Username must be at least 3 chars"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6),
    role: z.string().optional()
  }),

  // Validation for req.query (optional)
  query: z
    .object({
      referralCode: z.string().optional(),
    })
    .optional(),

  // Validation for req.params (optional)
  params: z.object({}).optional(),
});

export { createUserSchema };
