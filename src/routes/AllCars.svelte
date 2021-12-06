<script>
    import SmallCar from "../components/SmallCar.svelte";

    async function getItems() {
        const URL = "./backend/GetAll.php";
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
    <div class="container px-5 py-24 mx-auto">
        <div class="flex flex-col text-center w-full mb-20">
            <h1
                class="sm:text-4xl text-3xl font-medium title-font mb-2 text-gray-900"
            >
                Dane z PHP
            </h1>
            <p class="lg:w-2/3 mx-auto leading-relaxed text-base">
                Strona wyświetla dane pobrane z api PHP
            </p>
            <br /> <br />
            <p class="lg:w-2/3 mx-auto leading-relaxed text-base">
                <input type="text" bind:value={phrase} />
            </p>
            <section class="text-gray-600 body-font">
                <div class="container px-5 py-24 mx-auto">
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
