const logUpdate = require('./log-update')
const colour = require('ansi-colors')
const { dots } = require('cli-spinners')

class Spinners {
	constructor() {
		this.spinners = new Map()
	}

	start() {
		if (!this.timer) {
			this.timer = setInterval(() => this.tick(), 100)
		}
	}

	stop() {
		clearInterval(this.timer)
		delete this.timer

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

		const previous = this.spinners.get(id)

		if (
			(data.status && previous.status !== data.status) ||
			previous.message.length > data.message.length
		) {
			logUpdate.clear()
		}

		Object.assign(previous, data)
		this.tick()

		if (
			this.spinners.size &&
			Array.from(this.spinners.values()).every(
				spinner => spinner.status !== 'pending',
			)
		) {
			this.stop()
		}
	}

	async logPromise(promise, labels) {
		if (typeof labels === 'string') {
			labels = {
				pending: labels,
				done: `finished ${labels}`,
				fail: `error with ${labels}`,
			}
		}

		const id = Math.floor(parseInt(`zzzzzz`, 36) * Math.random())
			.toString(36)
			.padStart(6, '0')

		this.log(id, { message: labels.pending })
		try {
			const result = await promise
			this.log(id, { status: 'done', message: labels.done })
			return result
		} catch (error) {
			this.log(id, { status: 'fail', message: labels.fail, error })
			throw error
		}
	}

	render() {
		return Array.from(this.spinners.values(), this.renderSpinner, this).join(
			'\n',
		)
	}

	renderMessage(spinner) {
		return colour.italic(spinner.message)
	}

	renderSymbol(spinner) {
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

	renderError(spinner) {
		return spinner.error ? '\n' + spinner.error.stack : ''
	}

	renderSpinner(spinner) {
		return ` ${this.renderSymbol(spinner)} ${this.renderMessage(
			spinner,
		)}${this.renderError(spinner)}`
	}

	tick() {
		logUpdate(this.render())
	}
}

module.exports = Spinners
