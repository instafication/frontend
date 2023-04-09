import { trpc } from '$lib/trpc/client';
import { getUserId } from './AuthManager';
import { page } from '$app/stores';

async function parseUserDataById(id: string): Promise<{ email: string, phone: string, credits: number }> {
  // const userId = await getUserId();    
  // const email = await trpc.email.query(userId);
  // const phone = await trpc.phone.query(userId);
  // const credits = await trpc.credits.query(userId);
  return { email: "", phone: "", credits: 0 };
    // return { email, phone, credits };
}


async function updateProfileById(id: string, email: string, phone: string): Promise<void> {
  await trpc.updateprofileById.query({
      id: id,
      email: email,
      phone: phone
  });
  console.log("Profile updated successfully!");
}

export { updateProfileById, parseUserDataById }