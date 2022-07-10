const start = (num) => {
  if (num === 3) {
    const content = document.querySelector('.content')
    const spinner = document.querySelector('#spinner')
    content.classList.toggle('hidden')
    spinner.classList.toggle('hidden')
  }
  console.log(num);
}