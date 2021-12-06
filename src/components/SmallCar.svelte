<script>
    export let name, link, price, vehicle_class;
</script>

<div class="lg:w-1/4 md:w-1/2 p-4 w-full">
    <a href={link} class="block relative h-48 rounded overflow-hidden">
        <img
            alt="ecommerce"
            class="object-cover object-center w-full h-full block"
            src="https://dummyimage.com/428x268"
        />
    </a>
    <div class="mt-4">
        <h3 class="text-gray-500 text-xs tracking-widest title-font mb-1">
            {vehicle_class}
        </h3>
        <h2 class="text-gray-900 title-font text-lg font-medium">
            {name}
        </h2>
        <p class="mt-1">{price} zł/dzień</p>
    </div>
</div>
