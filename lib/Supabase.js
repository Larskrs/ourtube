import { createClient } from '@supabase/supabase-js'



const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
)
function getSessionClient(session) {
    
    const { supabaseAccessToken } = session
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
            global: {
              headers: {
                Authorization: `Bearer ${supabaseAccessToken}`,
              },
            },
          }
    )

}


export default supabase;






