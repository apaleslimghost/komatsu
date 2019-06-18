const logUpdate = require('log-update')
const colour = require('ansi-colors')
const { dots } = require('cli-spinners')

const renderMessage = spinner => colour.italic(spinner.message)

const renderSymbol = spinner => {
	switch (spinner.status) {
		case 'pending':
			return colour.blue(dots.frames[spinner.frame])
		case 'done':
			return colour.green.bold('✓')
		case 'fail':
			return colour.red.bold('✗')
		case 'info':
			return colour.blue.bold('ℹ︎')
	}
}

const renderError = spinner =>
	spinner.error
		? `
${spinner.error.stack}`
		: ''

const renderSpinner = spinner =>
	` ${renderSymbol(spinner)} ${renderMessage(spinner)}${renderError(spinner)}`

class Spinners {
	constructor() {
		this.spinners = new Map()
	}

	start() {
		if (!this.timer) {
			this.timer = setInterval(() => this.tick(), 1)
		}
	}

	stop() {
		clearInterval(this.timer)
		this.tick()
		logUpdate.done()
		this.spinners.clear()
		// eslint-disable-next-line no-console
		console.log()
	}

	startSpinner(id) {
		if (!this.spinners.has(id)) {
			const spinner = {
				message: '',
				status: 'pending',
				frame: 0,
				error: null,
				tick: setInterval(() => {
					if (spinner.status === 'pending') {
						spinner.frame = (spinner.frame + 1) % dots.frames.length
					} else clearInterval(spinner.tick)
				}, dots.interval),
			}

			spinner.tick.unref()
			this.spinners.set(id, spinner)
		}
	}

	log(id, data) {
		this.start()
		this.startSpinner(id)

		Object.assign(this.spinners.get(id), data)

		if (
			this.spinners.size &&
			Array.from(this.spinners.values()).every(
				spinner => spinner.status !== 'pending',
			)
		) {
			this.stop()
		}
	}

	render() {
		return Array.from(this.spinners.values(), renderSpinner).join('\n')
	}

	tick() {
		logUpdate(this.render())
	}
}

module.exports = Spinners
