const form = document.querySelector("form");
const formInput = document.querySelector("form input");
const userContainer = document.querySelector(".user-container");
const ul = document.querySelector("ul");
const section = document.querySelector("section");
const userRepositoriesContainer = document.querySelector(
  ".user-repositories-container"
);

form.addEventListener("submit", (e) => {
  e.preventDefault();

  section.style.display = "flex";

  const user = formInput.value;
  getUser(user);
});

async function getUser(user) {
  await fetch(`https://api.github.com/users/${user}`)
    .then((response) => response.json())
    .then((response) => {
      if (response.login === undefined) {
        userContainer.style.display = "none";
        userContainer.innerHTML = "";
        userRepositoriesContainer.style.display = "none";
        ul.innerHTML = "";
        return;
      }
      createUser(response);
    });
}

function createUser(response) {
  getUserRepositories(response.repos_url);
  userContainer.style.display = "flex";
  userContainer.innerHTML = `
    <div class="user-1">
        <img src="${response.avatar_url}" class="user-avatar">
        <h1 class="user-login">
            <a href="${response.html_url}" target='_blank'>${response.login}</a>
        </h1>
    </div>
    <div class="user-2">
        <p>Followers : ${response.followers}</p>
        <p>Following : ${response.following}</p>
    </div>
    `;
}

async function getUserRepositories(url) {
  await fetch(url)
    .then((response) => response.json())
    .then((response) => {
      createUserRepositories(response);
    });
}

async function createUserRepositories(repositories) {
  if (repositories[0] == undefined) {
    userRepositoriesContainer.style.display = "none";
    ul.innerHTML = "";
    return;
  }
  userRepositoriesContainer.style.display = "flex";
  ul.innerHTML = `<h1>Repositories</h1>`;
  repositories.forEach((repository) => {
    ul.innerHTML += `
    <li class="user-repository">
        <a href="${repository.html_url}" target='_blank'>${repository.name}</a>
        <div class="user-repository-informations">
            <p class="user-repository-stars"><i class="far fa-star"></i> ${
              repository.stargazers_count
            }</p>
            <p class="user-repository-language">${
              repository.language !== null ? repository.language : ""
            }</p>
        </div>
    </li>
    `;
  });
}
