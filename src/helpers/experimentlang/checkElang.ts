import axios from 'axios'

const outputRegexp = /savevariable\( *"([^"]+)"/g

export async function getPersistentFromTask(taskID : string, taskVersion : string) : Promise<string[]>
{    
    const response = await axios.get("/api/task/" + taskID + "/" + taskVersion)
    return [...response.data.code.matchAll(outputRegexp)].map((x) => x[1]);    
}
