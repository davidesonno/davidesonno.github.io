function renderIFrame() {
    const urlParams = new URLSearchParams(window.location.search);
    const html = urlParams.get('html');
    const jupyter = urlParams.get('jupyter');
    const projectContent = document.getElementById('content');

    if (html) {
        const iframe = document.createElement('iframe');
        iframe.classList.add('rendered-iframe')
        iframe.src = html;
        projectContent.appendChild(iframe);
    } else if (jupyter) {
        const iframe = document.createElement('iframe');
        iframe.classList.add('rendered-iframe')
        iframe.src = jupyter;
        projectContent.appendChild(iframe);
    } else {
        projectContent.innerHTML = '<p>No project or notebook selected.</p>';
    }
}

function addRepoHref(){
// add on the header the link to the repo on github
}

function initPage(){
    addRepoHref();
    renderIFrame();
}

window.onload = initPage;