import "react-native-url-polyfill/auto";

import { createClient } from "@supabase/supabase-js";
import { armazenamento } from "./armazenamento";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "Configure a URL e a chave pública do Supabase no arquivo .env."
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: armazenamento,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});