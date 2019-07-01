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

const getWidth = stream => {
	const { columns } = stream

	if (!columns) {
		return 80
	}

	// Windows appears to wrap a character early
	// I hate Windows so much
	if (process.platform === 'win32') {
		return columns - 1
	}

	return columns
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

		const width = getWidth(stream)
		prevLineCount = out
			.split('\n')
			.map(line => 1 + Math.floor(line.length / width))
			.reduce((a, b) => a + b)
	}

	render.clear = () => {
		stream.write(ansiEscapes.eraseLines(prevLineCount))
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
