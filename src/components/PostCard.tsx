import {
  Avatar,
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
  Heading,
  Icon,
  IconButton,
  Image,
  Link as ChakraLink,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  Text,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { BsBookmark, BsThreeDotsVertical, BsHeart } from 'react-icons/bs';
import { TfiComment } from 'react-icons/tfi';
import { HiShare } from 'react-icons/hi';

const PostCard = ({ postData }) => {
  const handleCopyToClipboard = () => {
    console.log('copy');
  };

  return (
    <Card boxShadow='md' cursor='default' w='full'>
      <CardHeader as='header' pb={{ base: '.5rem', md: '1rem' }}>
        <Flex>
          <ChakraLink
            as={Link}
            to={`/profile/${123}`}
            _hover={{
              textDecoration: 'none',
            }}
          >
            <Flex
              gap={{ base: '2', md: '4' }}
              alignItems='center'
              flexWrap='wrap'
            >
              <Avatar
                size={{ base: 'sm', md: 'md' }}
                name='Segun Adebayo'
                src='https://bit.ly/sage-adebayo'
              />

              <Box>
                <Heading
                  size={{ base: 'xs', md: 'md' }}
                  mb={{ base: '.15rem', md: '.25rem' }}
                >
                  Segun Adebayo
                </Heading>

                <Text
                  fontSize={{ base: '.75rem', md: '.9rem' }}
                  letterSpacing='wider'
                >
                  Apr 06 2022
                </Text>
              </Box>
            </Flex>
          </ChakraLink>

          <Spacer />

          <Menu>
            <MenuButton
              variant='ghost'
              colorScheme='gray'
              borderRadius='50%'
              aria-label='Options'
              as={IconButton}
              icon={<BsThreeDotsVertical />}
            />
            <MenuList minW='10rem' p='0' boxShadow='xl'>
              <MenuItem as={Button} borderRadius='none'>
                Edit
              </MenuItem>
              <MenuItem as={Button} borderRadius='none'>
                Delete
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </CardHeader>

      <CardBody pt='0' as='main'>
        <ChakraLink
          as={Link}
          to={`/post/${123}`}
          _hover={{ textDecoration: 'none' }}
        >
          <Text fontSize={{ base: '.85rem', md: '1.1rem' }}>
            With Chakra UI, I wanted to sync the speed of development with the
            speed of design. I wanted the developer to be just as excited as the
            designer to create a screen 😂.
          </Text>
        </ChakraLink>
      </CardBody>

      <Image
        objectFit='cover'
        src='https://images.unsplash.com/photo-1531403009284-440f080d1e12?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80'
        alt='Chakra UI'
      />

      <CardFooter
        py={{ base: '.5rem', md: '1rem' }}
        as='footer'
        display='flex'
        alignItems='center'
        gap={{ base: '.75rem', md: '.95rem' }}
      >
        <Box
          display='flex'
          alignItems='center'
          gap={{ base: '0', md: '.1rem' }}
        >
          <IconButton
            variant='ghost'
            aria-label='Like Unlike Toggle'
            cursor='pointer'
            borderRadius='50%'
            bg='transparent'
            fontSize={{ base: '1rem', md: '1.25rem' }}
            w='2rem'
          >
            <Icon as={BsHeart} />
          </IconButton>

          <Text>1</Text>
        </Box>

        <Box
          display='flex'
          alignItems='center'
          gap={{ base: '0', md: '.1rem' }}
        >
          <IconButton
            variant='ghost'
            aria-label='Like Unlike Toggle'
            cursor='pointer'
            borderRadius='50%'
            bg='transparent'
            fontSize={{ base: '1rem', md: '1.25rem' }}
            w='2rem'
          >
            <Icon as={TfiComment} />
          </IconButton>

          <Text>3</Text>
        </Box>

        <IconButton
          variant='ghost'
          aria-label='Like Unlike Toggle'
          cursor='pointer'
          borderRadius='50%'
          bg='transparent'
          fontSize={{ base: '1rem', md: '1.25rem' }}
          w='2rem'
        >
          <Icon as={BsBookmark} />
        </IconButton>

        <Spacer />

        <IconButton
          variant='ghost'
          aria-label='Like Unlike Toggle'
          boxSize={6}
          cursor='pointer'
          borderRadius='50%'
          p='1.15rem'
          bg='transparent'
          fontSize={{ base: '1rem', md: '1.25rem' }}
          onClick={handleCopyToClipboard}
        >
          <Icon as={HiShare} />
        </IconButton>
      </CardFooter>
    </Card>
  );
};

export default PostCard;
