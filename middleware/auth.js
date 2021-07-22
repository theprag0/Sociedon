const jwt = require('jsonwebtoken');

function auth(req, res, next) {
    const token = req.header('x-auth-token');
    if(!token) return res.status(401).json({msg: 'No Token, Authorization denied!'});

    try{
        // Verify Token
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if(err) return res.status(400).json({msg: 'Failed to auth token'});
            else{
                req.user = decoded;
                next();
            }
        });
    } catch(err) {
        res.status(400).json({msg: 'Invalid Token, Authorization denied!'});
        console.log(err);
    }
}

module.exports = auth;