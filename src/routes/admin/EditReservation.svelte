<script>
    import getSession from "../../../scripts/getSession";
    export let params;

    let logged = false;
    let start_date, finish_date;

    let getItem = async () => {
        const URL = "./backend/GetOneReservation.php";
        let data = new FormData();
        data.append("id", params.id);

        let res = await fetch(URL, {
            method: "POST",
            mode: "no-cors",
            body: data,
        });

        res = await res.json();

        start_date = res[0].start_date;
        finish_date = res[0].finish_date;

        if (res[0].status_name == "waiting") {
            res[0].status_name = "Oczekujące";
        } else if (res[0].status_name == "accepted") {
            res[0].status_name = "Zaakceptowane";
        } else {
            res[0].status_name = "Po terminie";
        }

        return res;
    };

    let init = async () => {
        let res = await getSession(["logged"]);

        logged = res.logged;

        if (!logged) {
            window.location.replace("./#/forbbidden");
        }
    };

    let cancel = () => window.location.replace("./#/admin");

    let save = async (id) => {
        if (
            start_date !== "" &&
            finish_date !== "" &&
            start_date < finish_date
        ) {
            const URL = "./backend/EditReservation.php";
            let data = new FormData();
            data.append("id", params.id);
            data.append("start_date", start_date);
            data.append("finish_date", finish_date);

            let res = await fetch(URL, {
                method: "POST",
                mode: "no-cors",
                body: data,
            });

            res = await res.json();

            window.location.replace("./#/admin");
        } else {
            document.getElementById("massage").innerText = "Popraw dane!";
        }
    };

    document.onload = init();
</script>

<section class="text-gray-600 body-font">
    {#if logged}
        <div class="container px-5 pt-12 pb-24 mx-auto">
            <div class="flex flex-col text-center w-full mb-20">
                <div class="lg:w-2/3 w-full mx-auto overflow-auto">
                    <table
                        class="table-auto w-full text-left whitespace-no-wrap"
                    >
                        <thead>
                            <tr>
                                <th
                                    class="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100"
                                    >Użytkownik</th
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
                                    >Data wynajęcia</th
                                >
                                <th
                                    class="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100"
                                    >Data oddania</th
                                >
                                <th
                                    class="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100"
                                    >Status</th
                                >
                                <th
                                    colspan="2"
                                    class="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100"
                                />
                            </tr>
                        </thead>
                        <tbody>
                            {#await getItem()}
                                loading...
                            {:then response}
                                {#each response as item}
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
                                            <input
                                                type="date"
                                                bind:value={start_date}
                                                name="start_date"
                                                id="start_date"
                                                class="w-32 flex bg-white rounded border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 text-base outline-none text-gray-700 py-1 leading-8 transition-colors duration-200 ease-in-out text-center"
                                            />
                                        </td>
                                        <td class="px-4 py-3">
                                            <input
                                                type="date"
                                                bind:value={finish_date}
                                                name="finish_date"
                                                id="finish_date"
                                                class=" w-32 flex bg-white rounded border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 text-base outline-none text-gray-700 py-1 leading-8 transition-colors duration-200 ease-in-out text-center"
                                            />
                                        </td>
                                        <td class="px-4 py-3">
                                            {item.status_name}
                                        </td>
                                        <td class="px-4 py-3">
                                            <button
                                                style="border: none;"
                                                on:click={() => {
                                                    save(item.id);
                                                }}
                                            >
                                                Zapisz
                                            </button>
                                        </td>
                                        <td class="px-4 py-3">
                                            <button
                                                style="border: none;"
                                                on:click={() => {
                                                    cancel();
                                                }}
                                            >
                                                Anuluj
                                            </button>
                                        </td>
                                    </tr>
                                {/each}
                                <p
                                    id="massage"
                                    class="text-xs mt-3 text-red-600 text-right"
                                />
                            {/await}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    {/if}
</section>
