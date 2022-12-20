export const sound = {
  pop() {
    const audio = new Audio('./assets/pop.mp3')
    audio.volume = 0.25
    audio.play()
  },

  explosion() {
    new Audio('./assets/explosion.wav').play()
  },

  award() {
    const audio = new Audio('./assets/award3.mp3')
    audio.volume = 0.1
    audio.play()
  },

  release() {
    const audio = new Audio('./assets/release.mp3')
    audio.volume = 0.3
    audio.play()
  }
}
