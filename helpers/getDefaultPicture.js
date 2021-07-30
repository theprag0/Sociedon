function getDefaultPicture() {
    const avatarRef = [
        'av1', 
        'av2', 
        'av3', 
        'av4', 
        'av5', 
        'av6', 
        'av7', 
        'av8', 
        'av9', 
    ];
    return avatarRef[Math.floor(Math.random() * avatarRef.length)]
}

module.exports = getDefaultPicture;