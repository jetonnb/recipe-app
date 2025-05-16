let recipes = JSON.parse(localStorage.getItem("recipes")) || [];
let editIndex = null;
let deleteIndex = null;
let apiRecipes = []; // për të ruajtur recetat nga API

document.getElementById("recipeForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const category = document.getElementById("category").value;
  const time = document.getElementById("time").value;
  const ingredients = document.getElementById("ingredients").value;

  const recipe = { name, category, time, ingredients };

  if (editIndex === null) {
    recipes.push(recipe);
  } else {
    recipes[editIndex] = recipe;
    editIndex = null;
  }

  localStorage.setItem("recipes", JSON.stringify(recipes));
  this.reset();
  renderRecipes();
});

function renderRecipes(filter = "") {
  const container = document.getElementById("recipesContainer");
  container.innerHTML = "";

  recipes
    .filter((r) => r.name.toLowerCase().includes(filter.toLowerCase()))
    .forEach((recipe, index) => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <h3>${recipe.name}</h3>
        <p><strong>Kategoria:</strong> ${recipe.category}</p>
        <p><strong>Koha:</strong> ${recipe.time} min</p>
        <p><strong>Përbërësit:</strong> ${recipe.ingredients}</p>
        <button class="edit-btn" onclick="editRecipe(${index})">Edito</button>
        <button class="delete-btn" onclick="deleteRecipe(${index})">Fshi</button>
      `;
      container.appendChild(card);
    });
}

function editRecipe(index) {
  const recipe = recipes[index];
  document.getElementById("name").value = recipe.name;
  document.getElementById("category").value = recipe.category;
  document.getElementById("time").value = recipe.time;
  document.getElementById("ingredients").value = recipe.ingredients;
  editIndex = index;

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });

  const form = document.getElementById("recipeForm");
  form.classList.add("highlight");
  setTimeout(() => form.classList.remove("highlight"), 2000);
}

function deleteRecipe(index) {
  deleteIndex = index;
  document.getElementById("confirmModal").style.display = "flex";
}

document.getElementById("confirmYes").addEventListener("click", () => {
  if (deleteIndex !== null) {
    recipes.splice(deleteIndex, 1);
    localStorage.setItem("recipes", JSON.stringify(recipes));
    renderRecipes();
    deleteIndex = null;
  }
  document.getElementById("confirmModal").style.display = "none";
});

document.getElementById("confirmNo").addEventListener("click", () => {
  deleteIndex = null;
  document.getElementById("confirmModal").style.display = "none";
});

document.getElementById("searchInput").addEventListener("input", function () {
  renderRecipes(this.value);
});

function fetchAPIRecipes() {
  fetch("https://dummyjson.com/recipes?limit=10")
    .then((res) => res.json())
    .then((data) => {
      apiRecipes = data.recipes; // Ruaj recetat për filtrim
      renderAPIRecipes(); // Shfaq fillimisht të gjitha
    })
    .catch((err) => console.error("Gabim me API:", err));
}
function renderAPIRecipes(filter = "") {
  const container = document.getElementById("apiRecipesContainer");
  container.innerHTML = "";

  apiRecipes
    .filter((recipe) =>
      recipe.name.toLowerCase().includes(filter.toLowerCase())
    )
    .forEach((recipe) => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <h3>${recipe.name}</h3>
        <p><strong>Kategoria:</strong> ${recipe.cuisine}</p>
        <p><strong>Koha:</strong> ${recipe.cookTimeMinutes} min</p>
        <p><strong>Përbërësit:</strong> ${recipe.ingredients.join(", ")}</p>
      `;
      container.appendChild(card);
    });
}
document
  .getElementById("searchApiInput")
  .addEventListener("input", function () {
    renderAPIRecipes(this.value);
  });

renderRecipes();
fetchAPIRecipes();
