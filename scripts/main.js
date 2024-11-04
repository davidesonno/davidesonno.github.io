// document.addEventListener("DOMContentLoaded", () => {
//     document.querySelectorAll(".project-button").forEach(button => {
//         button.addEventListener("click", (event) => {
//             const pageUrl = event.currentTarget.getAttribute("data-url");
//             // window.location.href = pageUrl;
//             injectHeader();
//         });
//     });
// });

function loadHTML(indexLink) {
    loadFile(indexLink, 'html');
}

function loadJupyter(notebookLink) {
    const regex = /github\.com\/([^\/]+)\/([^\/]+)\/(?:blob\/([^\/]+)\/)?([^?#]+)/;
    const match = notebookLink.match(regex);
    if (match) {
        const username = match[1];
        const repository = match[2];
        const branch = match[3];
        const file = match[4];
        const notebookHost = 'https://nbviewer.org/github/' + username + '/' + repository + '/blob/' + branch + '/' + file;
        loadFile(notebookHost, 'jupyter');
    }
}

function loadFile(file, filetype) {
    window.location.href = 'wrapper.html?' + filetype + '=' + file;
}

function openLink(link, newPage=true){
    window.open(link,'_blank')
}