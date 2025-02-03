const clientBrokers = {
   brokers:  ['localhost:29092', 'localhost:29093'], // Adresse des brokers Kafka
}

export const kafkaConfig = {
    client: clientBrokers, 
    consumer: {
        groupId: 'chat-group', // Groupe de consommateurs par défaut
    },
    producer: {
        allowAutoTopicCreation: true, // Permet de créer des topics automatiquement
    },
};

export const kafkaConfigConsumerChatGroup =    {
    client: clientBrokers, 
    consumer: {
        groupId: 'chat-group',
    },
}