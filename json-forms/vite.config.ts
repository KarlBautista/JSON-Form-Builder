import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isDev = mode === 'development'
  const enableLocator = isDev && process.platform !== 'win32'

  return {
    // Some tools (including LocatorJS extension) look for this exact string.
    // Vite doesn't define it by default the same way Webpack does.
    define: {
      'process.env.NODE_ENV': JSON.stringify(mode),
    },
    plugins: [
      react({
        // LocatorJS needs build-time instrumentation to know where components live.
        // This Babel plugin injects the metadata used by the Locator runtime/extension.
        babel: enableLocator
          ? {
              plugins: [
                [
                // Use `module:` so Babel doesn't rewrite the scoped name into
                // '@locator/babel-plugin-babel-jsx' (which doesn't exist).
                'module:@locator/babel-jsx',
                {
                  env: 'development',
                },
              ],
              ],
            }
          : undefined,
      }),
      tailwindcss(),
    ],
  }
})
