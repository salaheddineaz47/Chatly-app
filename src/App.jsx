import { useEffect, useState } from "react";
import { StreamChat } from "stream-chat";
import {
  Chat,
  Channel,
  Window,
  ChannelHeader,
  MessageList,
  MessageInput,
  Thread,
  LoadingIndicator,
} from "stream-chat-react";
// import "stream-chat-react/dist/css/index.css";

const apikey = "6npt4sdsw2bc";

const users = [
  {
    id: "john",
    name: "Salah Eddine",
    image: "https://getstream.imgix.net/images/random_svg/FS.png",
  },
  {
    id: "johnn",
    name: "Amine",
    image: "https://getstream.imgix.net/images/random_svg/FS.png",
  },
];

export default function App() {
  const [client, setClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [selectedUser, setSelectedUser] = useState(users[0]);

  useEffect(() => {
    async function init() {
      const chatClient = StreamChat.getInstance(apikey);

      await chatClient.connectUser(
        selectedUser,
        chatClient.devToken(selectedUser.id)
      );

      const channel = chatClient.channel("messaging", "react-talk", {
        image: "https://www.drupal.org/files/project-images/react.png",
        name: "Talk about React",
        members: [selectedUser.id],
      });
      await channel.watch();
      setChannel(channel);
      setClient(chatClient);
    }

    init();

    if (client) return () => client.disconnectUser();
  }, [selectedUser, client]);
  if (!channel || !client) return <LoadingIndicator />;

  return (
    <div>
      <select onChange={(e) => setSelectedUser(users[e.target.value])}>
        {users.map((user, index) => (
          <option key={user.id} value={index}>
            {user.name}
          </option>
        ))}
      </select>

      <Chat client={client} theme="messaging light">
        <Channel channel={channel}>
          <Window>
            <ChannelHeader />
            <MessageList />
            <MessageInput />
          </Window>
          <Thread />
        </Channel>
      </Chat>
    </div>
  );
}
