<script>
    let marka, model, rok, kolor, stan, message;

    async function dodajElement() {
        if (marka && model && rok && kolor && stan) {
            console.log(marka, model, rok, kolor, stan);

            let data = new FormData();
            data.append("marka", marka);
            data.append("model", model);
            data.append("rok", rok);
            data.append("kolor", kolor);
            data.append("stan", stan);

            // const URL = "http://localhost/stuglik/public/backend/AddItem.php";
            const URL = "./backend/AddItem.php";
            let res = await fetch(URL, {
                method: "POST",
                body: data,
                mode: "no-cors",
            });

            res = await res.json();
            message = res.msg;
            console.log(res.msg);
        } else {
            alert("Nie uzupełniłeś wszystkiego!");
        }
    }
</script>

<input type="text" placeholder="marka" bind:value={marka} />
<input type="text" placeholder="model" bind:value={model} />
<input type="text" placeholder="rok" bind:value={rok} />
<input type="text" placeholder="kolor" bind:value={kolor} />
<input type="text" placeholder="stan" bind:value={stan} />
<button on:click={dodajElement}>Dodaj</button>

{#if message}
    <p class="bg-green-400 text-white ">{message}</p>
{/if}
