import { Mastra } from "@mastra/core";
import { LibSQLStore } from "@mastra/libsql";
import { PinoLogger } from "@mastra/loggers";
import { jarvisSupervisorAgent } from "./agents/jarvis-supervisor";

export const mastra = new Mastra({
  agents: {
    jarvisSupervisorAgent
  },
  storage: new LibSQLStore({
    id: "toptraining-jarvis-mastra-storage",
    url: process.env.MASTRA_LIBSQL_URL || ":memory:"
  }),
  logger: new PinoLogger({
    name: "TopTrainingJarvisMastra",
    level: process.env.NODE_ENV === "production" ? "info" : "debug"
  })
});

export { createMastraAgentFromConfig } from "./agents/factory";
