import type { OpenNextConfig } from "@opennextjs/aws/types/open-next.js";
import { default as cache } from "@opennextjs/cloudflare/kv-cache";
import memoryQueue from "@opennextjs/cloudflare/memory-queue";

 
const config: OpenNextConfig = {
  default: {
    override: {
      wrapper: "cloudflare-node",
      converter: "edge",
      // set `incrementalCache` to "dummy" to disable KV cache
      incrementalCache: async () => cache,
      queue: async () => memoryQueue,
      tagCache: "dummy",
    },
  },
 
  middleware: {
    external: true,
    override: {
      wrapper: "cloudflare-edge",
      converter: "edge",
      proxyExternalRequest: "fetch",
    },
  },
};

 
export default config;
