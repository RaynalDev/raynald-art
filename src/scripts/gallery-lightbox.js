const isDialogSupported = (dialog) =>
  typeof dialog.showModal === "function";

function lockScroll(lock) {
  document.documentElement.style.overflow = lock ? "hidden" : "";
}

function initReveal(thumbs) {
  const markVisible = (el) => el.classList.add("in");

  const revealInitial = () => {
    const viewportHeight = window.innerHeight;
    thumbs.forEach((thumb) => {
      const rect = thumb.getBoundingClientRect();
      if (rect.top < viewportHeight && rect.bottom > 0) {
        markVisible(thumb);
      }
    });
  };

  revealInitial();

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          markVisible(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    {
      rootMargin: "96px 0px",
      threshold: 0.05,
    }
  );

  thumbs.forEach((thumb) => observer.observe(thumb));
  window.addEventListener("resize", revealInitial, { passive: true });
  window.addEventListener("orientationchange", revealInitial, { passive: true });
}

function initLightbox(thumbs, dialog) {
  if (!thumbs.length || !dialog) return;

  const lbImg = dialog.querySelector("#lb-img");
  const lbCap = dialog.querySelector("#lb-cap");
  const btnPrev = dialog.querySelector(".prev");
  const btnNext = dialog.querySelector(".next");
  const btnClose = dialog.querySelector(".close");

  if (!lbImg || !lbCap || !btnPrev || !btnNext || !btnClose) return;

  const images = thumbs
    .map((thumb) => thumb.querySelector("img"))
    .filter(Boolean);

  let index = 0;

  const show = (idx) => {
    index = (idx + images.length) % images.length;
    const image = images[index];
    if (!image) return;
    lbImg.src = image.currentSrc || image.src;
    lbImg.alt = image.alt;
    lbCap.textContent = image.alt;
  };

  const open = (idx) => {
    show(idx);
    if (isDialogSupported(dialog)) {
      dialog.showModal();
    } else {
      dialog.setAttribute("open", "");
    }
    lockScroll(true);
  };

  const close = () => {
    if (isDialogSupported(dialog)) {
      dialog.close();
    } else {
      dialog.removeAttribute("open");
    }
    lockScroll(false);
  };

  thumbs.forEach((thumb, idx) =>
    thumb.addEventListener("click", () => {
      open(idx);
    })
  );

  btnPrev.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    show(index - 1);
  });

  btnNext.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    show(index + 1);
  });

  btnClose.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    close();
  });

  dialog.addEventListener("click", (event) => {
    const stage = dialog.querySelector(".stage");
    if (!stage) return;
    const rect = stage.getBoundingClientRect();
    const inside =
      event.clientX >= rect.left &&
      event.clientX <= rect.right &&
      event.clientY >= rect.top &&
      event.clientY <= rect.bottom;

    if (!inside) {
      close();
    }
  });

  window.addEventListener("keydown", (event) => {
    if (!dialog.open) return;
    switch (event.key) {
      case "Escape":
        close();
        break;
      case "ArrowLeft":
        show(index - 1);
        break;
      case "ArrowRight":
        show(index + 1);
        break;
    }
  });

  dialog.addEventListener("close", () => lockScroll(false));
}

if (typeof window !== "undefined") {
  const thumbs = Array.from(document.querySelectorAll(".gallery .thumb"));
  const dialog = document.querySelector("#lightbox");

  if (thumbs.length) {
    initReveal(thumbs);
  }
  if (dialog) {
    initLightbox(thumbs, dialog);
  }
}
