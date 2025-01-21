// Når nettsiden er ferdig lastet, start koden.
// Dette sikrer at HTML-elementene er klare før vi prøver å bruke dem.
document.addEventListener('DOMContentLoaded', () => {

    // Finn skjemaet (feedback-form) og listen for tilbakemeldinger (feedback-list).
    const form = document.getElementById('feedback-form');
    const feedbackList = document.getElementById('feedback-list');

    // Hent tidligere tilbakemeldinger fra serveren.
    // Bruker fetch for å sende en GET-forespørsel til "/feedback".
    fetch('/feedback')
        .then(res => res.json()) // Gjør svaret fra serveren om til JSON-data.
        .then(data => data.forEach(([name, email, message]) => {
            // Gå gjennom hver tilbakemelding (navn, e-post, melding) og legg den til listen.
            feedbackList.innerHTML += `<li>${name} (${email}): ${message}</li>`;
        }));

    // Når brukeren sender inn skjemaet:
    form.addEventListener('submit', e => {
        e.preventDefault(); // Hindrer at siden oppdateres.

        // Hent data fra skjemaet (navn, e-post, melding).
        const { name, email, message } = Object.fromEntries(new FormData(form));

        // Send data til serveren med en POST-forespørsel.
        fetch('/feedback', {
            method: 'POST', // Forteller serveren at vi sender ny data.
            headers: { 'Content-Type': 'application/json' }, // Dataformatet er JSON.
            body: JSON.stringify({ name, email, message }) // Gjør skjema-data om til JSON-format.
        })
        .then(res => res.json()) // Gjør serverens svar til JSON.
        .then(data => {
            // Vis en melding fra serveren (f.eks. "Takk for tilbakemeldingen!").
            alert(data.message);

            // Legg den nye tilbakemeldingen til listen.
            feedbackList.innerHTML += `<li>${name} (${email}): ${message}</li>`;

            // Tøm skjemaet så det er klart for ny tilbakemelding.
            form.reset();
        });
    });

});
