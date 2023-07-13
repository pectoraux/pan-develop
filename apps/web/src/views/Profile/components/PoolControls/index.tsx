import { useWeb3React } from '@pancakeswap/wagmi'
import { Profile } from '@pancakeswap/uikit'
import { useUserPoolStakedOnly, useUserPoolsViewMode } from 'state/user/hooks'
import { useInitialBlock } from 'state/block/hooks'
import { BSC_BLOCK_TIME } from 'config'
import { Token } from '@pancakeswap/sdk'
import { useState } from 'react'

const POOL_START_BLOCK_THRESHOLD = (60 / BSC_BLOCK_TIME) * 4

export default function PoolControlsContainer(props) {
  const [mineOnly, setMineOnly] = useState(false)
  const [followingOnly, setFollowingOnly] = useState(false)
  const [followersOnly, setFollowersOnly] = useState(false)
  const [viewMode, setViewMode] = useUserPoolsViewMode()
  const { account } = useWeb3React()
  const initialBlock = useInitialBlock()
  const threshHold = initialBlock > 0 ? initialBlock + POOL_START_BLOCK_THRESHOLD : 0

  return (
    <Profile.PoolControls<Token>
      {...props}
      mineOnly={mineOnly}
      setMineOnly={setMineOnly}
      followingOnly={followingOnly} 
      followersOnly={followersOnly} 
      setFollowersOnly={setFollowersOnly}
      setFollowingOnly={setFollowingOnly}
      viewMode={viewMode}
      setViewMode={setViewMode}
      account={account}
      threshHold={threshHold}
    />
  )
}
