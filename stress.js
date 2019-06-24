const Komatsu = require('./')
const logger = new Komatsu()

Array.from({ length: 50 }, (_, i) => {
	logger.log(i, { message: `stress test ${i}` })
	setTimeout(
		() => logger.log(i, { status: 'done', message: `stress test ${i}` }),
		Math.random() * 5000,
	)
})
