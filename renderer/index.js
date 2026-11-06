const fetchBtn = document.getElementById("fetchBtn");
const saveBtn = document.getElementById("saveSuggestion");

let currentSuggestion = "";
let currentPrayerName = "";

fetchBtn.addEventListener("click", fetchPrayerTimes);
saveBtn.addEventListener("click", saveSuggestion);

displayDate();
updateCurrentTime();

setInterval(updateCurrentTime, 1000);

function displayDate() {

    const today = new Date();

    document.getElementById("todayDate").innerText =
        today.toLocaleDateString(
            "en-MY",
            {
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        );
}

function updateCurrentTime() {

    document.getElementById("currentTime").innerText =
        new Date().toLocaleTimeString();
}

async function fetchPrayerTimes() {

    const zone = document.getElementById("zone").value;

    const zoneNames = {

        // Wilayah Persekutuan
        "WLY01": "Kuala Lumpur & Putrajaya",
        "WLY02": "Labuan",

        // Johor
        "JHR01": "Pulau Aur & Pulau Pemanggil",
        "JHR02": "Johor Bahru, Kota Tinggi, Mersing",
        "JHR03": "Kluang & Pontian",
        "JHR04": "Batu Pahat, Muar & Segamat",

        // Kedah
        "KDH01": "Kota Setar & Kubang Pasu",
        "KDH02": "Kuala Muda & Pendang",
        "KDH03": "Padang Terap & Sik",
        "KDH04": "Baling",
        "KDH05": "Kulim & Bandar Baharu",
        "KDH06": "Langkawi",

        // Kelantan
        "KTN01": "Kota Bharu, Bachok, Pasir Puteh",
        "KTN02": "Pasir Mas & Tumpat",
        "KTN03": "Jeli & Tanah Merah",

        // Melaka
        "MLK01": "Melaka",

        // Negeri Sembilan
        "NGS01": "Jelebu & Jempol",
        "NGS02": "Seremban & Port Dickson",

        // Pahang
        "PHG01": "Pulau Tioman",
        "PHG02": "Kuantan, Pekan & Rompin",
        "PHG03": "Jerantut & Temerloh",
        "PHG04": "Bentong & Raub",

        // Perak
        "PRK01": "Tapah & Slim River",
        "PRK02": "Kuala Kangsar & Sungai Siput",
        "PRK03": "Lenggong & Gerik",
        "PRK04": "Kampar & Kinta",
        "PRK05": "Teluk Intan & Bagan Datuk",

        // Perlis
        "PLS01": "Perlis",

        // Penang
        "PNG01": "Pulau Pinang",

        // Sabah
        "SBH01": "Sandakan",
        "SBH02": "Ranau & Kota Belud",
        "SBH03": "Kudat",
        "SBH04": "Tawau",
        "SBH05": "Beaufort & Sipitang",
        "SBH06": "Kota Kinabalu",

        // Sarawak
        "SWK01": "Limbang & Lawas",
        "SWK02": "Miri",
        "SWK03": "Bintulu",
        "SWK04": "Sibu",
        "SWK05": "Sarikei",
        "SWK06": "Sri Aman",
        "SWK07": "Betong",
        "SWK08": "Kuching",

        // Selangor
        "SGR01": "Gombak, Hulu Langat & Kajang",
        "SGR02": "Kuala Selangor & Sabak Bernam",
        "SGR03": "Klang & Kuala Langat",

        // Terengganu
        "TRG01": "Kuala Terengganu & Marang",
        "TRG02": "Besut & Setiu",
        "TRG03": "Dungun & Kemaman"

    };

    document.getElementById("locationTitle").innerText =
        `Prayer Times in ${zoneNames[zone]}`;

    try {

        document.getElementById("message").innerText =
            "Loading prayer times...";

        const response =
            await fetch(
                `https://api.waktusolat.app/v2/solat/${zone}`
            );

        if (!response.ok) {

            throw new Error(
                "Failed to retrieve prayer times."
            );
        }

        const data =
            await response.json();

        console.log(data);

        const todayDay =
            new Date().getDate();

        const prayer =
            data.prayers.find(
                item =>
                item.day === todayDay
            );

        if (!prayer) {

            throw new Error(
                "Prayer time not available for today."
            );
        }

        document.getElementById("fajr").innerText =
            formatTimestamp(prayer.fajr);

        document.getElementById("dhuhr").innerText =
            formatTimestamp(prayer.dhuhr);

        document.getElementById("asr").innerText =
            formatTimestamp(prayer.asr);

        document.getElementById("maghrib").innerText =
            formatTimestamp(prayer.maghrib);

        document.getElementById("isha").innerText =
            formatTimestamp(prayer.isha);

        calculateNextPrayer(prayer);

        document.getElementById("message").innerText =
            "";

    } catch (error) {

        console.error(error);

        document.getElementById("message").innerText =
            error.message;
    }
}

function formatTimestamp(timestamp) {

    const date =
        new Date(timestamp * 1000);

    return date.toLocaleTimeString(
        "en-MY",
        {
            hour: "2-digit",
            minute: "2-digit"
        }
    );
}

function getMinutes(timestamp) {

    const date =
        new Date(timestamp * 1000);

    return (
        date.getHours() * 60 +
        date.getMinutes()
    );
}

function calculateNextPrayer(prayer) {

    const now =
        new Date();

    const currentMinutes =
        now.getHours() * 60 +
        now.getMinutes();

    const prayerList = [

        {
            name: "Subuh",
            time: prayer.fajr
        },

        {
            name: "Zuhur",
            time: prayer.dhuhr
        },

        {
            name: "Asar",
            time: prayer.asr
        },

        {
            name: "Maghrib",
            time: prayer.maghrib
        },

        {
            name: "Isyak",
            time: prayer.isha
        }

    ];

    let nextPrayer = null;

    for (const prayerItem of prayerList) {

        if (
            getMinutes(
                prayerItem.time
            ) > currentMinutes
        ) {

            nextPrayer =
                prayerItem;

            break;
        }
    }

    if (!nextPrayer) {
        nextPrayer =
            prayerList[0];
    }

        currentPrayerName =
            nextPrayer.name;

        document.getElementById(
            "nextPrayer"
        ).innerText =
            nextPrayer.name;

        document.getElementById(
            "nextPrayerTime"
        ).innerText =
            formatTimestamp(
                nextPrayer.time
            );

    let remaining =

        getMinutes(
            nextPrayer.time
        )
        -
        currentMinutes;

    if (remaining < 0) {

        remaining += 1440;
    }

    const hours =
        Math.floor(
            remaining / 60
        );

    const minutes =
        remaining % 60;

    document.getElementById(
        "remaining"
    ).innerText =
        `${hours} hour(s) ${minutes} minute(s)`;

    generateSuggestion(
        nextPrayer.name
    );
}

function generateSuggestion(prayerName) {

    let suggestion = "";

    if (prayerName === "Subuh") {

        suggestion =
            "Prepare for Subuh prayer and recite morning dhikr.";
    }

    else if (prayerName === "Zuhur") {

        suggestion =
            "Read Quran while waiting for Zuhur prayer.";
    }

    else if (prayerName === "Asar") {

        suggestion =
            "Make dua and prepare for Asar prayer.";
    }

    else if (prayerName === "Maghrib") {

        suggestion =
            "Spend time with family and make dhikr after Maghrib.";
    }

    else if (prayerName === "Isyak") {

        suggestion =
            "Read Surah Al-Mulk before sleeping.";
    }

    else {

        suggestion =
            "No suggestion available.";
    }

    currentSuggestion =
        suggestion;

    document.getElementById(
        "suggestion"
    ).innerText =
        suggestion;
}

function saveSuggestion() {

    if (!currentSuggestion) {

        alert(
            "No suggestion available to save."
        );

        return;
    }

    const suggestions =
        JSON.parse(
            localStorage.getItem(
                "savedSuggestions"
            )
        ) || [];

    suggestions.push({

        prayer:
            currentPrayerName,

        suggestion:
            currentSuggestion,

        savedAt:
            new Date()
            .toLocaleString()

    });

    localStorage.setItem(
        "savedSuggestions",
        JSON.stringify(
            suggestions
        )
    );

    alert(
        "Suggestion saved successfully."
    );
}

fetchPrayerTimes();