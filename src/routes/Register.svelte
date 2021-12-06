<script>
    import md5 from "../../scripts/md5";
    import checkLog from "../../scripts/checkLog";
    import Text from "../components/FormInputs/Text.svelte";
    import Password from "../components/FormInputs/Password.svelte";
    import Email from "../components/FormInputs/Email.svelte";
    import Tel from "../components/FormInputs/Tel.svelte";

    let user_info = {
            username: "",
            password: "",
            confirm_password: "",
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
        usernames = [],
        message;

    let passwords_match = false;

    let goTop = () => {
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    };

    let register = async () => {
        if (
            user_info.username &&
            user_info.password &&
            user_info.confirm_password &&
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
            let password = JSON.parse(JSON.stringify(user_info.password));
            let card_number = JSON.parse(JSON.stringify(user_info.card_number));
            let cvv2 = JSON.parse(JSON.stringify(user_info.cvv2));

            user_info.password = md5(user_info.password);
            user_info.card_number = md5(
                user_info.card_number.replace(/\s/g, "")
            );
            user_info.cvv2 = md5(user_info.cvv2);

            let data = new FormData();
            Object.keys(user_info).forEach((key) => {
                data.append(key, JSON.parse(JSON.stringify(user_info[key])));
            });

            const URL = "./backend/Register.php";
            let res = await fetch(URL, {
                method: "POST",
                body: data,
                mode: "no-cors",
            });

            res = await res.json();

            if (res.msg == "failed") {
                alert("Wystąpił błąd, spróbuj ponownie");
            } else if (res.msg == "duplicated") {
                user_info.password = password;
                user_info.card_number = card_number;
                user_info.cvv2 = cvv2;

                document.getElementById("username_p").innerText =
                    "Nazwa użytkownika zajęta";
                goTop();
            } else {
                window.location.replace("./#/login");
            }
        } else {
            errors();
        }
    };

    let errors = () => {
        Object.keys(user_info).forEach((key) => {
            if (user_info[key] === "" && key !== "apartment_number") {
                console.log(key + "_p");
                document.getElementById(key + "_p").innerText = "Uzupełnij";
            }
        });
    };

    let check = () => {
        if (user_info.password === user_info.confirm_password) {
            if (user_info.confirm_password.length < 8) {
                document.getElementById("confirm_password_p").innerText =
                    "Zakrótkie hasło, minimalna długość to 8 znaków";
                passwords_match = false;
            } else {
                document.getElementById("confirm_password_p").innerText = "";
                passwords_match = true;
            }
        } else {
            document.getElementById("confirm_password_p").innerText =
                "Różne hasła";
            passwords_match = false;
        }
    };

    let checkValue = (name, value) => {
        if (value === "") {
            document.getElementById(name + "_p").innerText = "Uzupełnij";
        } else {
            if (name === "password" || name === "confirm_password") {
                if (value.length < 8) {
                    document.getElementById(name + "_p").innerText =
                        "Zakrótkie hasło, minimalna długość to 8 znaków";
                    passwords_match = false;
                } else {
                    document.getElementById(name + "_p").innerText = "";
                    passwords_match = true;
                }

                check();
            } else {
                document.getElementById(name + "_p").innerText = "";
            }
        }
    };

    let checkRegEx = (pattern, name, value) => {
        pattern = new RegExp(pattern);

        if (pattern.test(value.replace(/\s/g, ""))) {
            document.getElementById(name + "_p").innerText = "";
        } else {
            document.getElementById(name + "_p").innerText = "Popraw";
        }
    };
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
                <Text
                    name={"username"}
                    placeholder={"jan_kowalski"}
                    desc={"Nazwa użytkownika"}
                    bind:value={user_info.username}
                    blur={() => {
                        checkValue("username", user_info.username);
                    }}
                />
            </div>
            <div class="relative mb-4">
                <Password
                    name={"password"}
                    placeholder={"12345678"}
                    desc={"Hasło"}
                    bind:value={user_info.password}
                    blur={() => {
                        checkValue("password", user_info.password);
                    }}
                    keyup={() => {
                        check();
                    }}
                />
                <div class="relative mb-4">
                    <Password
                        name={"confirm_password"}
                        placeholder={"12345678"}
                        desc={"Potwierdź hasło"}
                        bind:value={user_info.confirm_password}
                        blur={() => {
                            checkValue(
                                "confirm_password",
                                user_info.confirm_password
                            );
                        }}
                        keyup={() => {
                            check();
                        }}
                    />
                </div>

                <p class="text-s mb-3 text-gray-600">
                    Informacje o użytkowniku
                </p>
                <div class="relative mb-4">
                    <Text
                        name={"firstname"}
                        placeholder={"Jan"}
                        desc={"Imię"}
                        bind:value={user_info.firstname}
                        blur={() => {
                            checkValue("firstname", user_info.firstname);
                        }}
                    />
                </div>
                <div class="relative mb-4">
                    <Text
                        name={"lastname"}
                        placeholder={"Kowalski"}
                        desc={"Nazwisko"}
                        bind:value={user_info.lastname}
                        blur={() => {
                            checkValue("lastname", user_info.lastname);
                        }}
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
                        on:focus={checkValue("age", user_info.age)}
                        on:change={checkValue("age", user_info.age)}
                        class="w-full h-11 bg-white rounded border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                    >
                        <option value="18" selected>18</option>
                        <option value="19">19</option>
                        <option value="20">20</option>
                        <option value="21">21</option>
                        <option value="more">więcej niż 21</option>
                    </select>
                    <p id="age_p" class="text-xs mt-3 text-red-600" />
                </div>

                <p class="text-s mb-3 text-gray-600">Adres</p>

                <div class="relative mb-4">
                    <Text
                        name={"street"}
                        placeholder={"Świętokrzyska"}
                        desc={"Ulica"}
                        bind:value={user_info.street}
                        blur={() => {
                            checkValue("street", user_info.street);
                        }}
                    />
                </div>
                <div class="relative mb-4">
                    <Text
                        name={"house_number"}
                        placeholder={"21"}
                        desc={"Numer domu"}
                        bind:value={user_info.house_number}
                        blur={() => {
                            checkValue("house_number", user_info.house_number);
                        }}
                    />
                </div>
                <div class="relative mb-4">
                    <Text
                        name={"apartment_number"}
                        placeholder={"37"}
                        desc={"Numer mieszkania"}
                        bind:value={user_info.apartment_number}
                        blur={() => {
                            checkValue(
                                "apartment_number",
                                user_info.apartment_number
                            );
                        }}
                    />
                </div>
                <div class="relative mb-4">
                    <Text
                        name={"city"}
                        placeholder={"Kraków"}
                        desc={"Miasto"}
                        bind:value={user_info.city}
                        blur={() => {
                            checkValue("city", user_info.city);
                        }}
                    />
                </div>
                <div class="relative mb-4">
                    <Text
                        name={"postcode"}
                        placeholder={"31-131"}
                        desc={"Kod pocztowy"}
                        bind:value={user_info.postcode}
                        blur={() => {
                            checkValue("postcode", user_info.postcode);
                            checkRegEx(
                                "^\\d{2}-\\d{3}$",
                                "postcode",
                                user_info.postcode
                            );
                        }}
                    />
                </div>

                <p class="text-s mb-3 text-gray-600">Dane kontaktowe</p>

                <div class="relative mb-4">
                    <Email
                        name={"email"}
                        placeholder={"jan.kowalski@poczta.pl"}
                        desc={"Email"}
                        bind:value={user_info.email}
                        blur={() => {
                            checkValue("email", user_info.email);
                            checkRegEx(
                                "^[a-zA-Z0-9.!#$%&’*+\\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*$",
                                "email",
                                user_info.email
                            );
                        }}
                    />
                </div>
                <div class="relative mb-4">
                    <Tel
                        name={"phone"}
                        placeholder={"123456789"}
                        desc={"Numer telefonu"}
                        bind:value={user_info.phone}
                        blur={() => {
                            checkValue("phone", user_info.phone);
                            checkRegEx("^\\d{9}$", "phone", user_info.phone);
                        }}
                    />
                </div>

                <p class="text-s mb-3 text-gray-600">Dane rozliczeniowe</p>

                <div class="relative mb-4">
                    <Text
                        name={"owner_firstname"}
                        placeholder={"Jan"}
                        desc={"Imię właściciela karty"}
                        bind:value={user_info.owner_firstname}
                        blur={() => {
                            checkValue(
                                "owner_firstname",
                                user_info.owner_firstname
                            );
                        }}
                    />
                </div>

                <div class="relative mb-4">
                    <Text
                        name={"owner_lastname"}
                        placeholder={"Kowalski"}
                        desc={"Nazwisko właściciela karty"}
                        bind:value={user_info.owner_lastname}
                        blur={() => {
                            checkValue(
                                "owner_lastname",
                                user_info.owner_lastname
                            );
                        }}
                    />
                </div>

                <div class="relative mb-4">
                    <Text
                        name={"card_number"}
                        placeholder={"1234 5678 1234 5678"}
                        desc={"Numer karty"}
                        bind:value={user_info.card_number}
                        blur={() => {
                            checkValue("card_number", user_info.card_number);
                            checkRegEx(
                                "^\\d{16}$",
                                "card_number",
                                user_info.card_number
                            );
                        }}
                    />
                </div>

                <div class="relative mb-4">
                    <Text
                        name={"expiry_date"}
                        placeholder={"08/24"}
                        desc={"Data ważności"}
                        bind:value={user_info.expiry_date}
                        blur={() => {
                            checkValue("expiry_date", user_info.expiry_date);
                            checkRegEx(
                                "^(0[1-9]|1[0-2])\\/\\d{2}$",
                                "expiry_date",
                                user_info.expiry_date
                            );
                        }}
                    />
                </div>

                <div class="relative mb-4">
                    <Text
                        name={"cvv2"}
                        placeholder={"123"}
                        desc={"CVV2"}
                        bind:value={user_info.cvv2}
                        blur={() => {
                            checkValue("cvv2", user_info.cvv2);
                            checkRegEx("^\\d{3}$", "cvv2", user_info.cvv2);
                        }}
                    />
                </div>

                <button
                    class="text-white bg-green-500 border-0 py-2 px-8 focus:outline-none hover:bg-green-600 rounded text-lg"
                    on:click={() => {
                        errors();
                        if (passwords_match) {
                            register();
                        } else {
                            goTop();
                        }
                    }}>Zarejestruj</button
                >
            </div>
        </div>
    </div>
</section>
