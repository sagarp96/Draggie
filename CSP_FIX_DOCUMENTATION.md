# Content Security Policy (CSP) Fix for Avatar Images

## Problem

The application was showing CSP violations when trying to load user avatar images from Google OAuth:

```
Refused to load the image 'https://lh3.googleusercontent.com/...' because it violates the following Content Security Policy directive: "img-src 'self' data: blob: https://*.supabase.co"
```

## Root Cause

- Google OAuth provides user avatars via `lh3.googleusercontent.com`
- The default CSP didn't include Google's image domains
- Avatar components were trying to load external images without proper CSP permissions

## Solution

Updated `next.config.ts` with comprehensive CSP headers:

### 1. Image Sources (`img-src`)

```typescript
"img-src 'self' data: blob: https://*.supabase.co https://*.googleusercontent.com https://lh3.googleusercontent.com";
```

### 2. Next.js Image Configuration

```typescript
images: {
  domains: [
    'lh3.googleusercontent.com',
    'googleusercontent.com',
  ],
  remotePatterns: [
    {
      protocol: 'https',
      hostname: '*.googleusercontent.com',
    },
    {
      protocol: 'https',
      hostname: '*.supabase.co',
    },
    {
      protocol: 'https',
      hostname: 'lh3.googleusercontent.com',
    },
  ],
}
```

### 3. Environment-Aware CSP

- Development: Allows `'unsafe-eval'` for hot reloading
- Production: More restrictive, removes `'unsafe-eval'`

## Components Affected

- `src/components/avatar-stack.tsx` - User avatar display
- `src/components/ui/avatar.tsx` - Base avatar component
- `src/hooks/use-current-user-image.ts` - User image fetching

## Benefits

✅ **Security**: Proper CSP prevents XSS attacks
✅ **Functionality**: User avatars load correctly from Google OAuth
✅ **Flexibility**: Supports both Supabase and Google image sources
✅ **Environment-Aware**: Different rules for dev vs production

## Testing

1. ✅ Build completes successfully
2. ✅ No CSP violations in browser console
3. ✅ User avatars load properly from Google OAuth
4. ✅ Supabase images continue to work

## Next Steps

- Monitor browser console for any remaining CSP violations
- Consider adding more specific image domains if needed
- Test with different OAuth providers if added in the future
