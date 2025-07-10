// Import all avatar images
import omarAvatar from './omar.png';
import aishaAvatar from './aisha.png';
import mayaAvatar from './maya.png';
import marcusAvatar from './marcus.png';
import zaraAvatar from './zara.png';
import jordanAvatar from './jordan.png';
import defaultAvatar from '../default-avatar.svg';

// Ensure all avatars are properly exported with fallback
export const avatars = {
  omar: omarAvatar || defaultAvatar,
  aisha: aishaAvatar || defaultAvatar,
  maya: mayaAvatar || defaultAvatar,
  marcus: marcusAvatar || defaultAvatar,
  zara: zaraAvatar || defaultAvatar,
  jordan: jordanAvatar || defaultAvatar
};