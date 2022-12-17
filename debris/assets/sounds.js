export const sound = {
  pop() {
    new Audio('./assets/pop.mp3').play()
  },

  explosion() {
    new Audio('./assets/explosion.wav').play()
  },

  award() {
    const audio = new Audio('./assets/award2.mp3')
    audio.volume = 0.1
    audio.play()
  },

  release() {
    const audio = new Audio('./assets/release.mp3')
    audio.volume = 0.25
    audio.play()
  }
}
