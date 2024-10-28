function loadContent() {
    const urlParams = new URLSearchParams(window.location.search);
    const project = urlParams.get('project');
    const notebook = urlParams.get('notebook');
    const projectContent = document.getElementById('content');

    if (project) {
        const iframe = document.createElement('iframe');
        iframe.classList.add('rendered-iframe')
        iframe.src = project;
        projectContent.appendChild(iframe);
    } else if (notebook) {
        const notebookUrl = `https://mybinder.org/v2/gh/user/repo/branch?urlpath=notebooks/${notebook}`;
        const iframe = document.createElement('iframe');
        iframe.classList.add('rendered-iframe')
        iframe.src = notebookUrl;
        projectContent.appendChild(iframe);
    } else {
        projectContent.innerHTML = '<p>No project or notebook selected.</p>';
    }
}

window.onload = loadContent;