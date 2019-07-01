const Komatsu = require('./')
const logger = new Komatsu()

Array.from({ length: 50 }, (_, i) => {
	logger.log(i, {
		message: `stress test ${i} ${'a'.repeat(Math.ceil(100 * Math.random()))}`,
	})
	setTimeout(
		() =>
			logger.log(i, {
				message: `stress test ${i} ${'a'.repeat(
					Math.ceil(100 * Math.random()),
				)}`,
			}),
		Math.random() * 5000,
	)
	setTimeout(
		() => logger.log(i, { status: 'done', message: `stress test ${i}` }),
		Math.random() * 5000 + 5000,
	)
})
