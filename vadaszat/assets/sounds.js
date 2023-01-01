export const sound = {
  pop() {
    const audio = new Audio('./assets/sound/pop.wav')
    audio.volume = 0.25
    audio.play()
  },

  explosion() {
    new Audio('./assets/sound/explosion.wav').play()
  },

  award() {
    const audio = new Audio('./assets/sound/award3.mp3')
    audio.volume = 0.5
    audio.play()
  },

  shoot() {
    const audio = new Audio('./assets/sound/shoot.wav')
    audio.volume = 0.1
    audio.play()
  }
}
