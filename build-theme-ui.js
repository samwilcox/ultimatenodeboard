/**
 * ============================================================================
 * UNB Theme UI Builder
 * ============================================================================
 * Bundles theme JS and enables hot reload during development.
 */

const esbuild = require('esbuild');

const THEME = 'unb-default';
const ENTRY = `themes/${THEME}/js/app.js`;
const OUTFILE = `themes/${THEME}/js/dist/unb-ui.js`;

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
    inject: ['./themes/unb-default/js/shims/jquery-global.js']
  });

  console.log('✔ UNB theme JS rebuilt');
}

/* Initial build */
build();