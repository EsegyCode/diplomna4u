import { onRequest as __api_lead_ts_onRequest } from "C:\\Users\\Nicky\\Desktop\\diplomna4u\\diplomna4u\\functions\\api\\lead.ts"

export const routes = [
    {
      routePath: "/api/lead",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_lead_ts_onRequest],
    },
  ]