const API_KEY = 'fakVBChEWIvyd8d1W7gr93S3Hpc';
const API_URL = "https://ci-jshint.herokuapp.com/api";
const resultsModal = new bootstrap.Modal(document.getElementById('resultsModal'));

document.getElementById('status').addEventListener('click', e => getStatus(e));
document.getElementById('submit').addEventListener('click', e => postForm(e));

async function getStatus(e) {
    const queryString = `${API_URL}?api_key=${API_KEY}`;
    
    const response = await fetch(queryString);

    const data = await response.json();

    if (response.ok){
        displayStatus(data);
    } else {
        displayException(data);
        throw new Error(data.error);
    }
}

function displayStatus(data) {
    document.getElementById('resultsModalTitle').innerText = 'API Key Status';
    document.getElementById('results-content').innerHTML = `<p>Your key is valid until <br>${data.expiry}</p>`;

    resultsModal.show();
}

function proccesForm(form) {
    let optOptions = [];
    for (entry of form.entries()) {
        if (entry[0] === 'options') {
            optOptions.push(entry[1])
        }
    }

    form.delete('options');
    form.append('options', optOptions.join());

    return form
}

async function postForm(e) {
    const form = proccesForm(new FormData(document.getElementById('checksform')));
    const response = await fetch(API_URL, {
                        method: "POST",
                        headers: {
                                    "Authorization": API_KEY,
                                 },
                        body: form
                        });
    const data = await response.json();
    if (response.ok){
        displayResults(data);
    } else {
        displayException(data);
        throw new Error(data.error);
    }
    
}

function displayResults(data) {
    const heading = `<div class='header'>Results for ${data.file}</div>`;
    if (data.total_errors === 0) {
        results = `<div class='results'>There are no errors for ${data.file}</div>`
    } else {
        results = `<div class='results>Total errors: <span>${data.total_errors}</span></div>`;
        for (error of data.error_list){
            results += `<div>At line ${error.line}, column ${error.col}</div>`;
            results += `<div>${error.error}</div>`
        }
    }
    document.getElementById('resultsModalTitle').innerHTML = heading;
    document.getElementById('results-content').innerHTML = results;

    resultsModal.show();
}

function displayException(data) {
    let heading = `<div class='header'>An Exception Occurred</div>`;
    let results = `<div>API returne status code ${data.status_code}</div>`;
    results += `<div>Error Number: <span class='bold'>${data.error_no}</span></div>`;
    results += `<div>Error text: <span class='bold'>${data.error}</span></div>`;

    document.getElementById('resultsModalTitle').innerHTML = heading;
    document.getElementById('results-content').innerHTML = results;

    resultsModal.show();
}

