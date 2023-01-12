export default {
  pop() {
    const audio = new Audio('./assets/sound/reload.mp3')
    audio.volume = 0.25
    audio.play()
  },

  explosion() {
    const audio = new Audio('./assets/sound/explosion.wav')
    audio.volume = 0.7
    audio.play()
  },

  award() {
    const audio = new Audio('./assets/sound/reload.mp3')
    audio.volume = 0.25
    audio.play()
  },

  shoot() {
    const audio = new Audio('./assets/sound/shoot.wav')
    audio.volume = 0.1
    audio.play()
  }
}
