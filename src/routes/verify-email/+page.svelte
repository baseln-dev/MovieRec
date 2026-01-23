<script lang="ts">
	import { enhance } from "$app/forms";

	import type { ActionData, PageData } from "./$types";

	export let data: PageData;
	export let form: ActionData;
</script>

<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-4">
	<div class="w-full max-w-md">
		<div class="bg-slate-800/50 backdrop-blur-md rounded-lg shadow-2xl p-8 border border-slate-700">
			<h1 class="text-3xl font-bold text-white mb-2 text-center">Verify Email</h1>
			<p class="text-slate-400 text-sm text-center mb-8">We sent an 8-digit code to {data.email}</p>
			
			<form method="post" use:enhance action="?/verify" class="space-y-6">
				<div>
					<label for="form-verify.code" class="block text-sm font-medium text-slate-300 mb-2">Verification Code</label>
					<input id="form-verify.code" name="code" required placeholder="00000000" class="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-center text-lg tracking-widest" />
				</div>

				{#if form?.verify?.message}
					<div class="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
						{form.verify.message}
					</div>
				{/if}

				<button type="submit" class="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-800">
					Verify
				</button>
			</form>

			<form method="post" use:enhance action="?/resend" class="mt-4">
				{#if form?.resend?.message}
					<div class="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm mb-4">
						{form.resend.message}
					</div>
				{/if}
				<button type="submit" class="w-full py-2 px-4 bg-slate-700/50 hover:bg-slate-600/50 text-purple-400 font-medium rounded-lg transition border border-slate-600 hover:border-purple-500">
					Resend Code
				</button>
			</form>

			<div class="mt-8 pt-8 border-t border-slate-700 text-center">
				<a href="/settings" class="text-purple-400 hover:text-purple-300 text-sm transition">
					Change your email
				</a>
			</div>
		</div>
	</div>
</div>
