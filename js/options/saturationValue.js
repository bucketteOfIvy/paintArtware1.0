window.options.saturationValue = {
  name: 'saturation value',
  state: {
    saturation: 50
  },
  run: function () {
    const saturation = window.options.saturationValue.state.saturation

    const div = document.createElement('div')
    div.innerHTML = `
      <style>
        .saturation-value {
          display: flex;
          align-items: center;
          margin: 0 10px;
        }

        .saturation-value > span {
          margin-right: 10px;
          width: 38px;
        }
      </style>

      <div class="saturation-value">
        <span>${saturation}</span>
        <input type="range" min="1" max="100" value="${saturation}">
      </div>
    `

    const span = div.querySelector('span')
    const slider = div.querySelector('input')
    slider.addEventListener('input', (e) => {
      const num = Number(e.target.value)
      window.options.saturationValue.state.saturation = num
      span.textContent = num
    })
    return div
  }
}
