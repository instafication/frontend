<script lang="ts">
  import authClient from '$lib/authClient';
  import { onMount } from 'svelte';

  let newPassword: string = '';
  let isLoading: boolean = false;
  let token: string | null = null;

  onMount(() => {
    const params = new URLSearchParams(location.search);
    token = params.get('token');
  });

  async function handleSubmit(e: Event) {
    e.preventDefault();
    if (!token) {
      alert('Ogiltig återställningslänk');
      return;
    }
    isLoading = true;
    try {
      await (authClient as any).resetPassword?.({ newPassword, token });
      alert('Lösenordet är ändrat. Logga in igen.');
      location.assign('/');
    } catch (err) {
      console.error('Reset password error', err);
      alert('Kunde inte återställa lösenordet');
    } finally {
      isLoading = false;
    }
  }
</script>

<section style="width:100%;min-height:60vh;display:flex;align-items:center;justify-content:center;padding:1rem;">
  <form style="width:100%;max-width:24rem;display:flex;flex-direction:column;gap:1rem;" onsubmit={handleSubmit}>
    <label style="display:flex;flex-direction:column;gap:0.5rem;">
      <span>Nytt lösenord</span>
      <input type="password" bind:value={newPassword} name="password" placeholder="••••••" required />
    </label>
    <button type="submit" disabled={isLoading} style="width:100%;padding:0.75rem;border-radius:0.5rem;background:#1d4ed8;color:white;">
      {#if isLoading}
        Bearbetar...
      {:else}
        Återställ lösenord
      {/if}
    </button>
  </form>
  {#if !token}
    <p style="font-size:0.875rem;color:#6b7280;margin-top:1rem;">Ogiltig eller saknad token. Kontrollera länken i din e‑post.</p>
  {/if}
</section>


