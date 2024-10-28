function injectHeader() {
    const header = document.createElement("header");

    const backLink = document.createElement("a");
    backLink.href = "index.html";
    backLink.textContent = "Back to Project List";


    header.appendChild(backLink);
    document.body.prepend(header);
}
