import { Box, Spinner, Flex } from '@chakra-ui/react';

const PageLoader = () => {
  return (
    <Flex
      position='fixed'
      top={0}
      left={0}
      right={0}
      bottom={0}
      alignItems='center'
      justifyContent='center'
      backgroundColor='rgba(0, 0, 0, 0.5)'
      zIndex={15}
    >
      <Box>
        <Spinner size='xl' color='#fff' />
      </Box>
    </Flex>
  );
};

export default PageLoader;
