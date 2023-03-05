// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import fs from 'fs';
import supabase from '../../lib/Supabase';

export default async function handler(req, res) {

    var exclusion = parseInt( req.query.exclude );
    if (!req.query.exclude) {
      exclusion = 1
    }
    console.log(exclusion)
    
    const {data, error} = await supabase.from("random_videos")
    .select("*")
    .limit(1)
    .not("id", 'eq', exclusion)
    .single()
    

    console.log({data, error})


    if (data?.id) {
      res.status(200).json({id: data.id})
      return;
    }
    
    res.status(404).json({error: error})

  }
  