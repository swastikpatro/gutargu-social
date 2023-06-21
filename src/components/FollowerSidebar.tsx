import {
  Avatar,
  Box,
  Button,
  Heading,
  Spacer,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';

const FollowerSidebar = () => {
  const followButtonStyle = {
    bg: useColorModeValue('#222', '#fff'),
    color: useColorModeValue('#fff', '#222'),
    _hover: {
      bg: useColorModeValue('gray.700', 'gray.300'),
    },
  };
  return (
    <Box
      as='section'
      bg={useColorModeValue('gray.200', 'gray.700')}
      p='1rem 0 .75rem 1rem'
      borderRadius='xl'
      mt='1rem'
    >
      <Heading
        as='h2'
        fontSize='1.25rem'
        letterSpacing='wider'
        fontWeight='semibold'
        color={useColorModeValue('gray.600', 'gray.400')}
        mb='1rem'
        textAlign='center'
      >
        Suggested Users
      </Heading>

      <Box as='div' pr='.75rem' maxH='30rem' overflow='auto' borderRadius='xl'>
        {new Array(10).fill(null).map((user, index) => (
          <Box
            key={index}
            as='article'
            display='flex'
            gap='.5rem'
            mb='1rem'
            alignItems='center'
          >
            <Avatar
              size={{ base: 'sm', md: 'md' }}
              name='Ryan Florence'
              src='https://bit.ly/ryan-florence'
            />
            <Box as='div'>
              <Text fontWeight='semibold'>Swastik Patro</Text>
              <Text fontSize='1rem'>@swastikpatro</Text>
            </Box>

            <Spacer />

            <Button
              {...followButtonStyle}
              borderRadius='full'
              letterSpacing='wider'
              // isLoading
            >
              Follow
            </Button>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default FollowerSidebar;
