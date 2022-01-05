const urlParams = new URLSearchParams(window.location.search);
if (!!urlParams.get("redirect")) {
  const string = urlParams.get("string");
  const year = parseInt(urlParams.get("year"));
  if (isSearchValid(string, year)) {
    const redirectUrl = getSearchPath(string, year);
    window.location.href = new URL(
      `${window.location.protocol}/${window.location.hostname}${redirectUrl}`
    ).href;
  } else {
    window.location.pathname = "/";
  }
}

let searchStringInput;
let searchYearInput;
let searchButton;
let resultsContainer;

window.addEventListener("load", () => {
  searchStringInput = document.getElementById("search-string");
  searchYearInput = document.getElementById("search-year");
  searchButton = document.getElementById("search-submit");
  resultsContainer = document.getElementById("results");
  setUpYearInput();
  searchButton.addEventListener("click", onSearchSubmit);
  searchStringInput.addEventListener("keyup", onInputChange);
  searchYearInput.addEventListener("keyup", onInputChange);
  searchStringInput.addEventListener("keydown", onInputPotentialSubmit);
  searchYearInput.addEventListener("keydown", onInputPotentialSubmit);

  searchStringInput.focus();

  if (!!urlParams.get("q")) {
    const searchStringFromUrl = urlParams.get("q").split(" before:")[0];
    const searchYearFromUrl =
      parseInt(
        urlParams
          .get("q")
          .split("before:")[1]
          .split("-")[0]
      ) - 1;
    if (isSearchValid(searchStringFromUrl, searchYearFromUrl)) {
      searchStringInput.value = searchStringFromUrl;
      searchYearInput.value = searchYearFromUrl;
      searchButton.disabled = false;
      resultsContainer.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest"
      });
    }
  }
});

function onSearchSubmit() {
  const { string, year } = getSearchParameters();
  if (!isSearchValid(string, year)) {
    return false;
  } else {
    window.location.href = getSearchPath(string, year);
  }
}

function onInputPotentialSubmit(e) {
  if (e.which == 13 || e.keyCode == 13) {
    onSearchSubmit();
  }
}

function onInputChange() {
  const { string, year } = getSearchParameters();
  searchButton.disabled = !isSearchValid(string, year);
}

function getSearchPath(string, year) {
  return encodeURI(
    `/?q=${string} ${getSearchCommandsBeforeAfterForYear(
      year
    )}`
  );
}

function getSearchParameters() {
  return {
    string: searchStringInput.value,
    year: parseInt(searchYearInput.value)
  };
}

function isSearchValid(string, year) {
  return !!string && !!year && !!string.length && !isNaN(year);
}

function setUpYearInput() {
  const currentYear = parseInt(new Date().getFullYear());
  searchYearInput.setAttribute("max", currentYear);
  searchYearInput.value = currentYear;
}

function getSearchCommandsBeforeAfterForYear(year) {
  if (!year) {
    return null;
  }
  return `before:${year + 1}-01-01 after:${year - 1}-12-31`;
}
