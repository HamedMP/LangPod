import { Inngest } from "inngest";
import { helloWorld } from "./functions";
import { env } from "@/env.mjs";

// Create a client to send and receive events
export const inngest = new Inngest({
  id: "langpod",
  eventKey: env.INNGEST_EVENT_KEY,
  signingKey: env.INNGEST_SIGNING_KEY,
});
