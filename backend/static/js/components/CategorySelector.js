/*
    Category Selector Component

    USE: Used to display a selector for the category of the question on the admin page
    AUTHOR: Bailey Clark
    DATE: 10/04/2026
*/
export function CategorySelector(categories, selectedCategory, onSelectCategory) {
    const wrapper = document.createElement("section");
    wrapper.classList.add("admin-form__section");

    const label = document.createElement("h4");
    label.classList.add("admin-form__label");
    label.textContent = "Choose category";

    const row = document.createElement("div");
    row.classList.add("admin-form__categories");

    categories.forEach((category) => {
        const button = document.createElement("button");
        button.type = "button";
        button.classList.add("admin-chip");
        if (category === selectedCategory) {
            // Visual highlight shows the category currently being edited.
            button.classList.add("admin-chip--active");
        }
        button.textContent = category;
        button.addEventListener("click", () => onSelectCategory(category));
        row.appendChild(button);
    });

    wrapper.appendChild(label);
    wrapper.appendChild(row);
    return wrapper;
}
