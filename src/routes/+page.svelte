<script lang="ts">
    import { type AccessInfo, getAccess } from "$lib/api/auth";
    import { client } from "$lib/api/client";
    import { onMount } from "svelte";

    let access = $state<AccessInfo>();

    onMount(async () => {
        try {
            access = await getAccess();
        } catch (_) {
            const email = prompt("Email?")!;
            if (!email) location.reload();
            await client.call(
                `/auth/verify?email=${encodeURIComponent(email)}`,
            );
            const code = prompt(
                "Please enter the six-digit code sent to your email.",
                "",
            )!;
            await client.call(
                `/auth/verify?email=${encodeURIComponent(email)}`,
                {
                    method: "POST",
                    body: (() => {
                        const f = new FormData();
                        f.append("code", code);
                        return f;
                    })(),
                },
            );
            location.reload()
        }
    });
</script>

<main class="w-full h-full flex flex-row">
    {#if access}
        Hello, {access.email}!
    {/if}
</main>
