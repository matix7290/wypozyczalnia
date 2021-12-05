export default async function getData(name) {
    let data = new FormData();
    data.append("name", name);

    let URL = "./backend/GetSession.php";
    let res = await fetch(URL, {
        method: "POST",
        body: data,
        mode: "no-cors",
    });

    res = await res.json();

    return res;
}