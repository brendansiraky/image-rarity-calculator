// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
    name: string
}

type DropboxFolder = {
    entries: {
        id: string
        name: string
        parent_shared_folder_id: string
        path_display: string
        path_lower: string
    }[]
}

async function fetcher(path: string) {
    const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ path: `/unphased assets${path}` })
    })

    const result = await response.json()
    return result
}

const endpoint = 'https://api.dropboxapi.com/2/files/list_folder'
const token = 'sl.BW4IpMO4Sk_-y-WBeolb97HbGLX7AoQZXHeiUiZU2g6XLwuM65Iwa2ZcgR_mVvBOsoaUnmzVdIFtcP2U7O1cVeiolYkF_sFK84uDoEM_Y3XZEjQQtwLLNm17sNVLdLUlNrBeIfpa'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>) {

    const traitsFolders = await fetcher('/traits') as DropboxFolder
   
    const result = await Promise.all(traitsFolders.entries.map(async folder => {
        const innerFolder = await fetcher(`/traits/${folder.name}`) as any

        return {
            [folder.name]: innerFolder.entries.map((e: any) => e.name)
        }
    }))

    res.status(200).json(JSON.stringify(result))
}
