import terser from "@rollup/plugin-terser";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import pkg from "./package.json";

const COPYRIGHT = `/*!
 * ${pkg.name} - ${pkg.description}
 * @version    ${pkg.version}
 * @author     ${pkg.author}
 * @website    ${pkg.homepage}
 * @license    ${pkg.license} License
 * @copyright  Copyright © 2021 - ${(new Date()).getFullYear()} ${pkg.copyright}
 */`;
const COPYLINE = `/*! ${pkg.name} | @version ${pkg.version} | @license ${pkg.license} | @copyright ${pkg.copyright} */`;

export default defineConfig({
    build: {
        outDir: 'dist',
        minify: false,
        sourcemap: true,
        lib: {
            entry: 'src/lightbox.ts',
            name: 'rat.Lightbox',
            fileName: (format) => {
                if (format === 'es') {
                    return 'rat.lightbox.mjs';
                } else if (format === 'umd') {
                    return 'rat.lightbox.js';
                } else {
                    return `rat.lightbox.${format}.js`;
                }
            },
        },
        rollupOptions: {
            external: [
                'bootstrap'
            ],
            output: [
                {
                    banner: COPYRIGHT,
                    compact: false,
                    entryFileNames: "rat.lightbox.mjs",
                    esModule: true,
                    format: "es",
                    name: 'Lightbox',
                },
                {
                    banner: COPYLINE,
                    compact: true,
                    entryFileNames: "rat.lightbox.min.mjs",
                    esModule: true,
                    format: "es",
                    name: 'Lightbox',
                    plugins: [terser()]
                },
                {
                    amd: {
                        id: 'rat.Lightbox'
                    },
                    compact: false,
                    entryFileNames: "rat.lightbox.js",
                    esModule: false,
                    format: "umd",
                    intro: '"use strict";',
                    name: "rat.Lightbox",
                    strict: false,
                    plugins: [
                        { 
                            name: "copyright-banner", 
                            generateBundle(_, b) { 
                                Object.values(b).forEach(f => f.type === "chunk" && f.fileName.endsWith(".js") && (f.code = `${COPYRIGHT}\n${f.code}`));
                            }
                        }
                    ]
                },
                {
                    amd: {
                        id: 'rat.Lightbox'
                    },
                    compact: true,
                    entryFileNames: "rat.lightbox.min.js",
                    esModule: false,
                    format: "umd",
                    intro: '"use strict";',
                    name: "rat.Lightbox",
                    strict: false,
                    plugins: [
                        terser(),
                        { 
                            name: "copyright-banner", 
                            generateBundle(_, b) { 
                                Object.values(b).forEach(f => f.type === "chunk" && f.fileName.endsWith(".js") && (f.code = `${COPYLINE}\n${f.code}`));
                            }
                        }
                    ]
                },
            ],
        },
    },
    define: {
        __VERSION__: JSON.stringify(pkg.version)
    },
    esbuild: {
        legalComments: 'inline'
    },
    plugins: [
        dts({
            entryRoot: 'src',
            outDir: 'dist',
            rollupTypes: true,
        }),
    ],
});
