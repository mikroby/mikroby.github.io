let counter = 0
const start = (num) => {
  console.log(num);
  counter++
  if (counter === 3) {
    const content = document.querySelector('#content')
    const spinner = document.querySelector('#spinner')
    content.classList.toggle('hidden')
    spinner.classList.toggle('hidden')
    console.log(content);
  }
}