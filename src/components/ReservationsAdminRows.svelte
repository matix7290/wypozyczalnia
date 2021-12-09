<script>
    export let name, data, callback;
</script>

{#if name === "Zaakceptowane" || name === "Po terminie"}
    <tr>
        <th
            colspan="8"
            class="text-center px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100"
            >{name}</th
        >
    </tr>
{/if}

{#each data as item}
    <tr>
        <td class="px-4 py-3">
            {item.username}
        </td>
        <td class="px-4 py-3">
            {item.mark}
        </td>
        <td class="px-4 py-3">
            {item.model}
        </td>
        <td class="px-4 py-3">
            {item.start_date}
        </td>
        <td class="px-4 py-3">
            {item.finish_date}
        </td>
        <td class="px-4 py-3">
            {item.status_name}
        </td>
        {#if name === "Oczekujące"}
            <td class="px-4 py-3">
                <button
                    style="border: none;"
                    on:click={() => {
                        callback.edit(item.id);
                    }}
                >
                    Edytuj
                </button>
            </td>
            <td class="px-4 py-3">
                <button
                    style="border: none;"
                    on:click={() => {
                        callback.accept(item.id, item.car_id);
                    }}
                >
                    Zatwierdź
                </button>
            </td>
            <td class="px-4 py-3">
                <button
                    style="border: none;"
                    on:click={() => {
                        callback.giveBack(item.id);
                    }}
                >
                    Anuluj
                </button>
            </td>
        {:else if name !== "Archiwalne"}
            <td class="px-4 py-3">
                <button
                    style="border: none;"
                    on:click={() => {
                        callback.edit(item.id);
                    }}
                >
                    Edytuj
                </button>
            </td>
            <td class="px-4 py-3">
                <button
                    style="border: none;"
                    on:click={() => {
                        callback.giveBack(item.id);
                    }}
                >
                    Zwróć
                </button>
            </td>
        {/if}
    </tr>
{/each}

{#if name === "Zaakceptowane" || name === "Po terminie"}
    <tr>
        <th
            colspan="8"
            class="text-center px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm"
        />
    </tr>
{/if}
