'use strict'

const {
    connectToRabbitMQ,
    connectToRabbitMQForTest
} = require('../dbs/init.rabbit');

describe('RabitMQ Connetion',() => {
    it('should connect to successful RabbitMQ',async() => {
        const result = await connectToRabbitMQForTest()
        expect(result).toBeUndefined();
    })
})