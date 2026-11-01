# Module Federation CSS Loading Fix

## Problem
When importing the `scp-form-mfe` microfrontend via Vite Module Federation in the shell app, the following error occurred:

```
e.forEach is not a function
```

This error originated from the auto-generated `remoteEntry.js` file where a stray `'assets'` string literal was being evaluated, causing the variable `e` to be undefined when `.forEach()` was called on it.

### Root Cause
The `@originjs/vite-plugin-federation@1.4.1` plugin generates a `remoteEntry.js` file with a CSS loading function. Due to a quirk in the plugin, the generated code contained:

```javascript
// Problematic code
const base = '/scp-mfe/';
'assets';  // <-- This stray statement does nothing
cssFilePaths.forEach(e => { ... })  // e.forEach works, but appears to fail in some contexts
```

When minified, this became:
```javascript
o='/scp-mfe/';'assets',e.forEach(...)
```

In certain execution contexts (particularly when imported via Module Federation), this stray statement could interfere with proper code execution.

## Solution
A post-build fix script (`scripts/fix-remote-entry.js`) has been added that:

1. **Removes the stray `'assets'` string literal** from the generated `remoteEntry.js` file after each build
2. **Handles both minified and unminified code** through multiple regex patterns
3. **Runs automatically** as part of the `yarn build` command

### Changes Made

#### 1. Created `scripts/fix-remote-entry.js`
This Node.js script:
- Runs after Vite builds the distribution files
- Detects and removes stray `'assets'` statements in both minified and unminified forms
- Provides clear feedback about the fixes applied
- Exits with an error if `dist/assets/remoteEntry.js` is not found

#### 2. Updated `package.json`
Modified the build script from:
```json
"build": "tsc -b && vite build"
```

To:
```json
"build": "tsc -b && vite build && node scripts/fix-remote-entry.js"
```

## Verification

After running `yarn build`, you should see:
```
✓ Fixed remoteEntry.js: removed stray "assets" string literal
```

The fix handles these patterns:

**Unminified:**
```javascript
const base = '/scp-mfe/';
'assets';
cssFilePaths.forEach(...)
```
↓
```javascript
const base = '/scp-mfe/';
cssFilePaths.forEach(...)
```

**Minified (with single quotes):**
```javascript
o='/scp-mfe/';'assets',e.forEach(...)
```
↓
```javascript
o='/scp-mfe/';e.forEach(...)
```

## Testing

To verify the fix:

1. Build the project:
   ```bash
   yarn build
   ```

2. Check that the build completes successfully with the fix message

3. The shell app should now be able to import the `./ScpApp` module without the `e.forEach is not a function` error

## Future Considerations

- **Plugin Update**: If `@originjs/vite-plugin-federation` releases a new version that fixes this issue, this workaround can be removed
- **Alternative Plugins**: Consider evaluating other Module Federation plugins that may not have this issue
- **Upstream Report**: This issue could be reported to the @originjs project for permanent fixes in future versions

## References

- Project: `scp-form-mfe` (React Microfrontend)
- Federation Plugin: `@originjs/vite-plugin-federation@1.4.1`
- Base Path: `/scp-mfe/` (for GitHub Pages deployment)
- Generated Entry Point: `dist/assets/remoteEntry.js`
