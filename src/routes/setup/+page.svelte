<script lang="ts">
	import type { PageData } from "./$types";
	export let data: PageData;
</script>

<div class="min-h-screen flex items-center justify-center bg-slate-900 px-4">
	<div class="bg-slate-800 rounded-lg p-8 max-w-md w-full text-center">
		{#if data.error}
			<div class="text-red-400">
				<h1 class="text-2xl font-bold mb-4">Setup Failed</h1>
				<p class="text-sm">{data.error}</p>
			</div>
		{:else}
			<div class="text-green-400">
				<h1 class="text-2xl font-bold mb-4">✓ Success</h1>
				<p class="text-sm">{data.message}</p>
			</div>
		{/if}
	</div>
</div>
