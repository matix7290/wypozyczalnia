<script>
    import checkLog from "../../scripts/checkLog";
    import SmallCar from "../components/SmallCar.svelte";

    async function getItems() {
        const URL = "./backend/Display.php";
        let res = await fetch(URL);
        res = await res.json();
        return res;
    }

    async function deleteItem(id) {
        const URL = "./backend/DeleteItem.php";
        let data = new FormData();
        data.append("id", id);

        let res = await fetch(URL, {
            method: "POST",
            mode: "no-cors",
            body: data,
        });

        res = await res.json();
        location.reload();
    }

    async function updateItem(item) {
        let URL = "./backend/UpddateItem.php";
        let data = new FormData();
        data.append("id", item.id);
        data.append("mark", item.mark);
        data.append("model", item.model);
        data.append("transmission", item.transmission);
        data.append("as", item.as);
        data.append("number_of_seats", item.number_of_seats);
        data.append("afc", item.afc);
        data.append("boot_capacity", item.boot_capacity);
        data.append("number_of_doors", item.number_of_doors);

        // let res = await fetch(URL, {
        //     method: "POST",
        //     mode: "no-cors",
        //     body: data,
        // });

        // res = await res.json();
        // location.reload();

        console.log(data.values());
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
            <div class="lg:w-2/3 w-full mx-auto overflow-auto">
                <table class="table-auto w-full text-left whitespace-no-wrap">
                    <thead>
                        <tr>
                            <th
                                class="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100 rounded-tl rounded-bl"
                                >Lp.</th
                            >
                            <th
                                class="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100"
                                >Marka samochodu</th
                            >
                            <th
                                class="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100"
                                >Model samochodu</th
                            >
                            <th
                                class="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100"
                                >Skrzynia biegów [automatyczna/manualna]</th
                            >
                            <th
                                class="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100"
                                >Klimatyzacja [automatyczna/manualna]</th
                            >
                            <th
                                class="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100"
                                >Spalanie</th
                            >
                            <th
                                class="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100"
                                >Pojemność bagażnika</th
                            >
                            <th
                                class="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100"
                                >Liczba drzwi</th
                            >
                            <th
                                class="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100"
                                >Liczba siedzeń</th
                            >
                            <th
                                class="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100"
                                >Klasa pojazdu</th
                            >
                            <th
                                class="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100"
                                >Cena</th
                            >
                            <th
                                class="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100"
                                >Status</th
                            >
                            <th
                                class="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100"
                            />
                        </tr>
                    </thead>
                    <tbody>
                        {#await filtered}
                            loading...
                        {:then response}
                            {#each response as item, i}
                                <tr>
                                    <td class="px-4 py-3">{i + 1}</td>
                                    <td
                                        class="px-4 py-3"
                                        contenteditable
                                        bind:innerHTML={item.mark}
                                    >
                                        {item.mark}
                                    </td>
                                    <td
                                        class="px-4 py-3"
                                        contenteditable
                                        bind:innerHTML={item.model}
                                    >
                                        {item.model}
                                    </td>
                                    <td
                                        class="px-4 py-3"
                                        contenteditable
                                        bind:innerHTML={item.transmission}
                                    >
                                        {item.transmission}
                                    </td>
                                    <td
                                        class="px-4 py-3"
                                        contenteditable
                                        bind:innerHTML={item.ac}
                                    >
                                        {item.ac}
                                    </td>
                                    <td
                                        class="px-4 py-3"
                                        contenteditable
                                        bind:innerHTML={item.afc}
                                    >
                                        {item.afc + "l/km"}
                                    </td>
                                    <td
                                        class="px-4 py-3"
                                        contenteditable
                                        bind:innerHTML={item.boot_capacity}
                                    >
                                        {item.boot_capacity + "l"}
                                    </td>
                                    <td
                                        class="px-4 py-3"
                                        contenteditable
                                        bind:innerHTML={item.number_of_doors}
                                    >
                                        {item.number_of_doors}
                                    </td>
                                    <td
                                        class="px-4 py-3"
                                        contenteditable
                                        bind:innerHTML={item.number_of_seats}
                                    >
                                        {item.number_of_seats}
                                    </td>
                                    <td
                                        class="px-4 py-3"
                                        contenteditable
                                        bind:innerHTML={item.vehicle_class}
                                    >
                                        {item.vehicle_class}
                                    </td>
                                    <td
                                        class="px-4 py-3"
                                        contenteditable
                                        bind:innerHTML={item.price}
                                    >
                                        {item.price}
                                    </td>
                                    <td
                                        class="px-4 py-3"
                                        contenteditable
                                        bind:innerHTML={item.status_name}
                                    >
                                        {item.status_name}
                                    </td>
                                    <td class="px-4 py-3">
                                        <button
                                            style="border: none;"
                                            on:click={() => {
                                                updateItem(item);
                                            }}
                                        >
                                            Rezerwój
                                        </button>
                                    </td>
                                </tr>
                            {/each}
                        {/await}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</section>
