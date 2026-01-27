<script lang="ts">
	import { enhance } from "$app/forms";

	import type { PageData, ActionData } from "./$types";

	export let data: PageData;
	export let form: ActionData;

	let showCurrent = false;
	let showNew = false;
</script>

<div class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
	<main class="max-w-4xl mx-auto px-4 py-8">
		<h1 class="text-4xl font-bold text-white mb-8">Settings</h1>

		<!-- Update Email Section -->
		<section class="bg-slate-800/50 backdrop-blur-md rounded-lg border border-slate-700 p-8 mb-6">
			<h2 class="text-2xl font-bold text-white mb-4">Update Email</h2>
			<p class="text-slate-400 mb-6">Current email: <span class="text-slate-200 font-medium">{data.user.email}</span></p>
			
			<form method="post" use:enhance action="?/email" class="space-y-4">
				<div>
					<label for="form-email.email" class="block text-sm font-medium text-slate-300 mb-2">New Email</label>
					<input 
						type="email" 
						id="form-email.email" 
						name="email" 
						required 
						class="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
					/>
				</div>
				<button type="submit" class="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition duration-200 transform hover:scale-105">
					Update Email
				</button>
				{#if form?.email?.message}
					<div class="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
						{form.email.message}
					</div>
				{/if}
			</form>
		</section>

		<!-- Update Password Section -->
		<section class="bg-slate-800/50 backdrop-blur-md rounded-lg border border-slate-700 p-8 mb-6">
			<h2 class="text-2xl font-bold text-white mb-6">Update Password</h2>
			
			<form method="post" use:enhance action="?/password" class="space-y-4">
				<div>
					<label for="form-password.password" class="block text-sm font-medium text-slate-300 mb-2">Current Password</label>
					<div class="relative">
						<input 
							type={showCurrent ? "text" : "password"} 
							id="form-password.password" 
							name="password" 
							autocomplete="current-password" 
							required 
							class="w-full px-4 py-2 pr-12 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
						/>
						<button 
							type="button" 
							class="absolute inset-y-0 right-0 px-3 text-slate-400 hover:text-white focus:outline-none"
							on:click={() => (showCurrent = !showCurrent)}
							aria-label={showCurrent ? "Hide password" : "Show password"}
						>
							{showCurrent ? "Hide" : "Show"}
						</button>
					</div>
				</div>

				<div>
					<label for="form-password.new-password" class="block text-sm font-medium text-slate-300 mb-2">New Password</label>
					<div class="relative">
						<input
							type={showNew ? "text" : "password"}
							id="form-password.new-password"
							name="new_password"
							autocomplete="new-password"
							required
							class="w-full px-4 py-2 pr-12 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
						/>
						<button 
							type="button" 
							class="absolute inset-y-0 right-0 px-3 text-slate-400 hover:text-white focus:outline-none"
							on:click={() => (showNew = !showNew)}
							aria-label={showNew ? "Hide password" : "Show password"}
						>
							{showNew ? "Hide" : "Show"}
						</button>
					</div>
				</div>

				<button type="submit" class="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition duration-200 transform hover:scale-105">
					Update Password
				</button>
				{#if form?.password?.message}
					<div class="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
						{form.password.message}
					</div>
				{/if}
			</form>
		</section>

		<!-- Two-Factor Authentication Section -->
		{#if data.user.registered2FA}
			<section class="bg-slate-800/50 backdrop-blur-md rounded-lg border border-slate-700 p-8 mb-6">
				<h2 class="text-2xl font-bold text-white mb-4">Two-Factor Authentication</h2>
				<p class="text-slate-400 mb-6">Two-factor authentication is currently enabled</p>
				<a href="/2fa/setup" class="inline-block py-2 px-6 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition duration-200 transform hover:scale-105">
					Update 2FA Settings
				</a>
			</section>
		{/if}

		<!-- Recovery Code Section -->
		{#if data.recoveryCode !== null}
			<section class="bg-slate-800/50 backdrop-blur-md rounded-lg border border-slate-700 p-8 mb-6">
				<h2 class="text-2xl font-bold text-white mb-4">Recovery Code</h2>
				<p class="text-slate-400 mb-4">Save this code in a safe place. You can use it to regain access if you lose your authenticator.</p>
				<div class="bg-slate-900 border border-slate-600 rounded-lg p-4 mb-6 font-mono text-lg text-green-400 text-center">
					{data.recoveryCode}
				</div>
				<form method="post" action="?/generateRecoveryCode" use:enhance>
					<button type="submit" class="w-full py-2 px-4 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition duration-200">
						Generate New Code
					</button>
				</form>
			</section>
		{/if}
	</main>
</div>
