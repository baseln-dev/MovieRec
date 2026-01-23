<script lang="ts">
	import type { PageData } from "./$types";

	export let data: PageData;
</script>

<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-4">
	<div class="w-full max-w-md">
		<div class="bg-slate-800/50 backdrop-blur-md rounded-lg shadow-2xl p-8 border border-slate-700">
			<h1 class="text-3xl font-bold text-white mb-8 text-center">Recovery Code</h1>
			
			<div class="bg-slate-900/50 border border-purple-500/30 rounded-lg p-6 mb-6">
				<p class="text-slate-400 text-sm mb-3">Your recovery code:</p>
				<code class="block text-white text-xl font-mono text-center py-4 bg-slate-800 rounded border border-slate-700">{data.recoveryCode}</code>
			</div>

			<div class="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 mb-8">
				<p class="text-amber-300 text-sm">
					<span class="font-semibold">Important:</span> Save this code in a secure location. You can use it if you lose access to your authenticator app.
				</p>
			</div>

			<a href="/" class="block w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition duration-200 transform hover:scale-105 text-center">
				Next
			</a>
		</div>
	</div>
</div>
