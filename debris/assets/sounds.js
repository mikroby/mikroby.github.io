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
    audio.volume = 0.1
    audio.play()
  },

  release() {
    const audio = new Audio('./assets/sound/release.mp3')
    audio.volume = 0.3
    audio.play()
  },

  demolition() {
    const audio = new Audio('./assets/sound/demolition.wav')
    audio.volume = 0.3
    audio.play()
  }
}
