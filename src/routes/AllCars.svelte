<script>
    import SmallCar from "../components/SmallCar.svelte";
    import FilterElement from "../components/FilterElement.svelte";

    let marks = [];
    let models = [];
    let prices = [];
    let classes = [];
    let phrase = "";

    async function getItems() {
        const URL = "./backend/GetAllCar.php";
        let res = await fetch(URL);
        res = await res.json();
        return res;
    }

    let items = getItems();

    $: filtered = items.then((r) =>
        r.filter((item) => {
            if (!marks.includes(item.mark)) {
                marks.push(item.mark);
            }

            if (!models.includes(item.model)) {
                models.push(item.model);
            }

            if (!prices.includes(item.price)) {
                prices.push(item.price);
            }

            if (!classes.includes(item.vehicle_class)) {
                classes.push(item.vehicle_class);
            }

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
                    <div class="flex flex-wrap -m-4">
                        {#await filtered}
                            loading...
                        {:then response}
                            <table
                                class="table-auto w-full text-left whitespace-no-wrap"
                            >
                                <tbody>
                                    <tr>
                                        <td class="px-4 py-3 w-1/4">
                                            <FilterElement
                                                name="Marki"
                                                bind:value={phrase}
                                                data={marks}
                                            />
                                        </td>
                                        <td class="px-4 py-3 w-1/4">
                                            <FilterElement
                                                name="Modele"
                                                bind:value={phrase}
                                                data={models}
                                            />
                                        </td>

                                        <td class="px-4 py-3 w-1/4">
                                            <FilterElement
                                                name="Ceny"
                                                bind:value={phrase}
                                                data={prices}
                                            />
                                        </td>

                                        <td class="px-4 py-3 w-1/4">
                                            <FilterElement
                                                name="Klasy pojazdów"
                                                bind:value={phrase}
                                                data={classes}
                                            />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
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
