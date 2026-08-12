import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
	build: {
		rollupOptions: {
			input: {
				main: resolve(__dirname, 'index.html'),
				trabajosActivos: resolve(__dirname, 'trabajosActivos.html'),
				inventory: resolve(__dirname, 'inventory.html'),
				sequence: resolve(__dirname, 'sequence.html'),
			},
		},
	},
});
