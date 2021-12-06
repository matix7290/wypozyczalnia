<script>
    export let name, value, placeholder, desc, blur;
</script>

<div class="relative mb-4">
    <label for={name} class="leading-7 text-sm text-gray-600">{desc}</label>
    <input
        type="email"
        id={name}
        {name}
        {placeholder}
        bind:value
        on:blur={blur()}
        class="w-full bg-white rounded border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
    />
    <p id={name + "_p"} class="text-xs mt-3 text-red-600" />
</div>
