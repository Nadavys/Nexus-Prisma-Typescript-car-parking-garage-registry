import { ApolloServer } from 'apollo-server'
import { context} from './context'
import {schema} from './schema'

const server = new ApolloServer({
    schema,
    context
})

server.listen().then(
    async ({url})=>{
        console.log(`Apollo server running ${url}`)
    }
)