export function ImagePickerGrid(images, selectedImageIndex, onSelectImage) {
    const wrapper = document.createElement("section");
    wrapper.classList.add("admin-form__section");

    const label = document.createElement("h4");
    label.classList.add("admin-form__label");
    label.textContent = "Choose Image";

    const grid = document.createElement("div");
    grid.classList.add("image-grid");

    images.forEach((image, index) => {
        const button = document.createElement("button");
        button.type = "button";
        button.classList.add("image-grid__item");
        if (index === selectedImageIndex) {
            button.classList.add("image-grid__item--active");
        }
        button.setAttribute("aria-label", `Select image ${index + 1}`);

        const imageElement = document.createElement("img");
        imageElement.src = image;
        imageElement.alt = `Image option ${index + 1}`;
        imageElement.classList.add("image-grid__img");

        button.appendChild(imageElement);
        button.addEventListener("click", () => onSelectImage(index));
        grid.appendChild(button);
    });

    wrapper.appendChild(label);
    wrapper.appendChild(grid);
    return wrapper;
}
