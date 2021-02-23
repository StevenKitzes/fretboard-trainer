var audio = document.createElement('audio')
audio.src = 'bojack.mp3'

var button = document.createElement('button')
button.innerText = 'Play bojack!'

button.addEventListener('click', function () {
  if (audio.paused) {
    setTimeout(() => {
      audio.play()
      button.innerText = 'Pause'
    }, 3000)
  } else {
    audio.pause()
    button.innerText = 'Play!'
  }
})

document.body.appendChild(button)
