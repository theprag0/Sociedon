import { useState } from 'react';

const useInputState = initialVal => {
    const [state, setState] = useState(initialVal);
    const handleChange = e => {
        const re = /^[a-zA-Z0-9@.]*$/;
        if(e.target.value === '' || re.test(e.target.value)) {
            setState(e.target.value);
        }
    }
    const reset = () => {
        setState('');
    }

    return [state, handleChange, reset];
}

export default useInputState;