import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import useInputState from '../../hooks/useInputState';
import { AuthenticationContext } from '../../contexts/auth.context';
import '../../styles/Messenger.css';

function Search({type}) {
    const [searchQuery, setSearchQuery] = useInputState('');
    const [result, setResult] = useState([]);
    const {token} = useContext(AuthenticationContext);

    // Update result on query change
    useEffect(() => {
        const config = {
            headers: {'x-auth-token': token}
        };
        if(searchQuery !== '') {
            axios.post('/messenger/search', {query: searchQuery, type}, config)
                .then(res => {
                    setResult(res.data.result);
                })
                .catch(err => console.log(err));
        } else {
            setResult([]);
        }
    }, [searchQuery, token, type]);

    // Send friend request 
    const handleClick = e => {
        
    }

    return (
        <div className="Search">
            <input 
                type="text"
                name="search"
                placeholder={`Search new ${type}`}
                value={searchQuery}
                onChange={setSearchQuery}
                autoComplete="off"
            />
            {
                result.length > 0 
                ?
                <ul>
                    {result.map(r => (
                        <li key={r._id || r.msg}>
                            {(type === 'friends' ? r.username : r.name) || r.msg}
                            <button onClick={handleClick}><i class="fas fa-user-plus"></i></button>
                        </li>
                    ))}
                </ul>
                : null 
            }
        </div>
    );
}

export default Search;