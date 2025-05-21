module.exports = {
  name: 'ready',
  once: true,
  execute(client) {
    client.user.setPresence({
      activities: [
        {
          name: 'Barki',
          type: 2, // 2 = LISTENING
        },
      ],
      status: 'online',
    });

    // Jeśli chcesz zostawić jakiś log w konsoli:
    // console.log(`${client.user.tag} jest gotowy!`);
  },
};
