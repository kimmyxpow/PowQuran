let params = new URLSearchParams(location.search);
const baseUrl = "https://api.quran.gading.dev/surah"

const registerServiceWorker = async () => {
    if ('serviceWorker' in window.navigator) {
        // register service worker
        const registration = await window.navigator.serviceWorker.register("./sw.js")

        if (registration.installing) console.log("installing service worker")
        else if (registration.waiting) console.log("service worker installed")
        else if (registration.active) console.log("service worker active")
    } else {
        console.log("service worker doesnot support")
    }
}

registerServiceWorker()


if (params.get("surat") == null) {
    document.location.href = "?surat=1";
} else {
    const sidebarToggle = document.querySelector("#sidebar-toggle");
    const sidebar = document.querySelector("#sidebar");

    sidebarToggle.addEventListener("click", function () {
        sidebar.classList.toggle("translate-x-0");
        sidebar.classList.toggle("-translate-x-72");
    });

    const search = document.querySelectorAll(".search");
    search.forEach((s) => {
        s.addEventListener("submit", (e) => {
            e.preventDefault();

            const inputValue = e.target.querySelector("input").value;
            let keyword;

            fetch(baseUrl)
                .then((response) => response.json())
                .then((response) => {
                    for (let i = 0; i < response.data.length; i++) {
                        if (inputValue.toLowerCase() == response.data[i].name.transliteration.id.toLowerCase()) {
                            keyword = response.data[i].number;
                            document.location.href = "?surat=" + keyword;
                            break;
                        } else {
                            keyword = false;
                        }
                    }

                    if (!keyword) {
                        return alert("Surat tidak ditemukan");
                    }
                });
        });
    });

    const surat = params.get("surat");

    fetch(`${baseUrl}/${surat}`)
        .then((response) => response.json())
        .then((response) => {
            let ayahList = document.querySelector("#ayah-list");
            let surahHeader = document.querySelector("#surah-header");
            let ayah = "";
            const surahData = response.data;

            surahHeader.querySelector('h1').innerHTML = `${surahData.name.transliteration.id} (${surahData.name.translation.id})`;
            surahHeader.querySelector('p').innerHTML = `${surahData.tafsir.id}`;

            document.querySelectorAll('.web-desc').forEach(webDesc => {
                webDesc.setAttribute('content', surahData.deskripsi);
            });

            surahData.verses.forEach((r) => {
                ayah += `<div class="space-y-2">
                                <span class="uppercase tracking-widest font-semibold text-sm text-gray-500">Ayat ${r.number.inSurah}</span>
                                <div class="space-y-5">
                                    <audio controls src="${r.audio.primary}">
                                        Your browser does not support the
                                        <code>audio</code> element.
                                    </audio>
                                    <h2 id="arabic-ayah" class="font-bold md:text-4xl sm:text-3xl text-2xl md:leading-[4.8rem] sm:leading-[4.2rem] leading-[3.2rem] font-['Amiri'] tracking-[1px] text-gray-800">${r.text.arab}</h2>
                                    <p class="font-['poppins'] bg-blue-600 text-white max-w-fit py-2 px-6 rounded-md shadow-xl text-sm">${r.translation.id}</p>
                                </div>
                            </div>`;
            });

            ayahList.innerHTML = ayah;
        });

        fetch(baseUrl)
            .then((response) => response.json())
            .then((response) => {
                let surahList = document.querySelector("#surah-list");
                let surah = "";

                response.data.forEach((r) => {
                    surah += `<div class="flex items-center gap-1">
                                <span class="text-sm h-8 w-8 min-h-[2rem] min-w-[2rem] font-medium 
                                ${
                                    r.number != surat
                                        ? "border border-blue-600 text-blue-600"
                                        : "bg-blue-600 text-white"
                                } 
                                rounded-md flex justify-center items-center">${
                                    r.number
                                }</span>
                                <a class="block font-medium hover:bg-gray-100 text-gray-800 w-full py-1 px-2 rounded-md transition-all duration-300" 
                                    href="?surat=${r.number}">
                                    ${r.name.transliteration.id}
                                </a>
                            </div>`;
                });

                surahList.innerHTML = surah;
            });
}
