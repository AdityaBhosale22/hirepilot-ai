import { z } from "zod";
import ApiError from "../utils/ApiError.js";

const validate = (schema, property = "body") => {
  return (req, res, next) => {
    try {
      // 1. Parse and validate the data using Zod
      const parsedData = schema.parse(req[property]);

      // 2. THE FIX: Safely reassign the data back to the request object
      if (property === "query") {
        // Redefine the property to bypass Express's getter-only restriction
        Object.defineProperty(req, "query", {
          value: parsedData,
          enumerable: true,
          configurable: true,
          writable: true,
        });
      } else {
        // req.body and req.params can safely be reassigned directly
        req[property] = parsedData;
      }

      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Extract Zod errors (Keep whatever error handling logic you currently have here)
        const errorMessage = error.errors.map((e) => e.message).join(", ");
        return next(new ApiError(400, errorMessage));
      }
      next(error);
    }
  };
};
export default validate;