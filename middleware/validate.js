// middleware/validate.js
import z from "zod";

const validate = (schema) => (req, res, next) => {
  try {
    // 1. Validate the request parts against the schema
    const parsed = schema.parse({
      body: req.body,
      // query: req.query,
      params: req.params,
    });
    
    // 2. Assign the sanitized data back to the request
    // This ensures your controllers receive the correct types/defaults
    req.body = parsed.body;
    // req.query = parsed.query;
    req.params = parsed.params;

    next();
  } catch (error) {
    // 3. Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        status: "error",
        message: "Validation failed",
        errors: error.issues.map((err) => ({
          field: err.path.join("."), // e.g., "body.email"
          message: err.message,
        })),
      });
    }

    // Handle unexpected errors
    return res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
};

export default validate