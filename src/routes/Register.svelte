<script>
    import md5 from "../../scripts/md5";
    import checkLog from "../../scripts/checkLog";

    let user_info = {
            username: "",
            password: "",
            confirm: "",
            firstname: "",
            lastname: "",
            age: "",
            phone: "",
            email: "",
            street: "",
            house_number: "",
            apartment_number: "",
            city: "",
            postcode: "",
            owner_firstname: "",
            owner_lastname: "",
            card_number: "",
            expiry_date: "",
            cvv2: "",
        },
        message;

    let passwords_match = false;

    async function register() {
        if (
            user_info.username &&
            user_info.password &&
            user_info.firstname &&
            user_info.lastname &&
            user_info.age &&
            user_info.phone &&
            user_info.email &&
            user_info.street &&
            user_info.house_number &&
            user_info.city &&
            user_info.postcode &&
            user_info.owner_firstname &&
            user_info.owner_lastname &&
            user_info.card_number &&
            user_info.expiry_date &&
            user_info.cvv2
        ) {
            user_info.password = md5(user_info.password);
            user_info.card_number = md5(user_info.card_number);
            user_info.cvv2 = md5(user_info.cvv2);

            let data = new FormData();
            Object.keys(user_info).forEach((key) => {
                data.append(key, JSON.parse(JSON.stringify(user_info[key])));
                user_info[key] = "";
            });

            const URL = "./backend/AddItem.php";
            let res = await fetch(URL, {
                method: "POST",
                body: data,
                mode: "no-cors",
            });

            res = await res.json();
            message = res.msg;
            console.log(res);
        } else {
            alert("Nie uzupełniłeś wszystkiego!");
        }
    }

    let check = function () {
        if (user_info.password !== "" && user_info.confirm === "") {
            if (lengthChech(password.value)) {
                document.getElementById("message").innerHTML = "";
            } else {
                document.getElementById("message").innerHTML =
                    "Zakrótkie hasło, minimalna długość to 8 znaków";
            }
        } else {
            if (user_info.password === user_info.confirm) {
                if (lengthChech(user_info.password)) {
                    document.getElementById("message").innerHTML = "";
                    passwords_match = true;
                } else {
                    document.getElementById("message").innerHTML =
                        "Zakrótkie hasło, minimalna długość to 8 znaków";
                    passwords_match = false;
                }
            } else {
                document.getElementById("message").innerHTML = "Różne hasła";
                passwords_match = false;
            }
        }
    };

    function lengthChech(password) {
        if (password.length < 8) {
            return false;
        } else {
            return true;
        }
    }
</script>

<section class="text-gray-600 body-font">
    <div
        class="container px-5 py-24 mx-auto flex flex-wrap flex-col items-center"
        on:load={checkLog()}
    >
        <div class="w-1/4 mb-10 pr-0 flex flex-col items-start">
            <h1 class="title-font font-medium text-3xl text-gray-900">
                Zarejestruj się...
            </h1>
            <p class="leading-relaxed mt-4">
                ...a nie pomyślisz już nigdy o zakupie samochodu.
            </p>
        </div>
        <div
            class=" bg-gray-100 rounded-lg p-8 flex flex-col w-2/3 mt-10 md:mt-0 self-center"
        >
            <div class="relative mb-4">
                <label for="username" class="leading-7 text-sm text-gray-600"
                    >Nazwa użytkownika</label
                >
                <input
                    type="text"
                    id="username"
                    name="username"
                    bind:value={user_info.username}
                    placeholder="jan_kowalski"
                    class="w-full bg-white rounded border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                />
            </div>
            <div class="relative mb-4">
                <label for="password" class="leading-7 text-sm text-gray-600"
                    >Hasło</label
                >
                <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="12345678"
                    bind:value={user_info.password}
                    on:keyup={() => {
                        check();
                    }}
                    class="w-full bg-white rounded border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                />
            </div>
            <div class="relative mb-4">
                <label
                    for="confirm_password"
                    class="leading-7 text-sm text-gray-600"
                    >Potwierdź hasło</label
                >
                <input
                    type="password"
                    id="confirm_password"
                    name="confirm_password"
                    placeholder="12345678"
                    bind:value={user_info.confirm}
                    on:keyup={() => {
                        check();
                    }}
                    class="w-full bg-white rounded border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                />
                <p id="message" class="text-xs mt-3 text-red-600" />
            </div>

            <p class="text-s mb-3 text-gray-600">Informacje o użytkowniku</p>

            <div class="relative mb-4">
                <label for="firstname" class="leading-7 text-sm text-gray-600"
                    >Imię</label
                >
                <input
                    type="text"
                    id="firstname"
                    name="firstname"
                    placeholder="Jan"
                    bind:value={user_info.firstname}
                    class="w-full bg-white rounded border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                />
            </div>
            <div class="relative mb-4">
                <label for="lastname" class="leading-7 text-sm text-gray-600"
                    >Nazwisko</label
                >
                <input
                    type="text"
                    id="lastname"
                    name="lastname"
                    placeholder="Kowalski"
                    bind:value={user_info.lastname}
                    class="w-full bg-white rounded border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                />
            </div>
            <div class="relative mb-4">
                <label for="age" class="leading-7 text-sm text-gray-600"
                    >Wiek</label
                >
                <select
                    id="age"
                    name="age"
                    bind:value={user_info.age}
                    class="w-full h-11 bg-white rounded border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                >
                    <option value="18">18</option>
                    <option value="19">19</option>
                    <option value="20">20</option>
                    <option value="21">21</option>
                    <option value="more">więcej niż 21</option>
                </select>
            </div>

            <p class="text-s mb-3 text-gray-600">Adres</p>

            <div class="relative mb-4">
                <label for="street" class="leading-7 text-sm text-gray-600"
                    >Ulica</label
                >
                <input
                    type="text"
                    id="street"
                    name="street"
                    placeholder="Świętokrzyska"
                    bind:value={user_info.street}
                    class="w-full bg-white rounded border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                />
            </div>
            <div class="relative mb-4">
                <label
                    for="house_number"
                    class="leading-7 text-sm text-gray-600">Numer domu</label
                >
                <input
                    type="text"
                    id="house_number"
                    name="house_number"
                    placeholder="21"
                    bind:value={user_info.house_number}
                    class="w-full bg-white rounded border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                />
            </div>
            <div class="relative mb-4">
                <label
                    for="apartment_number"
                    class="leading-7 text-sm text-gray-600"
                    >Numer mieszkania</label
                >
                <input
                    type="text"
                    id="apartment_number"
                    name="apartment_number"
                    placeholder="37"
                    bind:value={user_info.apartment_number}
                    class="w-full bg-white rounded border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                />
            </div>
            <div class="relative mb-4">
                <label for="city" class="leading-7 text-sm text-gray-600"
                    >Miasto</label
                >
                <input
                    type="text"
                    id="city"
                    name="city"
                    placeholder="Kraków"
                    bind:value={user_info.city}
                    class="w-full bg-white rounded border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                />
            </div>
            <div class="relative mb-4">
                <label for="postcode" class="leading-7 text-sm text-gray-600"
                    >Kod pocztowy</label
                >
                <input
                    type="text"
                    id="postcode"
                    name="postcode"
                    placeholder="31-131"
                    bind:value={user_info.postcode}
                    class="w-full bg-white rounded border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                />
            </div>

            <p class="text-s mb-3 text-gray-600">Dane kontaktowe</p>

            <div class="relative mb-4">
                <label for="email" class="leading-7 text-sm text-gray-600"
                    >Email</label
                >
                <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="jan.kowalski@poczta.pl"
                    bind:value={user_info.email}
                    class="w-full bg-white rounded border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                />
            </div>
            <div class="relative mb-4">
                <label for="phone" class="leading-7 text-sm text-gray-600"
                    >Numer telefonu</label
                >
                <input
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder="123456789"
                    bind:value={user_info.phone}
                    class="w-full bg-white rounded border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                />
            </div>

            <p class="text-s mb-3 text-gray-600">Dane rozliczeniowe</p>

            <div class="relative mb-4">
                <label
                    for="owner_firstname"
                    class="leading-7 text-sm text-gray-600"
                    >Imię właściciela karty</label
                >
                <input
                    type="text"
                    id="owner_firstname"
                    name="owner_firstname"
                    placeholder="Jan"
                    bind:value={user_info.owner_firstname}
                    class="w-full bg-white rounded border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                />
            </div>

            <div class="relative mb-4">
                <label
                    for="owner_lastname"
                    class="leading-7 text-sm text-gray-600"
                    >Nazwisko właściciela karty</label
                >
                <input
                    type="text"
                    id="owner_lastname"
                    name="owner_lastname"
                    placeholder="Kowalski"
                    bind:value={user_info.owner_lastname}
                    class="w-full bg-white rounded border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                />
            </div>

            <div class="relative mb-4">
                <label for="card_number" class="leading-7 text-sm text-gray-600"
                    >Numer karty</label
                >
                <input
                    type="text"
                    id="card_number"
                    name="card_number"
                    placeholder="1234 5678 1234 5678"
                    bind:value={user_info.card_number}
                    class="w-full bg-white rounded border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                />
            </div>

            <div class="relative mb-4">
                <label for="expiry_date" class="leading-7 text-sm text-gray-600"
                    >Data ważności</label
                >
                <input
                    type="text"
                    id="expiry_date"
                    name="expiry_date"
                    placeholder="12/23"
                    bind:value={user_info.expiry_date}
                    class="w-full bg-white rounded border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                />
            </div>

            <div class="relative mb-4">
                <label for="cvv2" class="leading-7 text-sm text-gray-600"
                    >CCV2</label
                >
                <input
                    type="text"
                    id="cvv2"
                    name="cvv2"
                    placeholder="123"
                    bind:value={user_info.cvv2}
                    class="w-full bg-white rounded border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                />
            </div>

            <button
                class="text-white bg-green-500 border-0 py-2 px-8 focus:outline-none hover:bg-green-600 rounded text-lg"
                on:click={() => {
                    if (passwords_match) {
                        register();
                    }
                }}>Zarejestruj</button
            >
        </div>
    </div>
</section>
