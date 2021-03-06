import React, { useContext } from 'react'
import {
  Flex,
  FormControl,
  InputGroup,
  InputLeftAddon,
  Input,
  Icon,
  useToast,
  Text
} from '@chakra-ui/core'
import { MyContext } from '../../../context'
import Form from '../../../components/Form'
export default function Login({ history }) {
  const toast = useToast()
  const context = useContext(MyContext)
  const submit = async e => {
    const { user, msg } = await context.handleLoginSubmit(e)
    if (user) {
      history.push('/services')
    } else {
      toast({
        title: 'Verifica tus credenciales',
        description: msg,
        status: 'error',
        duration: 9000,
        isClosable: true
      })
    }
  }
  return (
      <MyContext.Consumer>
      {context => {
        return (
          <Flex
            backgroundColor="c1.100"
            w="100vw"
            h="90vh"
            align="center"
            justify="center"
          >
            
            <Form submit={submit} bgColor="white" title="Descargar">
              <FormControl isRequired>
              <Text mb={2}>Inicia con tus credenciales del SAT</Text>
                <InputGroup>
                  <InputLeftAddon children={<Icon name="email" color="c2.100" />} />
                  <Input
                    onChange={context.handleLoginInput}
                    placeholder="Email"
                    name="email"
                    type="email"
                    value={context.state.formLogin.email}
                  />
                </InputGroup>
              </FormControl>
              <FormControl isRequired>
                <InputGroup>
                  <InputLeftAddon children={<Icon name="lock" color="c2.100" />} />
                  <Input
                    onChange={context.handleLoginInput}
                    placeholder="Password"
                    name="password"
                    type="password"
                    value={context.state.formLogin.password}
                  />
                </InputGroup>
              </FormControl>
            </Form>
          </Flex>
        )
      }}
    </MyContext.Consumer>
  )
}
