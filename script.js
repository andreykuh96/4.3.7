const input = document.querySelector(".wrapper__input");
const listItems = document.querySelectorAll(".list__item");
const list = document.querySelector(".list");

async function fetchRepositories(repoName) {
	try {
		if (!repoName) {
			return [];
		}

		const response = await fetch(
			`https://api.github.com/search/repositories?q=${repoName}&per_page=5`
		);
		const data = await response.json();

		return data.items;
	} catch (e) {
		console.log(e);
	}
}

function debounce(fn, debounceTime) {
	let timeout;

	return function () {
		const fnCall = () => fn.apply(this, arguments);

		clearTimeout(timeout);

		timeout = setTimeout(fnCall, debounceTime);
	};
}

async function updateDropDown(e) {
	const data = await fetchRepositories(e.target.value);
	const dropDownList = document.querySelector(".drop-down");

	dropDownList.innerHTML = "";

	data.forEach((repo) => {
		const li = document.createElement("li");
		li.classList.add("drop-down__item");
		li.textContent = `${repo.name}`;
		dropDownList.appendChild(li);

		li.addEventListener("click", () => {
			createList(repo.name, repo.owner.login, repo.forks_count);
			input.value = "";
			dropDownList.innerHTML = "";
		});
	});
}

function createList(name, owner, stars) {
	const listItem = document.createElement("li");
	listItem.classList.add("list__item");

	listItem.innerHTML = `
        <div class="list__about">
            <div class="list__name">Name: ${name}</div>
            <div class="list__owner">Owner: ${owner}</div>
        <div class="list__stars">Stars: ${stars}</div>
        </div>
        <div class="list__btn"></div>
    `;
	list.appendChild(listItem);
}

updateDropDown = debounce(updateDropDown, 500);

input.addEventListener("keyup", (e) => updateDropDown(e));

list.addEventListener("click", (e) => {
	const target = e.target;

	if (target.classList.contains("list__btn")) {
		const listItem = target.closest(".list__item");

		if (listItem) {
			listItem.remove();
		}
	}
});
