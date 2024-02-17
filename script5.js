async function getRepositories() {
    var username = document.getElementById("githubUsername").value;

    if (username.trim() === "") {
        alert("GitHub Username is required.");
        return;
    }

    try {
        var apiUrl = `https://api.github.com/users/${username}/repos?per_page=100`;
        var repositories = await fetchData(apiUrl);

        displayRepositories(repositories);
    } catch (error) {
        console.error("Error fetching repositories:", error);
    }
}

function displayRepositories(repositories) {
    var repositoriesList = document.getElementById("repositoriesList");
    repositoriesList.innerHTML = "";

    if (repositories.length === 0) {
        repositoriesList.innerHTML = "<p>No repositories found for the provided username.</p>";
    } else {
        repositories.forEach(function (repo) {
            var repositoryDiv = document.createElement("div");
            repositoryDiv.classList.add("repository");

            var repoContent ="RepositoryName :" + "<strong>" + repo.name + "</strong><br>";
            repoContent += "Description: " + (repo.description || "N/A") + "<br>";
            repoContent += "Language: " + (repo.language || "N/A") + "<br>";
            repoContent += "URL: <a href='" + repo.html_url + "' target='_blank'>" + repo.html_url + "</a><br>";
            repoContent += "<div>";
            repoContent += "<button onclick='viewRepositoryDetails(this)'>View Details</button>";
            repoContent += "<button onclick='hideRepositoryDetails(this)' disabled>Hide Details</button>";
            repoContent += "</div>";
            repoContent += "<div class='readme-content hidden'></div>";
            repoContent += "<div class='contents-list hidden'></div>";
            repositoryDiv.innerHTML = repoContent;
            repositoriesList.appendChild(repositoryDiv);
        });
    }
}

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

    repositoryDiv.querySelector('.readme-content').classList.add('hidden');
    repositoryDiv.querySelector('.contents-list').classList.add('hidden');
    repositoryDiv.classList.remove('details-shown');
    repositoryDiv.querySelector('button[onclick="viewRepositoryDetails(this)"]').disabled = false;
    repositoryDiv.querySelector('button[onclick="hideRepositoryDetails(this)"]').disabled = true;
}

async function fetchData(url) {
    var response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Failed to fetch data. Status: ${response.status}`);
    }

    return await response.json();
}
