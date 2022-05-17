import './css/styles.css';
import './css/country-list.css';
import './css/country-info.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import API from '../src/js/fetchCountries';
import countryListTpl from '../src/templates/country-list.hbs';
import countryInformationTpl from '../src/templates/country-info.hbs';

const refs = {
    inputField: document.querySelector('input#search-box'),
    countryList: document.querySelector('ul.country-list'),
    countryInformation: document.querySelector('div.country-info'),
};

const DEBOUNCE_DELAY = 300;

refs.inputField.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY))


function onInput(event) {
    const searchQuery = event.target.value.trim();

    if (searchQuery === "") {
        clearAll();
        return;
    };

    API.fetchCountries(searchQuery)
        .then(countryList)
        .catch(noSuchCountry)
}

function clearAll() {
    refs.countryList.innerHTML = "";
    refs.countryInformation.innerHTML = "";
}

function countryList(countries) {
    const list = countryListTpl(countries);
    refs.countryList.innerHTML = list;
    refs.countryInformation.innerHTML = "";

    if (countries.length > 10) {
        refs.countryList.innerHTML = "";
        Notify.info("Too many matches found. Please enter a more specific name");
    };
    
    if (countries.length === 1) {
        refs.countryList.innerHTML = "";
        countryInformation(countries);
    };
};

function countryInformation(country) {
    const markup = countryInformationTpl(country);
    refs.countryInformation.innerHTML = markup;

    // Adding space between numbers in population
    const population = document.querySelector('span.country-info__population');
    population.textContent = Number(population.textContent).toLocaleString();
};

function noSuchCountry() {
    refs.countryList.innerHTML = "";
    refs.countryInformation.innerHTML = "";
    Notify.failure("Oops, there is no country with that name");
}