let params = new URLSearchParams(location.search);

if (params.get("surat") == null) {
    document.location.href = "?surat=1";
}

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

        fetch("https://equran.id/api/surat")
            .then((response) => response.json())
            .then((response) => {
                for (let i = 0; i < response.length; i++) {
                    if (inputValue == response[i].nama_latin) {
                        keyword = response[i].nomor;
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

fetch("https://equran.id/api/surat/" + surat)
    .then((response) => response.json())
    .then((response) => {
        let ayahList = document.querySelector("#ayah-list");
        let ayahTitle = document.querySelector("#ayah-title");
        let ayah = "";
        const surahData = response;

        ayahTitle.innerHTML = `${response.nama_latin} (${response.arti})`;

        response.ayat.forEach((r) => {
            ayah += `<div class="space-y-2">
                                <span class="uppercase tracking-widest font-semibold text-sm text-gray-500">Ayat ${r.nomor}</span>
                                <div class="space-y-5">
                                    <h2 class="font-bold md:text-4xl sm:text-3xl text-2xl md:leading-[3.8rem] sm:leading-[3.2rem] leading-[2.2rem]">${r.ar}</h2>
                                    <p class="font-['poppins'] bg-blue-600 text-white max-w-fit py-2 px-6 rounded-md shadow-xl text-sm">${r.idn}</p>
                                </div>
                            </div>`;
        });

        ayahList.innerHTML = ayah;

        fetch("https://equran.id/api/surat")
            .then((response) => response.json())
            .then((response) => {
                let surahList = document.querySelector("#surah-list");
                let surah = "";

                response.forEach((r) => {
                    surah += `<div class="flex items-center gap-1">
                                    <span class="text-sm h-8 w-8 min-h-[2rem] min-w-[2rem] font-medium ${
                                        r.nomor != surahData.nomor
                                            ? "border border-blue-600 text-blue-600"
                                            : "bg-blue-600 text-white"
                                    } rounded-md flex justify-center items-center">${
                        r.nomor
                    }</span>
                                            <a class="block font-medium hover:bg-gray-100 w-full py-1 px-2 rounded-md transition-all duration-300" href="?surat=${
                                                r.nomor
                                            }">${r.nama_latin}</a>
                                        </div>`;
                });

                surahList.innerHTML = surah;
            });
    });
