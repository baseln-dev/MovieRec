<script lang="ts">
	import { enhance } from "$app/forms";

	import type { ActionData } from "./$types";

	export let form: ActionData;
</script>

<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-4">
	<div class="w-full max-w-md">
		<div class="bg-slate-800/50 backdrop-blur-md rounded-lg shadow-2xl p-8 border border-slate-700">
			<h1 class="text-3xl font-bold text-white mb-2 text-center">Two-Factor Auth</h1>
			<p class="text-slate-400 text-sm text-center mb-8">Enter the code from your authenticator app</p>
			
			<form method="post" use:enhance class="space-y-6">
				<div>
					<label for="form-totp.code" class="block text-sm font-medium text-slate-300 mb-2">Authenticator Code</label>
					<input id="form-totp.code" name="code" autocomplete="one-time-code" required placeholder="000000" class="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-center text-lg tracking-widest" />
				</div>

				{#if form?.message}
					<div class="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
						{form.message}
					</div>
				{/if}

				<button type="submit" class="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-800">
					Verify
				</button>
			</form>

			<div class="mt-8 pt-8 border-t border-slate-700 text-center">
				<a href="/2fa/reset" class="text-purple-400 hover:text-purple-300 text-sm transition">
					Use recovery code instead
				</a>
			</div>
		</div>
	</div>
</div>
