import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    root: './',
    include: ['**/*.e2e-spec.ts'],
    // Reutiliza la configuración de entorno del proyecto (.env con DATABASE_URL).
    setupFiles: ['dotenv/config'],
    // Las pruebas usan la base de datos real: se ejecutan los archivos en serie.
    fileParallelism: false,
  },
});
