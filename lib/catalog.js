// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import supabase from './Supabase';

export async function getRandomVideo(excludeArray) {


  
  console.log({value: toValuesStr(excludeArray), original: excludeArray})
  
  const {data, error} = await supabase.from("random_videos")
  .select("*")
  .not('id', 'in', toValuesStr(excludeArray))
  .not("quality", "is", null)
  .eq("storage", process.env.NEXT_PUBLIC_STORAGE_ID)
  .limit(1)
  .single()
  

  return { data, error}
  
}
export async function getVideoPaths () {
  const {data, error} = await supabase.from("videos")
  .select("id")
  .eq("storage", process.env.NEXT_PUBLIC_STORAGE_ID)

  const paths = data.map((d) => {
    return {params: { id: d.id.toString() }}
  })
  return paths;


}

export async function getSpecificVideo (id) {

  const _id = parseInt(id)
  console.log({value: _id, input: id})

  const { data, error } = await supabase.from("videos")
  .select("*")
  .eq("id", _id)
  .limit(1)
  .single()

  return { data, error }
}

function toValuesStr(data)
{
    let values = data.map((k) => `"${k}"`).join(",");
    return `(${values})`;
}



export async function getRandomVideos(limit) {

  const {data, error} = await supabase.from("random_videos")
  .select("*")
  .eq("storage", process.env.NEXT_PUBLIC_STORAGE_ID)
  .not("quality", "is", null)
  .limit(limit)
  
  return { data, error}


}
  
  