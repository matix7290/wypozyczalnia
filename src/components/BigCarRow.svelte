<script>
    export let name, value, suffix;
</script>

<div class="flex border-t border-gray-200 py-2">
    <span class="text-gray-500">{name}</span>
    <span class="ml-auto text-gray-900">{value + suffix}</span>
</div>
