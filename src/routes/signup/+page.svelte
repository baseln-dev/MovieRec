<script lang="ts">
	import { enhance } from "$app/forms";

	import type { ActionData } from "./$types";

	export let form: ActionData;
</script>

<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-4">
	<div class="w-full max-w-md">
		<div class="bg-slate-800/50 backdrop-blur-md rounded-lg shadow-2xl p-8 border border-slate-700">
			<h1 class="text-3xl font-bold text-white mb-2 text-center">Create Account</h1>
			<p class="text-slate-400 text-sm text-center mb-8">Username 3+ chars, password 8+ chars</p>
			
			<form method="post" use:enhance class="space-y-6">
				<div>
					<label for="form-signup.username" class="block text-sm font-medium text-slate-300 mb-2">Username</label>
					<input
						id="form-signup.username"
						name="username"
						required
						value={form?.username ?? ""}
						minlength="4"
						maxlength="31"
						class="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
					/>
				</div>

				<div>
					<label for="form-signup.email" class="block text-sm font-medium text-slate-300 mb-2">Email</label>
					<input
						type="email"
						id="form-signup.email"
						name="email"
						autocomplete="username"
						required
						value={form?.email ?? ""}
						class="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
					/>
				</div>

				<div>
					<label for="form-signup.password" class="block text-sm font-medium text-slate-300 mb-2">Password</label>
					<input type="password" id="form-signup.password" name="password" autocomplete="new-password" required class="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition" />
				</div>

				{#if form?.message}
					<div class="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
						{form.message}
					</div>
				{/if}

				<button type="submit" class="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-800">
					Continue
				</button>
			</form>

			<div class="mt-8 pt-8 border-t border-slate-700 space-y-3">
				<p class="text-center text-slate-400 text-sm">Already have an account?</p>
				<a href="/login" class="block text-center py-2 px-4 bg-slate-700/50 hover:bg-slate-600/50 text-purple-400 font-medium rounded-lg transition border border-slate-600 hover:border-purple-500">
					Sign in
				</a>
			</div>
		</div>
	</div>
</div>
