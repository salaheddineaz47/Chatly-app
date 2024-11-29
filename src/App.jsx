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
import "../node_modules/stream-chat-react/dist/css/v2/index.css";

const apikey = "6npt4sdsw2bc";
const users = [
  {
    id: "john",
    name: "Salah Eddine",
    image: "https://getstream.imgix.net/images/random_svg/FS.png",
  },
  {
    id: "john-salah",
    name: "Amine",
    image: "https://getstream.imgix.net/images/random_svg/FS.png",
  },
];

export default function App() {
  const [client, setClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [selectedUser, setSelectedUser] = useState(users[0]);

  useEffect(() => {
    let isMounted = true;

    async function init() {
      if (client) {
        await client.disconnectUser();
      }

      const chatClient = new StreamChat(apikey);

      await chatClient.connectUser(
        selectedUser,
        chatClient.devToken(selectedUser.id)
      );

      const newChannel = chatClient.channel("messaging", "react-talk", {
        image: "https://www.drupal.org/files/project-images/react.png",
        name: "Talk about React",
        members: users.map((user) => user.id),
      });

      await newChannel.watch();

      if (isMounted) {
        setClient(chatClient);
        setChannel(newChannel);
      }
    }

    init();

    return () => {
      isMounted = false;
      if (client) {
        client.disconnectUser();
        setClient(null);
        setChannel(null);
      }
    };
  }, [selectedUser]);

  if (!channel || !client) return <LoadingIndicator />;

  return (
    <div>
      <select
        onChange={(e) => setSelectedUser(users[parseInt(e.target.value)])}
        value={users.findIndex((user) => user.id === selectedUser.id)}
      >
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
