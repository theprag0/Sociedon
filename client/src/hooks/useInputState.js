import { useState } from 'react';

const useInputState = (initialVal, validate = true) => {
    const [state, setState] = useState(initialVal);

    const handleChange = e => {
        if(validate === true) {
            const re = /^[a-zA-Z0-9@.]*$/;
            if(e.target.value === '' || re.test(e.target.value)) {
                setState(e.target.value);
            }
        } else {
            setState(e.target.value);
        }
    }

    const setEmoji = emoji => {
        setState(currState => `${currState}${emoji}`);
    }

    const reset = () => {
        setState('');
    }

    return [state, handleChange, reset, setEmoji];
}

export default useInputState;