/*
  canvas2d.js

  this is a helper library for doing things with the HTML5 canvas element
  and the corresponding JavaScript Canvas API. It borrows many of the
  naming conventions from the popular/fantastic p5.js library. This
  library isn't meant to replace p5/processing, but is intead a "toy"
  library aimed at learning the native Canvas API as well as how
  JavaScript libraries are built.
*/

class C2D {
  static createCanvas (width, height) {
    const canvas = document.createElement('canvas')
    canvas.width = width || window.innerWidth
    canvas.height = height || window.innerHeight
    document.body.appendChild(canvas)

    this._font = {
      size: 48,
      family: 'serif',
      align: 'center',
      baseline: 'middle'
    }

    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#fff'
    ctx.strokeStyle = '#000'
    ctx.font = `${this._font.size}px ${this._font.family}`
    ctx.textAlign = this._font.align
    ctx.textBaseline = this._font.baseline

    if (!this.canvas) {
      this.canvas = canvas
      this.ctx = ctx
    }

    return { canvas, ctx }
  }

  static get width () {
    return this.canvas.width
  }

  static set width (v) {
    this.canvas.width = v
  }

  static get height () {
    return this.canvas.height
  }

  static set height (v) {
    this.canvas.height = v
  }

  static get fill () {
    return this.ctx.fillStyle
  }

  static set fill (v) {
    this.ctx.fillStyle = v
  }

  static get stroke () {
    return this.ctx.strokeStyle
  }

  static set stroke (v) {
    this.ctx.strokeStyle = v
  }

  static eventToMouse (e) {
    const offset = this.canvas.getBoundingClientRect()
    return {
      x: e.clientX - offset.x,
      y: e.clientY - offset.y
    }
  }

  // ~ Font Options ~

  // if someone makes a tool that rapidly updates font options (e.g. by
  // randomizing text size) then this should be cleaned up to be more
  // efficient
  static _updateFontOptions () {
    this.ctx.font = `${this._font.size}px ${this._font.family}`
    this.ctx.textAlign = `${this._font.align}`
    this.ctx.textBaseline = `${this._font.baseline}`
  }

  static get fontSize () {
    return this._font.size
  }

  static set fontSize (v) {
    this._font.size = v
    this._updateFontOptions()
  }

  static get fontFamily () {
    return this._font.family
  }

  static set fontFamily (v) {
    this._font.family = v
    this._updateFontOptions()
  }

  static set fontAlign (v) {
    if (!['left', 'right', 'center', 'start', 'end'].includes(v)) {
      throw new Error(`Invalid text align option "${v}". Font align values
      should be "left", "right", "center", "start", or "end".`)
    }
    this._font.align = v
    this._updateFontOptions()
  }

  static get fontAlign () {
    return this._font.align
  }

  static get fontBaseline () {
    return this._font.baseline
  }

  static set fontBaseline (v) {
    if (!['top', 'hanging', 'middle', 'alphabetic', 'ideographic', 'bottom'].includes(v)) {
      throw new Error(`Invalid font baselign option "${v}". Font baseline
      values should be "top", "hanging", "middle", "alphabetic", "ideographic", or "bottom"`)
    }
    this._font.baseline = v
    this._updateFontOptions()
  }

  static getPixelData () {
    const imageData = this.ctx.getImageData(0, 0, this.width, this.height)
    return imageData.data
  }

  static getPixels () {
    const data = this.getPixelData()
    const pixels = []
    for (let i = 0; i < data.length; i += 4) {
      const pixel = {
        r: data[i],
        g: data[i + 1],
        b: data[i + 2],
        a: data[i + 3]
      }
      pixels.push(pixel)
    }
    return pixels
  }

  static setPixels (pixels) {
    const imageData = this.ctx.getImageData(0, 0, this.width, this.height)
    const data = imageData.data
    for (let i = 0; i < data.length; i += 4) {
      const idx = Math.floor(i / 4)
      data[i] = pixels[idx].r
      data[i + 1] = pixels[idx].g
      data[i + 2] = pixels[idx].b
      data[i + 3] = pixels[idx].a
    }
    this.ctx.putImageData(imageData, 0, 0)
  }

  static setColors (x, y) {
    C2D.fill = x
    C2D.stroke = y
  }

  static ellipse (x, y, w, h) {
    this.ctx.beginPath()
    this.ctx.ellipse(x, y, w, h || w, 0, 2 * Math.PI, false)
    this.ctx.closePath()
    this.ctx.fill()
    this.ctx.stroke()
  }

  static rect (x, y, w, h) {
    this.ctx.beginPath()
    this.ctx.rect(x, y, w, h)
    this.ctx.closePath()
    this.ctx.fill()
    this.ctx.stroke()
  }

  static line (x1, y1, x2, y2) {
    this.ctx.beginPath()
    this.ctx.moveTo(x1, y1)
    this.ctx.lineTo(x2, y2)
    this.ctx.closePath()
    this.ctx.stroke()
  }

  static text (text, x, y, style = 'fill') {
    switch (style) {
      case 'fill':
        this.ctx.fillText(text, x, y)
        break
      case 'stroke':
        this.ctx.strokeText(text, x, y)
        break
      case 'both':
        this.ctx.fillText(text, x, y)
        this.ctx.strokeText(text, x, y)
        break
      case '-both':
        this.ctx.strokeText(text, x, y)
        this.ctx.fillText(text, x, y)
        break
      default:
        throw new Error(`Expected style value of 'stroke', 'fill', 'both', or
        '-both', but was recieved ${style}.`)
    }
  }

  static save () {
    const ctx = this.ctx
    this._stack = []
    const state = {}
    for (const property in ctx) {
      if (property === 'canvas') { continue }
      if (typeof ctx[property] === 'function') { continue }
      state[property] = ctx[property]
    }
    this._stack.push(state)
  }

  static restore () {
    const state = this._stack.pop() || {}
    for (const property in state) {
      this.ctx[property] = state[property]
    }
  }

  static resize (width, height) {
    // create canvas copy
    const canvasCopy = document.createElement('canvas')
    canvasCopy.width = this.width
    canvasCopy.height = this.height
    const ctxCopy = canvasCopy.getContext('2d')
    ctxCopy.drawImage(this.canvas, 0, 0)
    // resize canvas
    this.save()
    this.width = width
    this.height = height
    // scale and draw copy back onto canvas
    this.ctx.drawImage(canvasCopy, 0, 0, width, height)
    this.restore()
  }

  static rgb2hsv (r, g, b) {
    // convert rgb value to hsv
    r /= 255
    g /= 255
    b /= 255

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h = max
    let s = max
    const v = max
    const d = max - min
    s = max === 0 ? 0 : d / max

    if (max === min) {
      h = 0 // achromatic
    } else {
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0)
          break
        case g:
          h = (b - r) / d + 2
          break
        case b:
          h = (r - g) / d + 4
          break
      }
      h /= 6
    }
    return [h, s, v]
  }

  static hsv2rgb (h, s, v) {
    // convert hsv value to rgb
    let r, g, b
    const i = Math.floor(h * 6)
    const f = h * 6 - i
    const p = v * (1 - s)
    const q = v * (1 - f * s)
    const t = v * (1 - (1 - f) * s)
    switch (i % 6) {
      case 0:
        r = v
        g = t
        b = p
        break
      case 1:
        r = q
        g = v
        b = p
        break
      case 2:
        r = p
        g = v
        b = t
        break
      case 3:
        r = p
        g = q
        b = v
        break
      case 4:
        r = t
        g = p
        b = v
        break
      case 5:
        r = v
        g = p
        b = q
        break
    }
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)]
  }
}

window.C2D = C2D
