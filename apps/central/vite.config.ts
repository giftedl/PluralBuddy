import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import { motionStudio } from "motion-studio";
import { tanstackStart } from '@tanstack/react-start/plugin/vite'

import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { nitro } from 'nitro/vite'

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [devtools(), nitro(), tailwindcss(), tanstackStart(), viteReact(), motionStudio()],
})

export default config
