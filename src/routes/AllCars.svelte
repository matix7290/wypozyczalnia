<script>
    import SmallCar from "../components/SmallCar.svelte";

    async function getItems() {
        const URL = "./backend/GetAllCar.php";
        let res = await fetch(URL);
        res = await res.json();
        return res;
    }

    let items = getItems();

    let phrase = "";

    $: filtered = items.then((r) =>
        r.filter((item) => {
            return [item.mark, item.model, item.price, item.vehicle_class].some(
                (element) =>
                    element
                        .toString()
                        .toLowerCase()
                        .includes(phrase.toString().toLowerCase())
            );
        })
    );
</script>

<section class="text-gray-600 body-font">
    <div class="container px-5 pt-12 pb-24 mx-auto">
        <div class="flex flex-col text-center w-full mb-20">
            <h1
                class="sm:text-4xl text-3xl font-medium title-font mb-2 text-gray-900"
            >
                Nasze pojazdy
            </h1>
            <p class="lg:w-2/3 mx-auto leading-relaxed text-base">
                Odjedź swoim wymażonym autem...
            </p>
            <section class="text-gray-600 body-font">
                <div class="container px-5 pt-12 mx-auto flex flex-col">
                    <p
                        class="lg:w-full w-full h-2/3 mb-10 leading-relaxed text-base"
                    >
                        <input
                            class="rounded ml-2 w-full h-8 text-center"
                            name="filtr"
                            type="text"
                            placeholder="Wyszukaj"
                            bind:value={phrase}
                        />
                    </p>
                    <div class="flex flex-wrap -m-4">
                        {#await filtered}
                            loading...
                        {:then response}
                            {#each response as item}
                                <SmallCar
                                    name={item.mark + " " + item.model}
                                    link={"./#/car/" + item.id}
                                    price={item.price}
                                    vehicle_class={item.vehicle_class}
                                />
                            {/each}
                        {/await}
                    </div>
                </div>
            </section>
        </div>
    </div>
</section>
