import { definePolicies, definePolicy, matchSchema } from "comply";
import { z } from "zod";

export const guard = definePolicies([
  definePolicy(
    "has valid params",
    matchSchema(z.object({ contactId: z.string().or(z.literal("new")) }))
  ),
]);
