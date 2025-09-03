# Environment Variables for Production

Make sure these environment variables are set in your production deployment:

## Required Supabase Variables

```
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_supabase_anon_key
```

## Production Deployment Checklist

### Supabase Configuration

1. ✅ Ensure Realtime is enabled in your Supabase project
2. ✅ Check that your production domain is added to the allowed origins
3. ✅ Verify RLS policies are configured correctly for your tables
4. ✅ Confirm WebSocket connections are allowed through your hosting provider

### Environment Variables

1. ✅ Set NEXT_PUBLIC_SUPABASE_URL in your deployment platform
2. ✅ Set NEXT_PUBLIC_SUPABASE_ANON_KEY in your deployment platform
3. ✅ Ensure variables are accessible to the client-side code

### Realtime Chat Features Added

- ✅ Automatic reconnection with exponential backoff
- ✅ Connection status indicator (Connected/Disconnected)
- ✅ Better error handling and logging
- ✅ Improved WebSocket configuration
- ✅ Message sending error recovery
- ✅ CORS headers for better network compatibility

### Debugging Tips

- Check browser developer console for WebSocket connection errors
- Monitor Supabase Realtime logs in the dashboard
- Verify network policies don't block WebSocket connections
- Ensure authentication is working properly before testing chat
