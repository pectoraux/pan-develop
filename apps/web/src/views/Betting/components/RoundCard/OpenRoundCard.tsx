import { useTranslation } from '@pancakeswap/localization'
import {
  ArrowDownIcon,
  ArrowUpIcon,
  Button,
  Card,
  CardBody,
  PlayCircleOutlineIcon,
  useToast,
  useTooltip,
  Flex,
  Text,
} from '@pancakeswap/uikit'
import { useWeb3React } from '@pancakeswap/wagmi'
import { ToastDescriptionWithTx } from 'components/Toast'
import useLocalDispatch from 'contexts/LocalRedux/useLocalDispatch'
import useTheme from 'hooks/useTheme'
import { useEffect, useMemo, useState } from 'react'
// import { fetchLedgerData } from 'state/bettings'
import { ROUND_BUFFER } from 'state/bettings/config'
import { BetPosition, NodeLedger, NodeRound } from 'state/types'
import { getNow } from 'utils/getNow'
import { useConfig } from 'views/Betting/context/ConfigProvider'
import { formatBnbv2 } from '../../helpers'
import CardFlip from '../CardFlip'
import { PrizePoolRow, RoundResultBox } from '../RoundResult'
import CardHeader, { getBorderBackground } from './CardHeader'
import MultiplierArrow from './MultiplierArrow'
import SetPositionCard from './SetPositionCard'

interface OpenRoundCardProps {
  round: NodeRound
  betAmount?: NodeLedger['amount']
  hasEnteredUp: boolean
  hasEnteredDown: boolean
  bullMultiplier: string
  bearMultiplier: string
}

interface State {
  isSettingPosition: boolean
  position: BetPosition
}

const OpenRoundCard: React.FC<any> = ({
  betting,
  betAmount,
  hasEnteredUp,
  hasEnteredDown,
  setBettingId,
  setAllBettings,
  allBettings,
  onTokenSwitch,
}) => {
  const [state, setState] = useState<State>({
    isSettingPosition: false,
    position: BetPosition.BULL,
  })
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { toastSuccess } = useToast()
  const { account } = useWeb3React()
  const dispatch = useLocalDispatch()
  // const { token, displayedDecimals } = useConfig()
  const { isSettingPosition, position } = state
  const [isBufferPhase, setIsBufferPhase] = useState(false)
  const positionDisplay = useMemo(
    () => (position === BetPosition.BULL ? t('Up').toUpperCase() : t('Down').toUpperCase()),
    [t, position],
  )
  const positionEnteredText = useMemo(
    () => (hasEnteredUp ? t('Up').toUpperCase() : hasEnteredDown ? t('Down').toUpperCase() : null),
    [t, hasEnteredUp, hasEnteredDown],
  )
  const positionEnteredIcon = useMemo(
    () =>
      hasEnteredUp ? (
        <ArrowUpIcon color="currentColor" />
      ) : hasEnteredDown ? (
        <ArrowDownIcon color="currentColor" />
      ) : null,
    [hasEnteredUp, hasEnteredDown],
  )
  const { targetRef, tooltipVisible, tooltip } = useTooltip(
    <div style={{ whiteSpace: 'nowrap' }}>
      sldksdk
      {/* {`${formatBnbv2(betAmount, displayedDecimals)} ${token.symbol}`} */}
      </div>,
    { placement: 'top' },
  )

  // useEffect(() => {
  //   const secondsToLock = lockTimestamp ? lockTimestamp - getNow() : 0
  //   if (secondsToLock > 0) {
  //     const setIsBufferPhaseTimeout = setTimeout(() => {
  //       setIsBufferPhase(true)
  //     }, (secondsToLock - ROUND_BUFFER) * 1000)

  //     return () => {
  //       clearTimeout(setIsBufferPhaseTimeout)
  //     }
  //   }
  //   return undefined
  // }, [lockTimestamp])

  // const getHasEnteredPosition = () => {
  //   if (hasEnteredUp || hasEnteredDown) {
  //     return false
  //   }

  //   // if (round.lockPrice !== null) {
  //   //   return false
  //   // }

  //   return true
  // }

  // const canEnterPosition = getHasEnteredPosition()

  // const handleBack = () =>
  //   setState((prevState) => ({
  //     ...prevState,
  //     isSettingPosition: false,
  //   }))

  // const handleSetPosition = (newPosition: BetPosition) => {
  //   setState((prevState) => ({
  //     ...prevState,
  //     isSettingPosition: true,
  //     position: newPosition,
  //   }))
  // }

  // const togglePosition = () => {
  //   setState((prevState) => ({
  //     ...prevState,
  //     position: prevState.position === BetPosition.BULL ? BetPosition.BEAR : BetPosition.BULL,
  //   }))
  // }

  // const handleSuccess = async (hash: string) => {
  //   await dispatch(fetchLedgerData({ account, epochs: [round.epoch] }))

    // handleBack()

    // toastSuccess(
    //   t('Success!'),
    //   <ToastDescriptionWithTx txHash={hash}>
    //     {t('%position% position entered', {
    //       position: positionDisplay,
    //     })}
    //   </ToastDescriptionWithTx>,
    // )
  // }
  const variants = ["success", "primary", "secondary", "tertiary", "light", "danger"]
  

  return (
    <CardFlip isFlipped={isSettingPosition} height="404px">
      <Card borderBackground={getBorderBackground(theme, 'next')}
        style={{ cursor: "pointer" }}
      >
        <CardHeader
          status="next"
          epoch={betting?.idx}
          icon={<PlayCircleOutlineIcon color="white" mr="4px" width="21px" />}
          title={t('Next')}
        />
        <CardBody p="16px">
          <RoundResultBox 
          isNext
          isLive
          // isNext={canEnterPosition} 
          // isLive={!canEnterPosition}
          >
            {true
            // canEnterPosition 
            ? (
              <>
                <PrizePoolRow betting={betting} mb="8px"/>
                <Flex 
                  justifyContent='flex-start'
                  alignItems="center" 
                  flexDirection="column" 
                  overflow="auto"
                  maxHeight="200px"
                >
                  {betting?.subjects?.map((subject, index) => 
                    <Button
                      // variant={variants[index % 6]}
                      width="150px"
                      height="200px"
                      // onClick={() => handleSetPosition(BetPosition.BULL)}
                      mb="4px"
                      disabled={!true || isBufferPhase}
                      // disabled={!canEnterPosition || isBufferPhase}
                    >
                      <Text fontSize="12px" bold color="secondary" as="span" textTransform="uppercase">
                       {subject} 
                      </Text>
                    </Button>
                  )}
                </Flex>
              </>
            ) : positionEnteredText ? (
              <>
                <div ref={targetRef}>
                  <Button disabled startIcon={positionEnteredIcon} width="100%" mb="8px">
                    {t('%position% Entered', { position: positionEnteredText })}
                  </Button>
                </div>
                <PrizePoolRow totalAmount={10} />
                {tooltipVisible && tooltip}
              </>
            ) : (
              <>
                <div>
                  <Button disabled width="100%" mb="8px">
                    {t('No position entered')}
                  </Button>
                </div>
                <PrizePoolRow totalAmount={10} />
              </>
            )}
          </RoundResultBox>
          <MultiplierArrow
            allBettings={allBettings}
            action={betting?.action}
            adminShare={betting?.adminShare}
            referrerShare={betting?.referrerShare}
            bettingId={betting?.bettingId}
            rewardBreakdown={betting?.rewardBreakdown}
          />
        </CardBody>
      </Card>
      <SetPositionCard
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        onBack={()=>{}}
        // onBack={handleBack}
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        onSuccess={()=>{}}
        // onSuccess={handleSuccess}
        position={position}
        // togglePosition={togglePosition}
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        togglePosition={()=>{}}
        epoch={betting?.idx}
      />
    </CardFlip>
  )
}

export default OpenRoundCard
