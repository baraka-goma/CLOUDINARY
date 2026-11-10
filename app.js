const images = [
  {
    filename: "me.jpg",
    url: "https://res.cloudinary.com/fzezwnv1/image/upload/v1794312105/me.jpg",
  },
  {
    filename: "bk.jpg",
    url: "https://res.cloudinary.com/fzezwnv1/image/upload/v1794312104/bk.jpg",
  },
  {
    filename: "me4.jpg",
    url: "https://res.cloudinary.com/fzezwnv1/image/upload/v1794312102/me4.jpg",
  },
  {
    filename: "me3.jpg",
    url: "https://res.cloudinary.com/fzezwnv1/image/upload/v1794312102/me3.jpg",
  },
  {
    filename: "me1.jpg",
    url: "https://res.cloudinary.com/fzezwnv1/image/upload/v1794312102/me1.jpg",
  },
  {
    filename: "me2.jpg",
    url: "https://res.cloudinary.com/fzezwnv1/image/upload/v1794312102/me2.jpg",
  },
  {
    filename: "me5.jpg",
    url: "https://res.cloudinary.com/fzezwnv1/image/upload/v1794312101/me5.jpg",
  },
];

const gallery = document.querySelector("#gallery-grid");
const search = document.querySelector("#search");
const resultCount = document.querySelector("#result-count");
const emptyState = document.querySelector("#empty-state");
const dialog = document.querySelector("#image-dialog");
const dialogImage = document.querySelector("#dialog-image");
const dialogKicker = document.querySelector("#dialog-kicker");
const dialogTitle = document.querySelector("#dialog-title");
const dialogUrl = document.querySelector("#dialog-url");
const imageCounter = document.querySelector("#image-counter");
const copyButton = document.querySelector("#copy-url");
const downloadLink = document.querySelector("#download-image");
const actionStatus = document.querySelector("#action-status");
let activeImage = null;

function createCard(image, index) {
  const card = document.createElement("button");
  card.className = "photo-card";
  card.type = "button";
  card.setAttribute("aria-label", `Ouvrir les détails de ${image.filename}`);
  card.dataset.filename = image.filename.toLowerCase();
  card.innerHTML = `
    <span class="photo-frame">
      <img src="${image.url}" alt="Image ${image.filename}" loading="lazy" decoding="async">
      <span class="photo-number">0${index + 1} / 07</span>
      <span class="photo-open">VOIR LA PHOTO
        <svg aria-hidden="true" viewBox="0 0 16 16"><path d="M3 8h10m-4-4 4 4-4 4"></path></svg>
      </span>
    </span>
    <span class="photo-meta">
      <span class="photo-title">${image.filename}</span>
      <span class="photo-type">Cloudinary · JPG</span>
    </span>
  `;
  card.addEventListener("click", () => openImage(image, index));
  return card;
}

function renderGallery(query = "") {
  const normalizedQuery = query.trim().toLocaleLowerCase("fr");
  const matches = images
    .map((image, index) => ({ image, index }))
    .filter(({ image }) => image.filename.toLocaleLowerCase("fr").includes(normalizedQuery));

  gallery.replaceChildren(...matches.map(({ image, index }) => createCard(image, index)));
  resultCount.textContent = `${String(matches.length).padStart(2, "0")} ${matches.length > 1 ? "IMAGES" : "IMAGE"}`;
  emptyState.hidden = matches.length > 0;
}

function openImage(image, index) {
  activeImage = image;
  dialogImage.src = image.url;
  dialogImage.alt = `Image ${image.filename}`;
  dialogKicker.textContent = `COLLECTION 01 · IMAGE ${String(index + 1).padStart(2, "0")}`;
  dialogTitle.textContent = image.filename;
  dialogUrl.href = image.url;
  dialogUrl.textContent = image.url;
  imageCounter.textContent = `${String(index + 1).padStart(2, "0")} / 07`;
  downloadLink.href = image.url.replace("/image/upload/", "/image/upload/fl_attachment/");
  downloadLink.download = image.filename;
  actionStatus.textContent = "";
  actionStatus.removeAttribute("data-error");
  copyButton.querySelector("span").textContent = "Copier l’URL";
  dialog.showModal();
}

search.addEventListener("input", () => renderGallery(search.value));

document.querySelector("#dialog-close").addEventListener("click", () => dialog.close());

dialog.addEventListener("click", (event) => {
  if (event.target === dialog) {
    dialog.close();
  }
});

copyButton.addEventListener("click", async () => {
  if (!activeImage) {
    return;
  }

  try {
    await navigator.clipboard.writeText(activeImage.url);
    copyButton.querySelector("span").textContent = "URL copiée";
    actionStatus.textContent = "Le lien Cloudinary a été copié.";
    actionStatus.removeAttribute("data-error");
  } catch (error) {
    actionStatus.textContent = "Copie impossible dans ce navigateur. Sélectionnez l’URL affichée ci-dessus.";
    actionStatus.dataset.error = "true";
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "/" && document.activeElement !== search && !dialog.open) {
    event.preventDefault();
    search.focus();
  }
});

renderGallery();
