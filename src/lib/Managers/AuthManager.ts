import { createClient, type Provider } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from "$env/static/public";
import { toast } from "svelte-sonner";
import { browser } from '$app/environment';
// import { SendEmailWhenUserIsCreated } from './EmailManager';

// Create a function to initialize the Supabase client
function createSupabaseClient() {
  // Only initialize the client if we're in the browser
  if (browser) {
    return createClient(
      PUBLIC_SUPABASE_URL.trim(),
      PUBLIC_SUPABASE_ANON_KEY.replace(/[\r\n]+/g, '').trim()
    );
  }
  // Return null or a mock client for server-side
  return null;
}

// Initialize the Supabase client
let supabase = createSupabaseClient();

// Reinitialize the client when the module is loaded in the browser
if (browser && !supabase) {
  supabase = createSupabaseClient();
}

async function getUserId(): Promise<string> {
  // Check if we're in the browser and have a Supabase client
  if (!browser || !supabase) {
    console.warn("Supabase client not available");
    return "";
  }
  
  try {
    const { data: { user } } = await supabase.auth.getUser();
    return user?.id || "";
  } catch (error) {
    console.error("Error getting user ID:", error);
    return "";
  }
}

async function isLoggedIn(): Promise<boolean> {
  // Check if we're in the browser and have a Supabase client
  if (!browser || !supabase) {
    return false;
  }
  
  try {
    const { data: { user } } = await supabase.auth.getUser();
    return user !== null && user !== undefined;
  } catch (error) {
    console.error("Error checking login status:", error);
    return false;
  }
}

async function signUp(email: string, password: string, isPremium: boolean = false): Promise<boolean> {
  // Check if we're in the browser and have a Supabase client
  if (!browser || !supabase) {
    toast.error("Authentication not available");
    return false;
  }
  
  let params = {};
  if (isPremium) {
    params = {
      credits: 500,
      subscription_expiration_date: Date.now().toString(),
    };
  } else {
    params = {
      credits: 5,
    };
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        "data": params
      },
    });

    if (error) {
      toast.error(error.message);
      return false;
    }
    
    toast.success("Account created successfully!");
    return true;
  } catch (error) {
    console.error("Error during signup:", error);
    toast.error("An error occurred during signup");
    return false;
  }
};

async function signInWithPassword(email: string, password: string): Promise<boolean> {
  // Check if we're in the browser and have a Supabase client
  if (!browser || !supabase) {
    toast.error("Authentication not available");
    return false;
  }
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email: email, password: password });
    if (!error) {
      toast.success("Login successful");
      return true;
    } else {
      toast.error(error.message);
      return false;
    }
  } catch (error) {
    console.error("Error during login:", error);
    toast.error("An error occurred during login");
    return false;
  }
}

async function signInWithOAuth(provider: Provider = "google") {
  // Check if we're in the browser and have a Supabase client
  if (!browser || !supabase) {
    toast.error("Authentication not available");
    return;
  }
  
  try {
    console.log(`Started login with provider: ${provider}`);
    const { data, error } = await supabase.auth.signInWithOAuth({ provider: provider });
    
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Login successful");
    }
  } catch (error) {
    console.error("Error during OAuth login:", error);
    toast.error("An error occurred during login");
  }
}

async function resetPasswordForEmail(email: string) {
  // Check if we're in the browser and have a Supabase client
  if (!browser || !supabase) {
    toast.error("Authentication not available");
    return;
  }
  
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    
    if (error) {
      toast.error(error.message);
    } else {
      toast.info("Check your email to reset your password.");
    }
  } catch (error) {
    console.error("Error resetting password:", error);
    toast.error("An error occurred while resetting password");
  }
}

async function signOut() {
  // Check if we're in the browser and have a Supabase client
  if (!browser || !supabase) {
    return;
  }
  
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      toast.error(error.message);
    } else {
      toast.info("You have been signed out");
    }
  } catch (error) {
    console.error("Error during sign out:", error);
    toast.error("An error occurred during sign out");
  }
}

export {
  signUp,
  signInWithPassword,
  signInWithOAuth,
  signOut,
  resetPasswordForEmail,
  isLoggedIn,
  getUserId,
  supabase
};