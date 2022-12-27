
var counter = 0;

function plus() {
  counter += 1;
  document.getElementById("counter").innerHTML = counter;
}
function minus() {
  if(counter > 0){
    counter -= 1;
  }
  document.getElementById("counter").innerHTML = counter;
}

const toggles = document.querySelectorAll('.faq-toggle')

toggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
        toggle.parentNode.classList.toggle('active')
    })
})