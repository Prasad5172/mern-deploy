import Playlistapi from "./apis/playlistApi.json"
const doSomething = async function(playlistId,email) {
    const res = await fetch("/addtolibrary",{
        method:"POST",
        headers:{
            "Content-Type":"application/json",
        },
        body : JSON.stringify({"playlistId":playlistId,"email":email})
    })
    console.log(res)
}
    
    export default doSomething;