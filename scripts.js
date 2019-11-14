const API_URL = 'https://apis.is/company?name=';

/**
 * Leit að fyrirtækjum á Íslandi gegnum apis.is
 */
const program = (() => {
  let companies;

  function init(_companies) {
    companies = _companies;
    const form = companies.querySelector("form");
    form.addEventListener("submit", search);
  }

  function loading()
  {
    var node = document.querySelector(".results");
    while (node.firstChild) {
      node.removeChild(node.firstChild);
    }

    const loadDiv = document.createElement("div");
    loadDiv.classList.add("loading");
    const loadGif = document.createElement("img");
    loadGif.src = "loading.gif";
    const loadMsg = document.createElement("p");
    loadMsg.textContent = "Leita að fyrirtækjum...";

    loadDiv.appendChild(loadGif);
    loadDiv.appendChild(loadMsg);

    node.appendChild(loadDiv);
  }

  function search(e)
  {
    e.preventDefault();
    const companyName = e.target.querySelector('input').value;
    if(companyName.length > 0  && /\S/.test(companyName))
    {
      fetchData(companyName);
    }
    else
    {
      errorMessage("Lén verður að vera strengur");
    }
  }

  function fetchData(companyName)
  {
    const url = API_URL + companyName;
    fetch(url)
      .then((result) => {
        if (result.ok) {
          return result.json();
        }
        throw new Error();
      })
      .then((data) => {addData(data.results);})
      .catch(() => {errorMessage("Villa við að sækja gögn.");});
  }

  function addData(data)
  {
    if (data.length === 0)
    {
      errorMessage("Ekkert fyrirtæki fannst fyrir leitarstreng");
      return;
    }

    var node = document.querySelector(".results");
    while (node.firstChild) {
      node.removeChild(node.firstChild);
    }

    const resultNode = document.createElement("div");
    resultNode.classList.add("company");

    data.forEach((obj) => {
      const resultDiv = document.createElement("div");
      resultDiv.classList.add("company");
      const dList = document.createElement("dl");
      const dtName = document.createElement("dt");
      dtName.textContent = "Nafn:";
      const ddName = document.createElement("dd");
      ddName.textContent = obj.name;
      const dtSnumber = document.createElement("dt");
      dtSnumber.textContent = "Kennitala:";
      const ddSnumber = document.createElement("dd");
      ddSnumber.textContent = obj.sn;

      dList.appendChild(dtName);
      dList.appendChild(ddName);
      dList.appendChild(dtSnumber);
      dList.appendChild(ddSnumber);

      if(obj.active === 1)
      {
        resultDiv.classList.add("company--active");
        const dtAddress = document.createElement("dt");
        dtAddress.textContent = "Heimilisfang:";
        const ddAddress = document.createElement("dd");
        ddAddress.textContent = obj.address;
        dList.appendChild(dtAddress);
        dList.appendChild(ddAddress);
      }
      else
      {
        resultDiv.classList.add("company--inactive");
      }

      resultDiv.appendChild(dList);
      node.appendChild(resultDiv);
    });
  }

  function errorMessage(error)
  {
    var node = document.querySelector(".results");
    while (node.firstChild) {
      node.removeChild(node.firstChild);
    }
    alert(error);
  }

  return {
    init,
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  const companies = document.querySelector('section');
  program.init(companies);
});
