<script lang="ts">
    import { type AccessInfo, getAccess } from "$lib/api/auth";
    import { client } from "$lib/api/client";
    import { card } from "@pacuare/design";
    import { onMount } from "svelte";

    let access = $state<AccessInfo>();
    let turtles = $state<[string, number][]>();
    let selectedTurtle = $state<number>();
    let turtle = $derived(() =>
        turtles && selectedTurtle ? turtles[selectedTurtle] : null,
    );

    onMount(async () => {
        try {
            access = await getAccess();
        } catch (_) {
            location.assign(
                import.meta.env.VITE_PUBLIC_LOGIN_URL ??
                    `https://app.pacuare.dev/login?return=${encodeURIComponent("https://turtles.pacuare.dev")}`,
            );
        }

        turtles = (
            await client.query(
                "select turtle_id, turtle_occurrences from unique_turtles order by turtle_occurrences::int desc",
                [],
            )
        ).values as [string, number][];
    });
</script>

<main class="w-screen h-screen flex flex-row p-3 gap-3">
    {#if access}
        <div {...card.root("overflow-auto max-w-full")}>
            <h2 {...card.title()}>Turtles</h2>
            {#each turtles ?? [] as turtle, i}
                <button
                    class="flex flex-row justify-between p-2"
                    onclick={() => (selectedTurtle = i)}
                >
                    <p>{turtle[0]}</p>
                    <p class="text-gray-700">{turtle[1]}</p>
                </button>
            {/each}
        </div>
        <div class="flex flex-col flex-1">
            {#if turtle()}
                <h1 class="text-xl">{turtle()![0]}</h1>
                <p class="text-gray-700">
                    {turtle()![1]} occurrences
                </p>
            {/if}
        </div>
    {/if}
</main>
