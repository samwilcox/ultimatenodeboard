/**
 * ============================================================================
 * UNB Theme UI Builder
 * ============================================================================
 * Bundles theme JS and enables hot reload during development.
 */

const esbuild = require('esbuild');

const ENTRY = `./js/app.js`;
const OUTFILE = `./js/dist/unb-admincp-ui.js`;

/* -------------------------------------------------------------------------- */
/* esbuild config                                                              */
/* -------------------------------------------------------------------------- */

async function build() {
  await esbuild.build({
    entryPoints: [ENTRY],
    bundle: true,
    outfile: OUTFILE,
    format: 'iife',
    sourcemap: true,
    minify: false,
    inject: ['./js/shims/jquery-global.js']
  });

  console.log('✔ UNB AdminCP theme JS rebuilt');
}

/* Initial build */
build();