'use strict'

const { consumerToQueue,consumerToQueueFaild,consumerToQueueNormal} = require('./src/services/consumerQueue.service')
const queueName = 'test-topic'
// consumerToQueue(queueName).then(() => {
//     console.log(`Message consumer started ${queueName}`)
// }).catch(err => {
//     console.log(`Message Error :${err.message}`)
// })

consumerToQueueNormal(queueName).then(() => {
    console.log(`Message consumerToQueueNormal started `)
}).catch(err => {
    console.log(`Message Error :${err.message}`)
})

consumerToQueueFaild(queueName).then(() => {
    console.log(`Message consumerToQueueFaild started `)
}).catch(err => {
    console.log(`Message Error :${err.message}`)
})