import av1 from '../assets/avatars/av1.png'; 
import av2 from '../assets/avatars/av2.png'; 
import av3 from '../assets/avatars/av3.png'; 
import av4 from '../assets/avatars/av4.png'; 
import av5 from '../assets/avatars/av5.png'; 
import av6 from '../assets/avatars/av6.png'; 
import av7 from '../assets/avatars/av7.png'; 
import av8 from '../assets/avatars/av8.png'; 
import av9 from '../assets/avatars/av9.png'; 

const avatars = [
    {image: av1, ref: 'av1'}, 
    {image: av2, ref: 'av2'}, 
    {image: av3, ref: 'av3'}, 
    {image: av4, ref: 'av4'}, 
    {image: av5, ref: 'av5'}, 
    {image: av6, ref: 'av6'}, 
    {image: av7, ref: 'av7'}, 
    {image: av8, ref: 'av8'}, 
    {image: av9, ref: 'av9'}
];
const getDefaultPicture = (avatarRef) => {
    const foundAvatar = avatars.find(av => av.ref === avatarRef);
    return foundAvatar.image;
}

export default getDefaultPicture;