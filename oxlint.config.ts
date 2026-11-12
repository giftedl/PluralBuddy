import { defineConfig } from "oxlint";
import { configs } from "@slipher/eslint-plugin"

export default defineConfig({
    jsPlugins: ["./seyfert-plugin.ts"],
    rules: configs.recommended[0]?.rules,
    options: {
        typeAware: true
    }
})