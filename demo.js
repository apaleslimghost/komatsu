const Komatsu = require('./')
const logger = new Komatsu()

logger.log('foo', { message: 'processing foo' })
logger.log('bar', { message: 'processing bar' })

setTimeout(
	() => logger.log('foo', { message: 'doing more foo processing' }),
	500,
)
setTimeout(
	() => logger.log('bar', { message: 'doing more bar processing' }),
	1000,
)

setTimeout(
	() => logger.log('foo', { status: 'done', message: 'foo complete' }),
	1500,
)
setTimeout(
	() =>
		logger.log('bar', {
			status: 'fail',
			message: 'bar errored',
			error: new Error('problem with bar'),
		}),
	1500,
)
