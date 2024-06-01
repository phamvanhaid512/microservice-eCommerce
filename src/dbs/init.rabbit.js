'use strict'

const amqp = require('amqplib')
const connectToRabbitMQ = async () => {
    try {
        const connection = await amqp.connect('amqp://localhost')
        if(!connection) throw new Error('Connection not established')
        
        const channel = await connection.createChannel()

        return {channel,connection}
    } catch (error) {
        console.error('Error connecting to RabbitMQ',error)
        throw error
    }   
}

const connectToRabbitMQForTest = async () => {
    try {
        const {channel,connection} = await connectToRabbitMQ()

        //Publish message to a queue
        const queue = 'test-queue'
        const message = 'Hello, shopDev by anonystick'
        await channel.assertQueue(queue)
        await channel.sendToQueue(queue,Buffer.from(message))

        //close the connection
        await connection.close()
    } catch (error) {
        console.error(`Error connection to RabbitMQ`,error);
    }
}

const consumerQueue = async (channel,queueName) => {
    try {
        await channel.assertQueue(queueName,{durable:true})
        console.log(`Waiting for messages...`)
        channel.consume(queueName,msg=> {
            console.log(`Receoved message: ${queueName}::`,msg.content.toString());
        },{
            noAck:true //Anh oi neu nhu he thong bi loi xu li thi phai lam sao
        })
    } catch (error) {
        console.error('error publish message to rabbitMQ::',error)
        throw error;
    }
}
module.exports = {
    connectToRabbitMQ,
    connectToRabbitMQForTest,
    consumerQueue
}