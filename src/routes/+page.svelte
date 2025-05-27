<script lang="ts">
    import { type AccessInfo, getAccess } from "$lib/api/auth";
    import { client } from "$lib/api/client";
    import { card } from "@pacuare/design";
    import { onMount } from "svelte";

    let access = $state<AccessInfo>();
    let turtles = $state<string[]>();

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

        turtles = (await client.query('select turtle_id from unique_turtles', [])).values.map(v => v[0] as string)
    });
</script>

<main class="w-screen h-screen flex flex-row p-3 gap-3">
    {#if access}
        <div {...card.root('overflow-auto max-w-full')}>
            <h2 {...card.title()}>Turtles</h2>
            {#each turtles ?? [] as turtle}
                <p>{turtle}</p>
            {/each}
        </div>
    {/if}
</main>
