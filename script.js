function displayRepositories(repositories) {
    var repositoriesList = document.getElementById("repositoriesList");
    repositoriesList.innerHTML = "";

    if (repositories.length === 0) {
        repositoriesList.innerHTML = "<p>No repositories found for the provided username.</p>";
    } else {
        repositories.forEach(function (repo) {
            var repositoryDiv = document.createElement("div");
            repositoryDiv.classList.add("repository");
            var repoNameElement = document.createElement("strong");
            repoNameElement.style.color = "red";
            repoNameElement.innerText = repo.name;
            var repoContent = "<br>Description: " + (repo.description || "N/A") + "<br>";
            repoContent += "Language: " + (repo.language || "N/A") + "<br>";
            repoContent += "URL: <a href='" + repo.html_url + "' target='_blank'>" + repo.html_url + "</a><br>";
            repoContent += "<div>";
            repoContent += "<button onclick='viewRepositoryDetails(this)'>View Details</button>";
            repoContent += "<button onclick='hideRepositoryDetails(this)' disabled>Hide Details</button>";
            repoContent += "</div>";
            repoContent += "<div class='readme-content hidden'></div>";
            repoContent += "<div class='contents-list hidden'></div>";
            repositoryDiv.appendChild(repoNameElement);
            repositoryDiv.innerHTML += repoContent;
            repositoriesList.appendChild(repositoryDiv);
        });
    }
}
