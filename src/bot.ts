/* import tracer from 'dd-trace'; */
import Client from './structures/Client.js';
const client = new Client()
/* tracer.init({
    profiling: true,
    runtimeMetrics: true,
    experimental: {
        b3: true,
    },
    dbmPropagationMode: 'full'
}); */
client.init()
export default client
