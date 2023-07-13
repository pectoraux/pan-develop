import { useEffect, useState } from 'react'
import { firestore } from 'utils/firebase'

/* eslint-disable camelcase */
export interface DeBankTvlResponse {
  id: string
  chain: string
  name: string
  site_url: string
  logo_url: string
  has_supported_portfolio: boolean
  tvl: number
}

export const useGetStats = () => {
  const [data, setData] = useState<DeBankTvlResponse | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://openapi.debank.com/v1/protocol?id=bsc_pancakeswap')
        const responseData: DeBankTvlResponse = await response.json()

        setData(responseData)
      } catch (error) {
        console.error('Unable to fetch data:', error)
      }
    }

    fetchData()
  }, [setData])

  return data
}

export const useGetStripeAccountId = (account: string) => {
  const [data, setData] = useState<string | null>(null)
  const [err, setErr] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseData = await (await firestore.collection("offramp").doc(account).get()).data()
        if (responseData !== undefined) setData(responseData['stripeAccountId'])
      } catch (error) {
        console.error('Unable to fetch stripe account:', error)
      }
    }

    fetchData()
  }, [setData])

  return {
    data,
    callback: async function onDelete(): Promise<string> {
      try {
        await firestore.collection("offramp").doc(account).delete()
      } catch(error) {
        setErr(error)
      }
      return null
    },
    err
  }
}