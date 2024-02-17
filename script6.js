async function viewRepositoryDetails(button) {
    var repositoryDiv = button.parentElement.parentElement;
    var username = document.getElementById("githubUsername").value;
    var repoName = repositoryDiv.querySelector("strong").innerText;

    if (repositoryDiv.classList.contains('details-shown')) {
        return;
    }

    var readmeUrl = `https://api.github.com/repos/${username}/${repoName}/readme`;
    var readmeInfo = await fetchData(readmeUrl);
    var readmeContent = atob(readmeInfo.content);
    repositoryDiv.querySelector('.readme-content').innerHTML = "<h2>README</h2><pre>" + readmeContent + "</pre>";

    var contentsUrl = `https://api.github.com/repos/${username}/${repoName}/contents`;
    var contentsInfo = await fetchData(contentsUrl);
    var contentsDiv = repositoryDiv.querySelector('.contents-list');
    if (contentsInfo.length === 0) {
        contentsDiv.innerHTML = "<p>No files found.</p>";
    } else {
        contentsDiv.innerHTML = "<h2>Files</h2><ul>";
        contentsInfo.forEach(function (content) {
            contentsDiv.innerHTML += "<li><strong>" + content.name + "</strong></li>";
        });
        contentsDiv.innerHTML += "</ul>";
    }

    repositoryDiv.querySelector('.readme-content').classList.remove('hidden');
    repositoryDiv.querySelector('.contents-list').classList.remove('hidden');
    repositoryDiv.classList.add('details-shown');
    repositoryDiv.querySelector('button[onclick="viewRepositoryDetails(this)"]').disabled = true;
    repositoryDiv.querySelector('button[onclick="hideRepositoryDetails(this)"]').disabled = false;
}

function hideRepositoryDetails(button) {
    var repositoryDiv = button.parentElement.parentElement;
    repositoryDiv.querySelector('.readme-content').innerHTML = "";
    repositoryDiv.querySelector('.contents-list').innerHTML = "";
    repositoryDiv.querySelector('.readme-content').classList.add('hidden');
    repositoryDiv.querySelector('.contents-list').classList.add('hidden');
    repositoryDiv.classList.remove('details-shown');
    repositoryDiv.querySelector('button[onclick="viewRepositoryDetails(this)"]').disabled = false;
    repositoryDiv.querySelector('button[onclick="hideRepositoryDetails(this)"]').disabled = true;
}
