/* global C2D */
window.tools.smile = {
  name: ':)',
  icon: '/images/smile-icon.png',
  state: {
    selected: false,
    mousePressed: false
  },
  events: {
    mousedown: function () {
      const state = window.tools.smile.state
      state.mousePressed = true
    },
    mouseup: function () {
      const state = window.tools.smile.state
      state.mousePressed = false
    },
    mousemove: function (e) {
      const state = window.tools.smile.state
      if (state.selected && state.mousePressed) {
        const mouse = C2D.eventToMouse(e)

        const fill1 = C2D.fill
        const stroke1 = C2D.stroke
        const width = (C2D.ctx.lineWidth) * 5

        C2D.setColors(fill1, fill1)
        C2D.ellipse(mouse.x, mouse.y, width * 1.05)

        C2D.setColors(stroke1, stroke1)
        C2D.ellipse(mouse.x, mouse.y, width) // face

        C2D.setColors(fill1, fill1)
        C2D.ellipse(mouse.x, mouse.y + (width / 5), width / 1.8, width / 1.9) // innermouth
        C2D.ellipse(mouse.x, mouse.y + (width / 5), width / 1.8, width / 1.9) // inner mouth

        C2D.setColors(stroke1, stroke1)
        C2D.ellipse(mouse.x, mouse.y, (width * 0.7), (width * 0.4)) // outer mouth

        C2D.setColors(fill1, fill1)
        C2D.ellipse(mouse.x + (width / 2.75), mouse.y - (width / 5), width / 13, width / 7) // eyes
        C2D.ellipse(mouse.x - (width / 2.75), mouse.y - (width / 5), width / 13, width / 7)

        C2D.setColors(fill1, stroke1)
      }
    }
  }
}
