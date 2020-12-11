let systems = {
    "man7": {
        "urlWithSection": "https://man7.org/linux/man-pages/man%QMAN_SECTION%/%QMAN_TERM%.%QMAN_SECTION%.html",
        "urlWithoutSection": "https://www.google.com/search?q=%QMAN_TERM%&sitesearch=man7.org%2Flinux%2Fman-pages&sa=Search+online+pages"
    }
};

let sectionNumberDescriptions = {
    "1": "commands",
    "2": "system calls",
    "3": "library functions",
    "4": "special files",
    "5": "file formats",
    "6": "games",
    "7": "miscellanea",
    "8": "sysadmin"
};

let sectionSuffixes = {
    "p": "POSIX"
};

let nbsp = '\xa0';

/// sectionId = "1", "2", "3", "3p", etc.
function getSectionDescription(sectionId) {
    if (!sectionId) {
        return nbsp;
    }

    let ret = "";

    if (sectionNumberDescriptions.hasOwnProperty(sectionId[0])) {
        ret = sectionNumberDescriptions[sectionId[0]];
        if (sectionId.length == 2 && sectionSuffixes.hasOwnProperty(sectionId[1])) {
            ret += " (" + sectionSuffixes[sectionId[1]] + ")";
        }
    }

    return ret ? ret : nbsp;
}

let form = document.getElementById("quickman-form");

form.addEventListener("submit", (e) => {
    let term = e.target.querySelector("[name=term]").value;
    let section = e.target.querySelector("[name=section]").value;
    let urlKey = section ? "urlWithSection" : "urlWithoutSection";
    let systemUrl = systems["man7"][urlKey]
        .replaceAll("%QMAN_TERM%", term)
        .replaceAll("%QMAN_SECTION%", section);
    browser.tabs.create({
        "active": true,
        "url": systemUrl
    });
});

form.querySelector("[name=section]").addEventListener("input", (e) => {
    form.querySelector(".section-description").innerText = getSectionDescription(e.target.value);
});
