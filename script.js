const searchInput = document.getElementById("searchInput");
const resultDiv = document.getElementById("result");
const statusDiv = document.getElementById("status");


function debounce(func, delay) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
}


async function fetchUser(username) {
  if (!username) {
    resultDiv.innerHTML = "";
    statusDiv.textContent = "";
    return;
  }

  statusDiv.textContent = "Loading...";
  resultDiv.innerHTML = "";

  try {
    const response = await fetch(`https://api.github.com/users/${username}`);

    if (!response.ok) {
      throw new Error("User not found");
    }

    const data = await response.json();

    statusDiv.textContent = "";

    resultDiv.innerHTML = `
      <img src="${data.avatar_url}" alt="User Avatar" />
      <h2>${data.name || data.login}</h2>
      <p>Public Repos: ${data.public_repos}</p>
      <p>Followers: ${data.followers}</p>
      <a href="${data.html_url}" target="_blank">View Profile</a>
    `;
  } catch (error) {
    statusDiv.textContent = "❌ User not found or API error";
  }
}

const debouncedSearch = debounce((e) => {
  fetchUser(e.target.value.trim());
}, 500);

searchInput.addEventListener("input", debouncedSearch);
