function validate() {
    const name = document.querySelector('form input[name="fullName"]').value;
    const email = document.querySelector('form input[name="email"]').value;
    const message = document.querySelector('form textarea[name="message"]').value;

    let result;

    if (!validateName(name)) {
        alert("A név legalább 5 karakter hosszúságú legyen, és nem lehet benne szám sem !");
        result = false;
    } else {
        if (!validateEmail(email)) {
            alert("Az email nem felel meg az 'abc@x.valami' formátumnak !");
            result = false;
        } else {
            if (!validateMessage(message)) {
                alert("Az üzenet legalább 20 karakter hosszúságú legyen !");
                result = false;
            } else {
                result = true;
            }
        }
    }
    return result;
}

function validateName(name) {
    const pattern = new RegExp('[0-9]');
    return (name.length < 5 || pattern.test(name)) ? false : true;
}

function validateEmail(email) {
    const atPlace = email.indexOf('@');
    return (atPlace > 2 && email.includes('.', atPlace + 1)) ? true : false;
}

function validateMessage(message) {
    return message.length >= 20 ? true : false;
}