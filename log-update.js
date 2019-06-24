// originally https://github.com/sindresorhus/log-update/

const ansiEscapes = require('ansi-escapes')
const cliCursor = require('cli-cursor')

const moveLines = count => {
	let clear = ''

	for (let i = 0; i < count; i++) {
		clear += i < count - 1 ? ansiEscapes.cursorUp() : ''
	}

	if (count) {
		clear += ansiEscapes.cursorLeft
	}

	return clear
}

const main = (stream, options) => {
	options = Object.assign(
		{
			showCursor: false,
		},
		options,
	)

	let prevLineCount = 0

	const render = (...args) => {
		if (!options.showCursor) {
			cliCursor.hide()
		}

		const out = args.join(' ') + '\n'
		stream.write(moveLines(prevLineCount) + out)
		prevLineCount = out.split('\n').length
	}

	render.clear = () => {
		stream.write(moveLines(prevLineCount))
		prevLineCount = 0
	}

	render.done = () => {
		prevLineCount = 0

		if (!options.showCursor) {
			cliCursor.show()
		}
	}

	return render
}

module.exports = main(process.stderr)
