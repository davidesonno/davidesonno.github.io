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
    window.location.href = 'wrapper.html?project=' + indexLink;
}