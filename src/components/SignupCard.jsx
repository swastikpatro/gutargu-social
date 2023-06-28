import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  HStack,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link as ChakraLink,
  useToast,
} from '@chakra-ui/react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { loginService, showToast } from '../utils/utils';
import { TOAST_TYPE, URL } from '../constants';
import { addUserCredentials } from '../store/authSlice';
import { useNavigateIfRegistered } from '../hooks';
import PageLoader from './PageLoader';
import PasswordInput from './PasswordInput';
import { useDispatch, useSelector } from 'react-redux';

const SignupCard = () => {
  const location = useLocation();
  const { token: tokenFromSlice, isLoggedOut } = useSelector(
    (store) => store.auth
  );

  useNavigateIfRegistered({ token: tokenFromSlice, isLoggedOut });

  const dispatch = useDispatch();

  const [inputs, setInputs] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    passwordMain: '',
    passwordConfirm: '',
  });

  const [isSignupFormLoading, setIsSignupFormLoading] = useState(false);
  const toast = useToast();

  const colorModeValue = {
    bgColor: useColorModeValue('gray.50', 'gray.800'),
    cardBgColor: useColorModeValue('white', 'gray.700'),
  };

  const handleInputChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const handleCreateAccount = async (e) => {
    e.preventDefault();

    if (inputs.passwordMain.length < 6) {
      showToast({
        toast,
        type: TOAST_TYPE.Error,
        message: 'Password should be at least 6 characters in length',
      });
      return;
    }

    if (inputs.passwordMain !== inputs.passwordConfirm) {
      showToast({
        toast,
        type: TOAST_TYPE.Error,
        message: 'Password and Confirm Password inputs did not match!',
      });
      return;
    }

    if (!inputs.firstName.trim() || !inputs.username.trim()) {
      showToast({
        toast,
        type: TOAST_TYPE.Error,
        message: 'Please fill all the inputs',
      });
      return;
    }

    const {
      email,
      firstName,
      lastName,
      username,
      passwordMain: password,
    } = inputs;

    setIsSignupFormLoading(true);

    try {
      const response = await fetch(`${URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
          username: username.trim(),
          firstName: firstName.trim(),
          lastName: lastName.trim(),
        }),
      });

      const { error = '', message } = await response.json();

      if (!response.ok) {
        throw new Error(error ? error : message);
      }

      const { token } = await loginService({
        email: email.trim(),
        password,
      });

      // update userSlice with token
      dispatch(addUserCredentials(token));
      // show success toast
      showToast({ toast, type: TOAST_TYPE.Success, message });
    } catch (error) {
      console.error(error.message);

      showToast({ toast, type: TOAST_TYPE.Error, message: error.message });
    } finally {
      setIsSignupFormLoading(false);
    }
  };

  if (tokenFromSlice) {
    return <PageLoader />;
  }

  return (
    <Flex
      minH={'calc(100vh - 5rem)'}
      align={'center'}
      justify={'center'}
      bg={colorModeValue.bgColor}
    >
      <Stack spacing={8} mx={'auto'} maxW={'xl'} py={10} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={{ base: '2xl', md: '3xl' }}>Sign up</Heading>
          <Text fontSize={{ base: 'md', md: 'lg' }} color={'gray.600'}>
            to enjoy all of our cool features ✌️
          </Text>
        </Stack>

        <Box
          rounded={'lg'}
          bg={colorModeValue.cardBgColor}
          boxShadow={'lg'}
          p={8}
          w='90vw'
          maxW='450px'
        >
          <Stack spacing={4} as='form' onSubmit={handleCreateAccount}>
            <HStack>
              <Box>
                <FormControl id='firstName' isRequired>
                  <FormLabel>First Name</FormLabel>
                  <Input
                    type='text'
                    id='firstName'
                    name='firstName'
                    value={inputs.firstName}
                    disabled={isSignupFormLoading}
                    onChange={handleInputChange}
                  />
                </FormControl>
              </Box>

              <Box>
                <FormControl id='lastName'>
                  <FormLabel>Last Name</FormLabel>
                  <Input
                    type='text'
                    name='lastName'
                    id='lastName'
                    value={inputs.lastName}
                    onChange={handleInputChange}
                    disabled={isSignupFormLoading}
                  />
                </FormControl>
              </Box>
            </HStack>

            <FormControl id='email' isRequired>
              <FormLabel>Email address</FormLabel>
              <Input
                type='email'
                name='email'
                id='email'
                value={inputs.email}
                onChange={handleInputChange}
                disabled={isSignupFormLoading}
              />
            </FormControl>

            <FormControl id='username' isRequired>
              <FormLabel>Username</FormLabel>
              <Input
                type='text'
                name='username'
                id='username'
                value={inputs.username}
                onChange={handleInputChange}
                disabled={isSignupFormLoading}
              />
            </FormControl>

            <PasswordInput
              label='Password'
              name='passwordMain'
              id='passwordMain'
              value={inputs.passwordMain}
              onChange={handleInputChange}
              disabled={isSignupFormLoading}
            />

            <PasswordInput
              label='Confirm Password'
              onChange={handleInputChange}
              name='passwordConfirm'
              value={inputs.passwordConfirm}
              id='passwordConfirm'
              disabled={isSignupFormLoading}
            />

            <Stack spacing={10} pt={2}>
              <Button
                type='submit'
                isLoading={isSignupFormLoading}
                size='lg'
                bg={'blue.400'}
                color={'white'}
                _hover={{
                  bg: 'blue.500',
                }}
              >
                Sign up
              </Button>
            </Stack>

            <Stack mt={2}>
              <Text align={'center'}>
                Already a user?{' '}
                <ChakraLink
                  as={Link}
                  color={'blue.400'}
                  _hover={{ textDecoration: 'none' }}
                  state={{ from: location?.state?.from || '/' }}
                  to='/login'
                >
                  Login
                </ChakraLink>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
};

export default SignupCard;
