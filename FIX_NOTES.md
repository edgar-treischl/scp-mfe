# Module Federation CSS Loading Fix

## Root cause

The shell's `e.forEach is not a function` error comes from the generated
`remoteEntry.js` CSS loader receiving a string instead of an array.

`@originjs/vite-plugin-federation@1.4.1` initially generates a CSS placeholder:

```javascript
dynamicLoadingCss('__v__css__/path/to/src/App.tsx', false, './ScpApp');
```

During `generateBundle`, the plugin replaces that placeholder with the emitted
CSS filenames. Its replacement regex matches single- and double-quoted strings,
but not backtick-delimited strings.

With Vite 8's default minifier enabled, the placeholder becomes a template literal
before that replacement runs:

```javascript
dynamicLoadingCss(`__v__css__/path/to/src/App.tsx`, false, `./ScpApp`);
```

The placeholder remains unresolved, and the loader calls `.forEach()` on it.
The unused `'assets'` expression is harmless; removing it does not fix the
argument type. The previous post-build script addressed the wrong cause.

## Fix

Set `build.minify: false` in `vite.config.ts` so the plugin can recognize and
replace its CSS placeholder. Keep `cssCodeSplit: false`, the `/scp-mfe/` base
path, and the exposed `./ScpApp` module unchanged.

The build now produces a call like:

```javascript
dynamicLoadingCss(["style-<hash>.css"], false, "./ScpApp");
```

The CSS loader resolves this filename relative to the remote entry's assets
directory. No generated-file rewriting is needed, so the post-build script
has been removed.

This compatibility setting increases production bundle sizes. Re-enable
minification only after the federation plugin supports the minifier's output.

## Verification and deployment

Run `yarn build`. In `dist/assets/remoteEntry.js`, the `./ScpApp` CSS loader
argument must be an array of emitted CSS filenames, with no `__v__css__`
placeholder remaining.

Deploy the rebuilt output to GitHub Pages. The shell must load the new
`/scp-mfe/assets/remoteEntry.js`; a cached version of the old file will still fail.
