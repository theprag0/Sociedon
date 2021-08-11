import av1 from '../assets/avatars/av1.png'; 
import av2 from '../assets/avatars/av2.png'; 
import av3 from '../assets/avatars/av3.png'; 
import av4 from '../assets/avatars/av4.png'; 
import av5 from '../assets/avatars/av5.png'; 
import av6 from '../assets/avatars/av6.png'; 
import av7 from '../assets/avatars/av7.png'; 
import av8 from '../assets/avatars/av8.png'; 
import av9 from '../assets/avatars/av9.png'; 
import av10 from '../assets/avatars/av10.png'; 
import av11 from '../assets/avatars/av11.png'; 
import av12 from '../assets/avatars/av12.png'; 
import av13 from '../assets/avatars/av13.png'; 
import av14 from '../assets/avatars/av14.png'; 
import av15 from '../assets/avatars/av15.png'; 
import av16 from '../assets/avatars/av16.png'; 
import av17 from '../assets/avatars/av17.png'; 
import av18 from '../assets/avatars/av18.png'; 
import av19 from '../assets/avatars/av19.png'; 
import av20 from '../assets/avatars/av20.png'; 
import av21 from '../assets/avatars/av21.png'; 
import av22 from '../assets/avatars/av22.png'; 
import av23 from '../assets/avatars/av23.webp'; 
import av24 from '../assets/avatars/av24.webp'; 
import av25 from '../assets/avatars/av25.png'; 
import av26 from '../assets/avatars/av26.png'; 
import av27 from '../assets/avatars/av27.png'; 
import av28 from '../assets/avatars/av28.png'; 
import av29 from '../assets/avatars/av29.png'; 
import av30 from '../assets/avatars/av30.png'; 
import av31 from '../assets/avatars/av31.png'; 
import av32 from '../assets/avatars/av32.png'; 

export const avatars = [
    {image: av1, ref: 'av1'}, 
    {image: av2, ref: 'av2'},  
    {image: av6, ref: 'av6'}, 
    {image: av7, ref: 'av7'},  
    {image: av9, ref: 'av9'},
    {image: av10, ref: 'av10'},
    {image: av11, ref: 'av11'},
    {image: av12, ref: 'av12'},
    {image: av13, ref: 'av13'},
    {image: av14, ref: 'av14'},
    {image: av15, ref: 'av15'},
    {image: av16, ref: 'av16'},
    {image: av17, ref: 'av17'},
    {image: av18, ref: 'av18'},
    {image: av19, ref: 'av19'},
    {image: av20, ref: 'av20'},
    {image: av21, ref: 'av21'},
    {image: av22, ref: 'av22'},
    {image: av23, ref: 'av23'},
    {image: av24, ref: 'av24'},
    {image: av25, ref: 'av25'},
    {image: av26, ref: 'av26'},
    {image: av27, ref: 'av27'},
    {image: av28, ref: 'av28'},
    {image: av29, ref: 'av29'},
    {image: av30, ref: 'av30'},
    {image: av31, ref: 'av31'},
    {image: av32, ref: 'av32'},
    {image: av5, ref: 'av5'},
    {image: av8, ref: 'av8'},
    {image: av3, ref: 'av3'}, 
    {image: av4, ref: 'av4'}, 
];

export const getAvatar = (avatarRef) => {
    const foundAvatar = avatars.find(av => av.ref === avatarRef);
    return foundAvatar.image;
}
