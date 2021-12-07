<script>
    import checkLog from "../../scripts/checkLog";
    import BigCarRow from "../components/BigCarRow.svelte";
    export let params;

    let clicked = false;
    let setted = false;
    let correct = false;
    let start_date = "";
    let finish_date = "";
    let logged, overdueReservationNumber;

    let names = {
        transmission: ["Skrzynia biegów", ""],
        ac: ["Klimatyzacja", ""],
        number_of_seats: ["Liczba siedzeń", ""],
        afc: ["Średnie spalanie", "l/100km"],
        boot_capacity: ["Pojemność bagażnika", "l"],
        number_of_doors: ["Liczba drzwi", ""],
    };

    let getReservationsNumber = async () => {
        const URL = "./backend/CountReservations.php";
        let data = new FormData();
        data.append("id", params.id);

        let res = await fetch(URL, {
            method: "POST",
            mode: "no-cors",
            body: data,
        });

        res = await res.json();

        return res;
    };

    let getOverdueReservationsNumber = async () => {
        const URL = "./backend/CountOverdueReservations.php";
        let res = await fetch(URL);
        res = await res.json();
        return res;
    };

    let getItem = async () => {
        const URL = "./backend/GetOneCar.php";
        let data = new FormData();
        data.append("id", params.id);

        let res = await fetch(URL, {
            method: "POST",
            mode: "no-cors",
            body: data,
        });

        res = await res.json();

        let reservationNumber = await getReservationsNumber();
        overdueReservationNumber = await getOverdueReservationsNumber();

        res.data = Object.keys(res.data).map((key) => [
            names[key][0],
            res.data[key],
            names[key][1],
        ]);

        res.data.push(["Ilość rezerwacji", reservationNumber, ""]);

        return res;
    };

    let init = async () => {
        if (await checkLog()) {
            logged = true;
        } else {
            logged = false;
        }
    };

    let checkSet = () => {
        if (start_date !== "" && finish_date !== "") {
            setted = true;
        } else {
            setted = false;
        }

        check();
    };

    let check = () => {
        if (setted) {
            if (start_date > finish_date) {
                document.getElementById("error").innerText = "Popraw daty";
                correct = false;
            } else {
                document.getElementById("error").innerText = "";
                correct = true;
            }
        }
    };

    let send = async () => {
        let data = new FormData();
        data.append("car_id", params.id);
        data.append("start_date", start_date);
        data.append("finish_date", finish_date);

        const URL = "./backend/AddReservation.php";
        let res = await fetch(URL, {
            method: "POST",
            body: data,
            mode: "no-cors",
        });

        res = await res.json();

        if (res.msg === "successfully") {
            document.getElementById("success").innerText =
                "Dokonano rezerwacji";
            setTimeout(() => {
                window.location.replace("./#/user/reservstions");
            }, 1500);
        } else {
            document.getElementById("error").innerText =
                "Błąd rezerwacji. Spróbuj ponownie";
        }
    };

    window.onload = init();
</script>

<section class="text-gray-600 body-font overflow-hidden">
    <div class="container px-5 pt-12 pb-24 mx-auto">
        {#await getItem()}
            loading...
        {:then item}
            <div class="lg:w-4/5 mx-auto flex flex-wrap">
                <div
                    class="lg:w-1/2 w-full lg:pr-10 lg:pt-6 mb-0 lg:mb-0 flex flex-col justify-center align-middle"
                >
                    <h2
                        class="text-sm title-font text-gray-500 tracking-widest"
                    >
                        {item.info.vehicle_class + " class"}
                    </h2>
                    <h1
                        class="text-gray-900 text-3xl title-font font-medium mb-4"
                    >
                        {item.info.mark + " " + item.info.model}
                    </h1>
                    {#each item.data as value}
                        <BigCarRow
                            name={value[0]}
                            value={value[1]}
                            suffix={value[2]}
                        />
                    {/each}
                    <div class="flex mt-5">
                        <span
                            class="title-font font-medium text-2xl text-gray-900"
                            >{item.info.price} zł/dzień</span
                        >
                        {#if !logged}
                            <button
                                class="flex ml-auto text-white bg-green-500 border-0 py-2 px-6 rounded disabled:text-white disabled:opacity-50 pointer-events-none"
                                disabled>Rezerwuj</button
                            >
                            <p class="text-xs mt-3 text-red-600 text-right">
                                Aby złożyć rezezwacje musisz być zalogowany
                            </p>
                        {:else if overdueReservationNumber != 0}
                            <button
                                class="flex ml-auto text-white bg-green-500 border-0 py-2 px-6 rounded disabled:text-white disabled:opacity-50 pointer-events-none"
                                disabled>Rezerwuj</button
                            >
                            <p class="text-xs mt-3 text-red-600 text-right">
                                Aby złożyć rezezwacje musisz oddać wszystkie
                                auta po terminie
                            </p>
                        {:else}
                            <button
                                class="flex ml-auto text-white bg-green-500 border-0 py-2 px-6 focus:outline-none hover:bg-green-600 rounded"
                                on:click={() => {
                                    clicked = !clicked;
                                }}>Rezerwuj</button
                            >
                        {/if}
                    </div>
                    {#if clicked}
                        <div class="flex mt-5">
                            <label
                                for="start_date"
                                class="leading-7 text-sm text-gray-600"
                                >Data wypożyczenia</label
                            >
                            <input
                                type="date"
                                id="start_date"
                                name="start_date"
                                bind:value={start_date}
                                on:change={checkSet}
                                class="w-2/3 flex ml-auto bg-white rounded border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                            />
                        </div>
                        <div class="flex mt-5">
                            <label
                                for="finish_date"
                                class="leading-7 text-sm text-gray-600"
                                >Data oddania</label
                            >
                            <input
                                type="date"
                                id="finish_date"
                                name="finish_date"
                                bind:value={finish_date}
                                on:change={checkSet}
                                class="w-2/3 flex ml-auto bg-white rounded border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                            />
                        </div>
                        <div class="flex mt-5">
                            <p
                                id="error"
                                class="text-xs mt-3 text-red-600 text-right"
                            />
                            <p
                                id="success"
                                class="text-xs mt-3 text-green-600 text-right"
                            />
                        </div>
                        <div class="flex mt-5">
                            <button
                                class="flex ml-auto text-white bg-green-500 border-0 py-2 px-6 focus:outline-none hover:bg-green-600 rounded"
                                on:click={() => {
                                    if (correct) {
                                        send();
                                    }
                                }}>Złóż rezerwacje</button
                            >
                        </div>
                    {/if}
                </div>
                <img
                    alt="ecommerce"
                    class="lg:w-1/2 w-full lg:max-h-96 h-64 mt-28 object-cover object-center rounded"
                    src="https://dummyimage.com/600x300"
                />
            </div>
        {/await}
    </div>
</section>
