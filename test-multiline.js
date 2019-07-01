const Komatsu = require('./')
const logger = new Komatsu()

logger.log(1, {
	message:
		'multi really logng line that hopufuleuly wilgyrioea wrapp so ebightrsr charecarsioear\nline',
})
logger.log(2, { message: 'multi' })

setTimeout(() => logger.log(2, { message: 'multi\nline' }), 5000)
setTimeout(
	() => logger.log(2, { message: 'multi\nline done', status: 'done' }),
	15000,
)
setTimeout(() => logger.log(1, { message: 'multi done', status: 'done' }), 2500)
