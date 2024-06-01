"use strict";

const { consumerQueue, connectToRabbitMQ } = require("../dbs/init.rabbit");

// const log =  console.log

// console.log = function() {
//   log.apply(console, [new Date()].concat(arguments))
// }

const messageService = {
  consumerToQueue: async (queueName) => {
    try {
      const { channel, connection } = await connectToRabbitMQ();
      await consumerQueue(channel, queueName);
    } catch (error) {
      console.error(`Error consumerToQueue::`, error);
    }
  },
  //case proce
  consumerToQueueNormal: async (queueName) => {
    try {
      const { channel, connection } = await connectToRabbitMQ();
      const notiQueue = "notificationQueueProcess"; //  in process
      const timeExpried = 15000;

      //1.Error TTL
      // setTimeout(() => {
      //   channel.consume(notiQueue, msg => {
      //     console.log(
      //       `SEND notificationsQueue successfully processed`,msg.content.toString());
      //     channel.ack(msg)
      //   })
      // },timeExpried)
      //2.LOGIC
      channel.consume(notiQueue,msg => {
        try {
          const numberTest = Math.random()
          console.log({numberTest})
          if(numberTest < 0.8) {
            throw new Error('SEND notification failed:: HOT FIX')
          }
          console.log(`SEND notificationQueue successfully processed:`,msg.content.toString())
          channel.ack(msg)
        } catch (error) {
          // console.error('SEND notification error:',error);
          channel.nack(msg,false,false)
        }
      })

    } catch (error) {
      console.error(`Error consumerToQueue::`, error);
    }
  },
  //case failed processing
  consumerToQueueFaild: async (queueName) => {
    try {
      const { channel, connection } = await connectToRabbitMQ();
      const notificationExchangeDLX = "notificationExDLX"; // not sucess => DLX
      const notificationRoutingKeyDLX = "notificationRoutingKeyDLX"; // private key
      const notiQueueHandler = 'notificationQueueHotFix'

      await channel.assertExchange(notificationExchangeDLX, 'direct', {
        durable: true
      })
      const queueResult = await channel.assertQueue(notiQueueHandler, {
        exclusive: false
      })

      await channel.bindQueue(queueResult.queue, notificationExchangeDLX, notificationRoutingKeyDLX)
      await channel.consume(queueResult.queue, msgFailed => {
        console.log(`This is notification error:, pls hot fix`, msgFailed.content.toString())
      }, {
        noAck: true
      })
    } catch (error) {
      console.error(`Error consumerToQueue::`, error);
      throw error;
    }
  },
};

module.exports = messageService;
