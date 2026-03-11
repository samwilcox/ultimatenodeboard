/**
 * ============================================================================
 * UNB Theme CSS Builder
 * ============================================================================
 * Bundles theme CSS and enables hot reload during development.
 */

const esbuild = require('esbuild');

const ENTRY = './css/main.css';
const OUTFILE = `./css/dist/unb-admincp.css`;

/* -------------------------------------------------------------------------- */
/* esbuild config                                                              */
/* -------------------------------------------------------------------------- */

async function build() {
  try {
    await esbuild.build({
      entryPoints: [ENTRY],
      bundle: true,
      outfile: OUTFILE,
      sourcemap: true,
      minify: false,
      loader: {
        '.css': 'css',
        '.png': 'file',
        '.jpg': 'file',
        '.svg': 'file',
        '.woff': 'file',
        '.woff2': 'file'
      },
    });

    console.log('✔ UNB AdminCP theme CSS rebuilt');
  } catch (err) {
    console.error('CSS Build failed:', err);
  }
}

/* Initial build */
build();