let oses = {
    man7: {
        urlWithSection: "https://man7.org/linux/man-pages/man%QMAN_SECTION_NUMBER%/%QMAN_TERM%.%QMAN_SECTION_NUMBER%%QMAN_SECTION_SUFFIX%.html",
        urlWithoutSection: "https://www.google.com/search?q=%QMAN_TERM%&sitesearch=man7.org%2Flinux%2Fman-pages&sa=Search+online+pages"
    },
    freebsd: {
        urlWithSection: "https://www.freebsd.org/cgi/man.cgi?query=%QMAN_TERM%&apropos=0&sektion=%QMAN_SECTION_NUMBER%%QMAN_SECTION_SUFFIX%&format=html",
        urlWithoutSection: "https://www.freebsd.org/cgi/man.cgi?query=%QMAN_TERM%&apropos=0&format=html"
    },
    openbsd: {
        urlWithSection: "https://man.openbsd.org/%QMAN_TERM%.%QMAN_SECTION_NUMBER%%QMAN_SECTION_SUFFIX%",
        urlWithoutSection: "https://man.openbsd.org/%QMAN_TERM%"
    },
    netbsd: {
        urlWithSection: "https://man.netbsd.org/%QMAN_TERM%.%QMAN_SECTION_NUMBER%%QMAN_SECTION_SUFFIX%",
        urlWithoutSection: "https://man.netbsd.org/%QMAN_TERM%"
    },
    dragonflybsd: {
        urlWithSection: "https://man.dragonflybsd.org/?command=%QMAN_TERM%&section=%QMAN_SECTION%%QMAN_SECTION_SUFFIX%",
        urlWithoutSection: "https://man.dragonflybsd.org/?command=%QMAN_TERM%&section=ANY"
    }
};

let sectionNumberDescriptions = {
    "": "",
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
    "": "",
    "p": "POSIX"
};

const nbsp = '\xa0';

class SectionParts {
    constructor(sectionStr) {
        this.number = sectionStr[0] ?? "";
        this.suffix = sectionStr[1] ?? "";
    }
}

function getSectionDescription(sectionParts) {
    let ret = sectionNumberDescriptions[sectionParts.number ?? ""] ?? "";
    if (!ret) {
        return nbsp;
    }
    const suffix = sectionSuffixes[sectionParts.suffix ?? ""] ?? "";
    if (!suffix) {
        return ret;
    }
    ret += " (" + suffix + ")";
    return ret;
}

/* entry point */
(async () => {
    const form = document.getElementById("quickman-form");
    const osSelect = form.querySelector("[name=os]");

    // set default select value
    const lastOsUsed = await browser.storage.local.get({
        lastOsUsed: "man7"
    });
    osSelect.value = lastOsUsed.lastOsUsed;

    form.addEventListener("submit", (e) => {
        const term = e.target.querySelector("[name=term]").value;
        const sectionStr = e.target.querySelector("[name=section]").value;
        const sectionParts = new SectionParts(sectionStr);
        const os = e.target.querySelector("[name=os]").value;

        const urlKey = sectionStr ? "urlWithSection" : "urlWithoutSection";
        const osUrl = oses[os][urlKey]
            .replaceAll("%QMAN_TERM%", encodeURIComponent(term))
            .replaceAll("%QMAN_SECTION_NUMBER%", encodeURIComponent(sectionParts.number))
            .replaceAll("%QMAN_SECTION_SUFFIX%", encodeURIComponent(sectionParts.suffix));

        // ignore the returned promise
        browser.storage.local.set({
            lastOsUsed: os
        }).catch((err) => {
            console.error("Failed to save lastOsUsed: " + err);
        });

        /*// open in new tab
        browser.tabs.create({
            active: true,
            url: osUrl
        });
        */

        browser.tabs.update({
            active: true,
            url: osUrl
        });
    });

    osSelect.addEventListener("input", (e) => {
        form.querySelector(".section-description").innerText =
            getSectionDescription(new SectionParts(e.target.value));
    });
})();
