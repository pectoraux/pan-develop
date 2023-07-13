// tsup.config.ts
import { defineConfig } from "tsup";
var tsup_config_default = defineConfig({
  entry: {
    index: "src/index.ts",
    "connectors/miniProgram": "connectors/miniProgram/index.ts",
    "connectors/binanceWallet": "connectors/binanceWallet/index.ts",
    chains: "chains/index.ts"
  },
  format: ["esm", "cjs"],
  dts: true
});
export {
  tsup_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidHN1cC5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3RzdXAnXG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIGVudHJ5OiB7XG4gICAgaW5kZXg6ICdzcmMvaW5kZXgudHMnLFxuICAgICdjb25uZWN0b3JzL21pbmlQcm9ncmFtJzogJ2Nvbm5lY3RvcnMvbWluaVByb2dyYW0vaW5kZXgudHMnLFxuICAgICdjb25uZWN0b3JzL2JpbmFuY2VXYWxsZXQnOiAnY29ubmVjdG9ycy9iaW5hbmNlV2FsbGV0L2luZGV4LnRzJyxcbiAgICBjaGFpbnM6ICdjaGFpbnMvaW5kZXgudHMnLFxuICB9LFxuICBmb3JtYXQ6IFsnZXNtJywgJ2NqcyddLFxuICBkdHM6IHRydWUsXG59KVxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFBO0FBRUEsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsT0FBTztBQUFBLElBQ0wsT0FBTztBQUFBLElBQ1AsMEJBQTBCO0FBQUEsSUFDMUIsNEJBQTRCO0FBQUEsSUFDNUIsUUFBUTtBQUFBLEVBQ1Y7QUFBQSxFQUNBLFFBQVEsQ0FBQyxPQUFPLEtBQUs7QUFBQSxFQUNyQixLQUFLO0FBQ1AsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
