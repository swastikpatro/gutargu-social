import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Link as ChakraLink,
  Button,
  Heading,
  Text,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import PasswordInput from './PasswordInput';
import { ChangeEvent, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/store-hooks';
import { addUserCredentials } from '../store/authSlice';
import {
  LOCAL_STORAGE_KEYS,
  LOGIN_CLICK_TYPE,
  TEST_USER,
  TOAST_TYPE,
} from '../constants';
import { loginService, showToast } from '../utils/utils';
import { useNavigateIfRegistered } from '../hooks';
import PageLoader from './PageLoader';

const LoginCard = () => {
  const location = useLocation();
  const tokenFromSlice = useAppSelector((store) => store.auth.token);

  useNavigateIfRegistered(tokenFromSlice);

  const dispatch = useAppDispatch();

  const initialLoginState = {
    email: '',
    password: '',
  };
  const [activeBtnLoader, setActiveBtnLoader] = useState('');

  const [inputs, setInputs] = useState(initialLoginState);

  const toast = useToast();

  const colorModeValue = {
    bgColor: useColorModeValue('gray.50', 'gray.800'),
    cardBgColor: useColorModeValue('white', 'gray.700'),
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  // used for both the buttons
  const handleSubmit = async (
    e: React.MouseEvent<HTMLButtonElement> | React.FormEvent,
    clickType: string
  ) => {
    e.preventDefault();

    const isGuestClick = clickType === LOGIN_CLICK_TYPE.GuestClick;
    const userInfo = isGuestClick ? TEST_USER : inputs;

    setActiveBtnLoader(clickType);

    if (isGuestClick) {
      setInputs(TEST_USER);
    }

    try {
      const { message, token } = await loginService({
        email: userInfo.email,
        password: userInfo.password,
      });

      // update userSlice with data
      dispatch(addUserCredentials(token));

      // store this data in localStorage
      localStorage.setItem(LOCAL_STORAGE_KEYS.Token, token);

      // show success toast
      showToast({
        toast,
        type: TOAST_TYPE.Success,
        message,
      });
    } catch (error: any) {
      console.error(error.message);

      showToast({
        toast,
        type: TOAST_TYPE.Error,
        message: error.message,
      });
    } finally {
      setActiveBtnLoader('');
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
          <Heading fontSize={{ base: '2xl', md: '3xl' }}>
            Login to your account
          </Heading>

          <Text fontSize={{ base: 'md', md: 'lg' }} color={'gray.600'}>
            to enjoy all of our cool features ✌️
          </Text>
        </Stack>

        <Box
          rounded={'lg'}
          bg={colorModeValue.cardBgColor}
          boxShadow={'lg'}
          p={8}
          w='70vw'
          maxW='450px'
        >
          <Stack
            as='form'
            spacing='5'
            onSubmit={(e) => handleSubmit(e, LOGIN_CLICK_TYPE.RegisterClick)}
          >
            <FormControl id='email' isRequired>
              <FormLabel>Email Address</FormLabel>
              <Input
                name='email'
                type='email'
                id='email'
                onChange={handleInputChange}
                value={inputs.email}
                disabled={!!activeBtnLoader}
              />
            </FormControl>

            <PasswordInput
              label='Password'
              name='password'
              id='password'
              onChange={handleInputChange}
              value={inputs.password}
              disabled={!!activeBtnLoader}
            />

            <Button
              type='submit'
              bg={'blue.400'}
              color={'white'}
              _hover={{
                bg: 'blue.500',
              }}
              isLoading={activeBtnLoader === LOGIN_CLICK_TYPE.RegisterClick}
              isDisabled={!!activeBtnLoader}
            >
              Login
            </Button>
          </Stack>

          <Button
            type='button'
            w='full'
            mt='.5rem'
            onClick={(e) => handleSubmit(e, LOGIN_CLICK_TYPE.GuestClick)}
            bg={'blue.400'}
            color={'white'}
            _hover={{
              bg: 'blue.500',
            }}
            textAlign={'center'}
            isLoading={activeBtnLoader === LOGIN_CLICK_TYPE.GuestClick}
            isDisabled={!!activeBtnLoader}
          >
            Guest Login
          </Button>

          <Stack mt={4}>
            <Text align={'center'}>
              Not Registered?{' '}
              <ChakraLink
                as={Link}
                color={'blue.400'}
                _hover={{ textDecoration: 'none' }}
                state={{ from: location?.state?.from || '/' }}
                to='/signup'
              >
                Sign up
              </ChakraLink>
            </Text>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
};

export default LoginCard;
