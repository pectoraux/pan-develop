import { useWeb3React } from '@pancakeswap/wagmi'
import { AutoRenewIcon, HistoryIcon, IconButton } from '@pancakeswap/uikit'
import useLocalDispatch from 'contexts/LocalRedux/useLocalDispatch'
// import { setHistoryPaneState } from 'state/predictions'
// import { useGetIsFetchingHistory } from 'state/bettings/hooks'

const HistoryButton = ({ isHistoryPaneOpen, setHistoryPaneState }) => {
  const isFetchingHistory = false // useGetIsFetchingHistory()
  const dispatch = useLocalDispatch()
  const { account } = useWeb3React()

  const handleClick = () => {
    dispatch(setHistoryPaneState(!isHistoryPaneOpen))
  }

  return (
    <IconButton
      id="betting-history-button"
      variant="subtle"
      onClick={handleClick}
      isLoading={isFetchingHistory}
      disabled={!account}
    >
      {isFetchingHistory ? <AutoRenewIcon spin color="white" /> : <HistoryIcon width="24px" color="white" />}
    </IconButton>
  )
}

export default HistoryButton
