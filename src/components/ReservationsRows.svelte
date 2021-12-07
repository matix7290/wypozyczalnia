<script>
    export let data, name, user, giveBack;
</script>

<tr>
    <th
        colspan="7"
        class="text-center px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100"
        >{name}</th
    >
</tr>
{#each data as item}
    <tr>
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
        {#if name == "Oczekujące"}
            <td class="px-4 py-3">
                <button
                    style="border: none;"
                    on:click={() => {
                        giveBack(item.id);
                    }}
                >
                    Anuluj
                </button>
            </td>
            <td class="px-4 py-3" />
        {:else if name == "Archiwalne"}
            <td colspan="2" class="px-4 py-3" />
        {:else}
            <td class="px-4 py-3">
                <button
                    class="ml-1"
                    style="border: none;"
                    on:click={() => {
                        giveBack(item.id);
                    }}
                >
                    Zwróć
                </button>
            </td>
            <td class="px-4 py-3">
                <a
                    style="color: rgba(75, 85, 99, 1)"
                    href="../public/assets/img/codes/qr{item.qr_code_number}.svg"
                    download="{user.firstname}_{user.lastname}_{Date.now()}.svg"
                >
                    <button style="border: none;"> Pobierz kod </button>
                </a>
            </td>
        {/if}
    </tr>
{/each}
<tr>
    <th
        colspan="7"
        class="text-center px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm"
    />
</tr>
