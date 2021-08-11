import { useState } from 'react';;

const useInputState = (initialVal, validate = true, type) => {
    const [state, setState] = useState(initialVal);

    const handleChange = e => {
        if(validate === true) {
            const re = /^[a-zA-Z0-9@.]*$/;
            if(e.target.value === '' || re.test(e.target.value)) {
                setState(e.target.value);
            }
        } else {
            if(type === 'password') {
                let value = e.target.value;
                setState(value.replace(/\s/g, ''));
            } else {
                setState(e.target.value);
            }
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