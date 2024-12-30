import { FC } from 'react';
import { Button } from 'react-bootstrap';
import './InputField.css';

interface Props {
    value: string;
    setValue: (value: string) => void;
    onSubmit: () => void;
    loading?: boolean;
    placeholder?: string;
    buttonTitle?: string;
}

const InputField: FC<Props> = ({ value, setValue, onSubmit, loading, placeholder, buttonTitle = 'Поиск' }) => (
    <div className="inputField">
        <input
            className="form-control me-2"
            type="search"
            value={value}
            placeholder={placeholder}
            onChange={(event) => setValue(event.target.value)}
        />
        <Button
            variant="outline-dark"
            disabled={loading}
            onClick={onSubmit}
        >
            {buttonTitle}
        </Button>
    </div>
);

export default InputField;