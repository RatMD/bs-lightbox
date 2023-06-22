
const fs = require('fs');
const path = require('path');
const replace = require('@rollup/plugin-replace');
const terser = require('@rollup/plugin-terser');
const typescript = require('@rollup/plugin-typescript');
const pkg = require('./package.json');


const COPYRIGHT = `/*!
|  ${pkg.name} - ${pkg.description}
|  @file       ${pkg.main}
|  @version    ${pkg.version}
|  @author     ${pkg.author}${pkg.contributors? "\n |\t\t\t\t" + pkg.contributors.join("\n |\t\t\t\t"): ""}
|  
|  @website    ${pkg.homepage}
|  @license    ${pkg.license} License
|  @copyright  Copyright © 2021 - ${(new Date()).getFullYear()} ${pkg.copyright}
*/`;
const COPYSMALL = `/*! ${pkg.name} | @version ${pkg.version} | @license ${pkg.license} | @copyright ${pkg.copyright} */`;


function docBuild() {
    return {
        name: 'documentation-build',
        writeBundle: (options, bundle) => {
            for (let [filename, chunk] of Object.entries(bundle)) {
                let dirname = path.join(__dirname, 'docs', 'dist', path.dirname(filename));
                if (!fs.existsSync(dirname)) {
                    fs.mkdirSync(dirname, { recursive: true });
                }

                if (chunk.code) {
                    fs.writeFileSync(`${dirname}/${path.basename(filename)}`, chunk.code, 'utf-8');
                }
                if (chunk.source) {
                    fs.writeFileSync(`${dirname}/${path.basename(filename)}`, chunk.source, 'utf-8');
                }
            }
        }
    };
}


module.exports = (() => {
    return [
        {
            input: 'src/ts/index.ts',
            output: [
                {
                    amd: {
                        id: 'rat.Lightbox'
                    },
                    banner: COPYRIGHT,
                    compact: false,
                    dir: `dist`,
                    entryFileNames: `js/rat.lightbox.js`,
                    esModule: false,
                    format: 'umd',
                    globals: ['bootstrap'],
                    intro: '"use strict";',
                    name: 'rat.Lightbox',
                    strict: false,
                    sourcemap: true,
                    plugins: [
                        docBuild()
                    ]
                },
                {
                    amd: {
                        id: 'rat.Lightbox'
                    },
                    banner: COPYSMALL,
                    compact: true,
                    dir: `dist`,
                    entryFileNames: `js/rat.lightbox.min.js`,
                    esModule: false,
                    format: 'umd',
                    globals: ['bootstrap'],
                    intro: '"use strict";',
                    name: 'rat.Lightbox',
                    strict: false,
                    sourcemap: true,
                    plugins: [
                        terser(),
                        docBuild()
                    ]
                }
            ],
            external: [
                'bootstrap'
            ],
            plugins: [
                replace({
                    preventAssignment: true,
                    values: {
                        __VERSION__: pkg.version,
                    }
                }),
                typescript({})
            ]
        },
        
        {
            input: 'src/ts/index.ts',
            output: [
                {
                    banner: COPYRIGHT,
                    compact: false,
                    dir: `dist`,
                    entryFileNames: `esm/rat.lightbox.js`,
                    esModule: true,
                    format: 'es',
                    globals: ['bootstrap'],
                    intro: '"use strict";',
                    name: 'Lightbox',
                    strict: false,
                    sourcemap: true,
                    plugins: [
                        docBuild()
                    ]
                },
                {
                    banner: COPYSMALL,
                    compact: true,
                    dir: `dist`,
                    entryFileNames: `esm/rat.lightbox.min.js`,
                    esModule: true,
                    format: 'es',
                    globals: ['bootstrap'],
                    intro: '"use strict";',
                    name: 'Lightbox',
                    strict: false,
                    sourcemap: true,
                    plugins: [
                        terser(),
                        docBuild()
                    ]
                }
            ],
            external: [
                'bootstrap'
            ],
            plugins: [
                replace({
                    preventAssignment: true,
                    values: {
                        __VERSION__: pkg.version,
                    }
                }),
                typescript({})
            ]
        }
    ];
});
