import {
  FormControl,
  FormLabel,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';

import { useState } from 'react';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';

const PasswordInput = ({ onChange, value, name, id, label, disabled }) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <FormControl isRequired id={id}>
      <FormLabel>{label}</FormLabel>

      <InputGroup>
        <Input
          id={id}
          name={name}
          type={showPassword ? 'text' : 'password'}
          onChange={onChange}
          value={value}
          disabled={disabled}
        />

        <InputRightElement h={'full'}>
          <IconButton
            aria-label='toggle show password'
            fontSize={{ base: '1.5rem' }}
            variant={'ghost'}
            onClick={() => setShowPassword((showPassword) => !showPassword)}
            disabled={disabled}
          >
            <Icon as={showPassword ? AiFillEye : AiFillEyeInvisible} />
          </IconButton>
        </InputRightElement>
      </InputGroup>
    </FormControl>
  );
};

export default PasswordInput;
