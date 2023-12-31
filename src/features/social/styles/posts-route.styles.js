import styled from 'styled-components/native';

export const PostsRouteWrapper = styled.View`
  flex: 1;
`;

export const PostsList = styled.FlatList`
  margin-top: 5px;
`;

export const PostWrapper = styled.TouchableOpacity`
  aspect-ratio: 1;
  margin: 3px;
  width: 32%;
`;

export const PostImage = styled.Image`
  width: 100%;
  height: 100%;
  border-radius: 12px;
`;
