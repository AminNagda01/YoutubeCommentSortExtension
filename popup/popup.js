var inputElement = document.getElementById('nameInput');
inputElement.addEventListener('input', updateGreeting);

function updateGreeting() {
    // Get the input element and the greeting element
    var ourName = inputElement.value;
    var greetElement = document.getElementById('greetingText');

    // Update the greeting element with the new text
    greetElement.textContent = "Hello " + ourName;
}