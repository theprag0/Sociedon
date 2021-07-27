import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import useInputState from '../../hooks/useInputState';
import { AuthenticationContext } from '../../contexts/auth.context';
import SearchList from './SearchList';
import '../../styles/Messenger.css';

function Search({type, showAlert}) {
    const [searchQuery, setSearchQuery] = useInputState('');
    const [result, setResult] = useState([]);
    const {token} = useContext(AuthenticationContext);

    // Update result on query change
    useEffect(() => {
        const config = {
            headers: {'x-auth-token': token}
        };
        if(searchQuery === '') {
            setResult([]);
        } else {
            axios.post('/messenger/search', {query: searchQuery, type}, config)
                .then(res => {
                    setResult(res.data.result);
                })
                .catch(err => console.log(err));
        }
    }, [searchQuery, token, type]);

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
                        <SearchList 
                            key={r._id || r.msg} 
                            userSearchData={r} 
                            type={type}
                            showAlert={showAlert}
                        />
                    ))}
                </ul>
                : null 
            }
        </div>
    );
}

export default Search;