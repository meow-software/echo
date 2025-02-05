export class EchoEvent {
    // Events related to messages
    static readonly MessageCreate = 'messageCreate';
    static readonly MessageUpdate = 'messageUpdate';
    static readonly MessageDelete = 'messageDelete';
    static readonly MessageReactionAdd = 'messageReactionAdd';
    static readonly MessageReactionRemove = 'messageReactionRemove';

    // Events related to guild members
    static readonly GuildMemberAdd = 'guildMemberAdd';
    static readonly GuildMemberRemove = 'guildMemberRemove';
    static readonly GuildMemberUpdate = 'guildMemberUpdate';
    static readonly UserUpdate = 'userUpdate';

    // Events related to channels
    static readonly ChannelCreate = 'channelCreate';
    static readonly ChannelUpdate = 'channelUpdate';
    static readonly ChannelDelete = 'channelDelete';
    static readonly ChannelPinsUpdate = 'channelPinsUpdate';

    // Events related to roles
    static readonly RoleCreate = 'roleCreate';
    static readonly RoleUpdate = 'roleUpdate';
    static readonly RoleDelete = 'roleDelete';

    // Connection and disconnection events
    static readonly Connection = 'connection';
    static readonly Disconnect = 'disconnect';
    static readonly Ready = 'ready';
    static readonly Resume = 'resume';
    static readonly Reconnect = 'reconnect';
    static readonly ShardDisconnect = 'shardDisconnect';
    static readonly ShardReady = 'shardReady';
    static readonly ShardReconnecting = 'shardReconnecting';

    // Interaction events
    static readonly InteractionCreate = 'interactionCreate';
    static readonly InteractionUpdate = 'interactionUpdate';
    static readonly InteractionDelete = 'interactionDelete';

    // Events related to guilds
    static readonly GuildCreate = 'guildCreate';
    static readonly GuildUpdate = 'guildUpdate';
    static readonly GuildDelete = 'guildDelete';
    static readonly GuildBanAdd = 'guildBanAdd';
    static readonly GuildBanRemove = 'guildBanRemove';
    static readonly GuildEmojisUpdate = 'guildEmojisUpdate';
    static readonly GuildStickersUpdate = 'guildStickersUpdate';

    // Events related to users (bot, etc.)
    static readonly InviteCreate = 'inviteCreate';
    static readonly InviteDelete = 'inviteDelete';

    // Typing events
    static readonly TypingStart = 'typingStart';
    static readonly TypingStop = 'typingStop';

    // WebSocket events (for the bot)
    static readonly WebSocketClose = 'webSocketClose';
    static readonly WebSocketError = 'webSocketError';

    // Other Discord events (as needed)
    static readonly Unknown = 'unknown';
}

export type EchoEventType = typeof EchoEvent[keyof typeof EchoEvent];