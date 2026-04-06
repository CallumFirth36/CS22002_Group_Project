export function ImagePickerGrid(
    images,
    selectedImageUrl,
    onSelectImage,
    statusText = "",
    searchConfig = null
) {
    const wrapper = document.createElement("section");
    wrapper.classList.add("admin-form__section");

    const label = document.createElement("h4");
    label.classList.add("admin-form__label");
    label.textContent = "Choose Image";

    const getImageUrl = (image) => (typeof image === "string" ? image : image.url);
    const getImageName = (image, index) => (typeof image === "string" ? `image ${index + 1}` : image.name);
    const getSearchText = (image, index) => {
        if (!searchConfig || !searchConfig.getSearchText) {
            return getImageName(image, index);
        }
        return searchConfig.getSearchText(image, index);
    };

    const empty = document.createElement("p");

    let searchInput = null;
    if (searchConfig) {
        searchInput = document.createElement("input");
        searchInput.type = "text";
        searchInput.classList.add("admin-input");
        searchInput.placeholder = searchConfig.placeholder || "Search images";
        searchInput.value = searchConfig.value || "";
        wrapper.appendChild(label);
        wrapper.appendChild(searchInput);
    } else {
        wrapper.appendChild(label);
    }

    const grid = document.createElement("div");
    grid.classList.add("image-grid");

    function getDisplayImages() {
        if (!searchConfig) {
            return images;
        }

        const query = (searchInput?.value || "").trim().toLowerCase();
        if (!query) {
            const maxDefaultResults = searchConfig.maxDefaultResults || images.length;
            return images.slice(0, maxDefaultResults);
        }

        return images.filter((image, index) => {
            const searchText = getSearchText(image, index);
            return String(searchText).toLowerCase().includes(query);
        });
    }

    function renderGrid() {
        const displayImages = getDisplayImages();
        grid.innerHTML = "";

        if (!displayImages.length) {
            empty.textContent = statusText || "No images available for this category.";
            wrapper.appendChild(empty);
            return;
        }

        if (empty.parentElement) {
            empty.remove();
        }

        displayImages.forEach((image, index) => {
            const imageUrl = getImageUrl(image);
            const imageName = getImageName(image, index);
            const button = document.createElement("button");
            button.type = "button";
            button.classList.add("image-grid__item");
            if (imageUrl === selectedImageUrl) {
                button.classList.add("image-grid__item--active");
            }
            button.setAttribute("aria-label", `Select ${imageName}`);

            const imageElement = document.createElement("img");
            imageElement.src = imageUrl;
            imageElement.alt = imageName;
            imageElement.classList.add("image-grid__img");

            const nameElement = document.createElement("span");
            nameElement.textContent = imageName;
            nameElement.style.display = "block";
            nameElement.style.marginTop = "0.4rem";
            nameElement.style.fontSize = "0.85rem";
            nameElement.style.textTransform = "capitalize";
            
            button.appendChild(imageElement);
            button.appendChild(nameElement);
            button.addEventListener("click", () => onSelectImage(imageUrl));
            grid.appendChild(button);
        });
    }

    if (searchInput) {
        searchInput.addEventListener("input", (event) => {
            if (searchConfig.onChange) {
                searchConfig.onChange(event.target.value);
            }
            renderGrid();
        });
    }

    renderGrid();
    wrapper.appendChild(grid);
    return wrapper;
}
