
const replace = require('@rollup/plugin-replace');
const typescript = require('@rollup/plugin-typescript');
const { terser } = require('rollup-plugin-terser');
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
                    sourcemap: true
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
                        terser()
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
