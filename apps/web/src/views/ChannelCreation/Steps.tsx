import { useContext } from 'react'
import { useWeb3React } from '@pancakeswap/wagmi'
import NoWalletConnected from './WalletNotConnected'
import { ProfileCreationContext } from './contexts/ProfileCreationProvider'
import CreateCollection from './CreateCollection'

const Steps = () => {
  const { currentStep } = useContext(ProfileCreationContext)
  const { account } = useWeb3React()

  if (!account) {
    return <NoWalletConnected />
  }

  if (currentStep === 0) {
    return <CreateCollection />
  }

  return null
}

export default Steps
