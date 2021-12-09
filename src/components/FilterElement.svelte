<script>
    export let name, value, data;
</script>

<div class="flex flex-row align-middle justify-center">
    <label for={name} class="w-1/4 ml-1">{name}</label>
    <select
        {name}
        id={name}
        bind:value
        class="w-3/4 h-8 self-center bg-white rounded border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 text-base outline-none text-gray-700 py-1 leading-8 transition-colors duration-200 ease-in-out"
    >
        <option value="" />
        {#each data as item}
            <option value={item}>{item}</option>
        {/each}
    </select>
</div>
