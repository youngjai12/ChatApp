import { Header, Container } from '@pages/DirectMessage/styles';
import React from 'react';
import {ContextProvider} from "@components/VTList/context";
import VideoPlayer from "@components/VTList/videoContext";
import Sidebar from "@components/VTList/styles";
import Notifications from "@components/VTList/notification";
import gravatar from "gravatar";
import useSWR from "swr";
import fetcher from "@utils/fetcher";
import {useParams} from "react-router";

const VoiceTalk = () => {
  const { workspace, id } = useParams<{ workspace: string; id: string }>();
  const { data: myData } = useSWR('/api/users', fetcher);
  const { data: userData } = useSWR(`/api/workspaces/${workspace}/users/${id}`, fetcher);

  if (!userData || !myData) {
    return null;
  }

  return (
    <ContextProvider>
      <Container>
        <Header>
          <img src={gravatar.url(userData.email, { s: '24px', d: 'retro' })} alt={userData.nickname} />
          <span>{userData.nickname}</span>
        </Header>
        <div>
          <VideoPlayer />
        </div>
        <Sidebar user={userData.nickname}>
          <Notifications />
        </Sidebar>
      </Container>
    </ContextProvider>
  );
};

export default VoiceTalk;
