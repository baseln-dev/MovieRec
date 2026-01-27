<script lang="ts">
	import { enhance } from "$app/forms";

	import type { ActionData } from "./$types";

	export let form: ActionData;

	let showPassword = false;

	function togglePassword() {
		showPassword = !showPassword;
	}
</script>

<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-4">
	<div class="w-full max-w-md">
		<div class="bg-slate-800/50 backdrop-blur-md rounded-lg shadow-2xl p-8 border border-slate-700">
			<h1 class="text-3xl font-bold text-white mb-2 text-center">New Password</h1>
			<p class="text-slate-400 text-sm text-center mb-8">Enter your new password (8+ characters)</p>
			
			<form method="post" use:enhance class="space-y-6">
				<div>
					<label for="form-reset.password" class="block text-sm font-medium text-slate-300 mb-2">Password</label>
					<div class="relative">
						<input
							type={showPassword ? "text" : "password"}
							id="form-reset.password"
							name="password"
							autocomplete="new-password"
							required
							class="w-full px-4 py-2 pr-12 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
						/>
						<button
							type="button"
							class="absolute inset-y-0 right-0 px-3 text-slate-400 hover:text-white focus:outline-none"
							on:click={togglePassword}
							aria-label={showPassword ? "Hide password" : "Show password"}
						>
							{showPassword ? "Hide" : "Show"}
						</button>
					</div>
				</div>

				{#if form?.message}
					<div class="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
						{form.message}
					</div>
				{/if}

				<button type="submit" class="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-800">
					Reset Password
				</button>
			</form>
		</div>
	</div>
</div>
