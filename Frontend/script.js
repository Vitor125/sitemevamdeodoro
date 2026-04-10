const CHURCH_INFO = {
  name: "MEVAM Rio Deodoro",
  address: "Estrada Marechal Alencastro, 550 A - Deodoro, Rio de Janeiro - RJ",
  mapQuery: "Estrada Marechal Alencastro, 550 A - Deodoro, Rio de Janeiro - RJ",
  whatsappNumber: "5521970393163",
  whatsappMessage: "Olá! Escaneei o QR code da MEVAM Rio Deodoro e gostaria de receber mais informações.",
  formsUrl: "https://forms.gle/WPBE4dC52yJAsZpW6",
  footerNote: "Domingos às 09:00 e às 18:30."
};

const THEME_STORAGE_KEY = "mevam-theme";

function readStoredTheme() {
  try {
    return localStorage.getItem(THEME_STORAGE_KEY);
  } catch (error) {
    return null;
  }
}

function saveTheme(theme) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch (error) {
    return;
  }
}

function buildWhatsAppLink() {
  return `https://wa.me/${CHURCH_INFO.whatsappNumber}?text=${encodeURIComponent(CHURCH_INFO.whatsappMessage)}`;
}

function buildMapLink() {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CHURCH_INFO.mapQuery)}`;
}

function buildMapEmbed() {
  return `https://www.google.com/maps?q=${encodeURIComponent(CHURCH_INFO.mapQuery)}&output=embed`;
}

function disableLink(element, label) {
  element.href = "#";
  element.classList.add("is-disabled");
  element.setAttribute("aria-disabled", "true");

  if (label) {
    element.textContent = label;
  }
}

function getPreferredTheme() {
  const savedTheme = readStoredTheme();

  if (savedTheme === "light" || savedTheme === "dark") {
    return savedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function updateThemeToggleLabels(theme) {
  const nextLabel = theme === "dark" ? "Modo claro" : "Modo escuro";

  document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
    button.setAttribute("aria-pressed", String(theme === "dark"));
    button.setAttribute("aria-label", `Ativar ${nextLabel.toLowerCase()}`);
  });

  document.querySelectorAll("[data-theme-toggle-label]").forEach((label) => {
    label.textContent = nextLabel;
  });
}

function applyTheme(theme, shouldPersist = true) {
  document.documentElement.setAttribute("data-theme", theme);
  updateThemeToggleLabels(theme);

  if (shouldPersist) {
    saveTheme(theme);
  }
}

function initThemeToggle() {
  const currentTheme = getPreferredTheme();
  applyTheme(currentTheme, false);

  document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      const nextTheme =
        document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";

      applyTheme(nextTheme);
    });
  });
}

function applyChurchLinks() {
  document.querySelectorAll("[data-whatsapp-link]").forEach((link) => {
    if (CHURCH_INFO.whatsappNumber) {
      link.href = buildWhatsAppLink();
      return;
    }

    disableLink(link, "Adicionar WhatsApp");
  });

  document.querySelectorAll("[data-map-link]").forEach((link) => {
    link.href = buildMapLink();
  });

  document.querySelectorAll("[data-forms-link]").forEach((link) => {
    if (CHURCH_INFO.formsUrl) {
      link.href = CHURCH_INFO.formsUrl;
      return;
    }

    disableLink(link, "Formulário em atualização");
  });

  const addressLabel = document.querySelector("[data-address-label]");
  if (addressLabel) {
    addressLabel.textContent = CHURCH_INFO.address;
  }

  const mapEmbed = document.querySelector("[data-map-embed]");
  if (mapEmbed) {
    mapEmbed.src = buildMapEmbed();
  }

  const footerNote = document.getElementById("footer-note");
  if (footerNote) {
    footerNote.textContent = CHURCH_INFO.footerNote;
  }
}

initThemeToggle();
applyChurchLinks();
