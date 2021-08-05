import { useState } from "react";
import { Form, FormControl, InputGroup, Button } from "react-bootstrap"


const SendMessageForm = ({ sendMessage }) => {
    const [message, setMessage] = useState('');
    return <Form onSubmit=
        {e => {
            e.preventDefault();
            sendMessage(message);
            setMessage('');
        }}>
        <InputGroup>
            <FormControl placeholder='message...' onChange={e => setMessage(e.target.value)} value={message} />
            <InputGroup.Append>
                <Button variant='primary' type='submit' disabled={!message}>Send</Button>
            </InputGroup.Append>

        </InputGroup>
    </Form >
}

export default SendMessageForm;