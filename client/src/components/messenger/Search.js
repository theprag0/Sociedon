import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import onClickOutside from 'react-onclickoutside';
import useInputState from '../../hooks/useInputState';
import { AuthenticationContext } from '../../contexts/auth.context';
import SearchList from './SearchList';
import '../../styles/Messenger.css';
import spinner from '../../assets/svg/spinner.svg';

function Search({type}) {
    const [searchQuery, setSearchQuery] = useInputState('');
    const [result, setResult] = useState([]);
    const [resultLoading, setResultLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const {token} = useContext(AuthenticationContext);

    // Update result on query change
    useEffect(() => {
        setResultLoading(true);
        setIsOpen(true)
        const config = {
            headers: {'x-auth-token': token}
        };
        if(searchQuery === '') {
            setResult([]);
            setResultLoading(false);
            setIsOpen(false);
        } else {
            axios.post('/messenger/search', {query: searchQuery, type}, config)
                .then(res => {
                    setResult(res.data.result);
                    setResultLoading(false);
                })
                .catch(err => console.log(err));
        }
    }, [searchQuery, token, type]);

    Search.handleClickOutside = () => setIsOpen(false);
    
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
                !resultLoading 
                ?
                <ul style={{display: isOpen ? 'block' : 'none'}}>
                    {result.map(r => (
                        <SearchList 
                            key={r._id || r.msg} 
                            userSearchData={r} 
                            type={type}
                        />
                    ))}
                </ul>
                : <ul><li className="spinner"><img src={spinner} alt="loading gif"/></li></ul> 
            }
        </div>
    );
}

const clickedOutsideConfig = {
    handleClickOutside: () => Search.handleClickOutside
};

export default onClickOutside(Search, clickedOutsideConfig);