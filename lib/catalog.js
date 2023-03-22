// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import supabase from './Supabase';

export async function getRandomVideo(excludeArray) {


  
  console.log({value: toValuesStr(excludeArray), original: excludeArray})
  
  const {data, error} = await supabase.from("random_videos")
  .select("*")
  .not('id', 'in', toValuesStr(excludeArray))
  .eq("storage", process.env.NEXT_PUBLIC_STORAGE_ID)
  .limit(1)
  .single()
  
  
  
  console.log({data, error}) 
  return { data, error}
  
}

export async function getSpecificVideo (id) {

  const _id = parseInt(id)
  console.log({value: _id, input: id})

  const { data, error } = await supabase.from("videos")
  .select("*")
  .eq("id", _id)
  .limit(1)
  .single()

  console.log({data, error})
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
  .limit(limit)
  
  
  
  console.log({data, error}) 
  return { data, error}


}
  
  