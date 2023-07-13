import styled from 'styled-components'
import { useRouter } from 'next/router'
import { BigNumber } from '@ethersproject/bignumber'
import { Box, Flex, Text, useTooltip, HelpIcon, LinkExternal } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { BetPosition } from 'state/types'
import { RoundMultiplierDownArrow } from '../../RoundMultiplierArrows'

interface MultiplierArrowProps {
  betAmount?: BigNumber
  multiplier?: string
  hasEntered?: boolean
  hasClaimed?: boolean
  betPosition?: BetPosition
  isDisabled?: boolean
  isActive?: boolean
  isHouse?: boolean
}

const ArrowWrapper = styled.div`
  height: 65px;
  margin: 0 auto;
  width: 240px;
`

const Content = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  left: 0;
  height: 100%;
  justify-content: center;
  position: absolute;
  top: 0;
  width: 100%;
`

const EnteredTagWrapper = styled.div`
  position: absolute;
  z-index: 10;
`

const getTextColor =
  (fallback = 'textSubtle') =>
  (isActive: boolean, isDisabled: boolean, isHouse: boolean) => {
    if (isDisabled || isHouse) {
      return 'textDisabled'
    }

    if (isActive) {
      return 'white'
    }

    return fallback
  }

const MultiplierArrow: React.FC<any> = ({
  allBettings,
  bettingId,
  action,
  rewardsBreakdown,
  adminShare,
  referrerShare,
  isDisabled = false,
  isActive = false,
  isHouse = false,
}) => {
  const { t } = useTranslation()
  const upColor = getTextColor('success')(isActive, isDisabled, isHouse)
  const downColor = getTextColor('failure')(isActive, isDisabled, isHouse)
  const textColor = getTextColor()(isActive, isDisabled, isHouse)
  const { betting } = useRouter().query

  const TooltipComponent = () => (
    <>
      <Text mb="16px" color={upColor}>
        {t("Action:")} {action}
      </Text>
      {rewardsBreakdown?.map((rwb, idx) => <Text>{t('Bracket %bk%: %rwb%%', { bk: idx+1, rwb})}</Text>)}
    </>
  )
  const { targetRef, tooltip, tooltipVisible } = useTooltip(<TooltipComponent />, {
    placement: 'bottom-end',
    tooltipOffset: [20, 10],
  })

  const multiplierText = (
    <Box mb="5px">
      {adminShare &&
      <Flex justifyContent="center" height="14px">
        <Text fontSize="14px" color={textColor} bold lineHeight="14x">
          {`${parseInt(adminShare) / 100 ?? ''}%,`}
        </Text>
        <Text fontSize="14px" color={textColor} lineHeight="14x" ml="4px">
          {t('Admin Share')}
        </Text>
      </Flex>}
      {referrerShare &&
      <Flex justifyContent="center" height="14px">
        <Text fontSize="14px" color={textColor} bold lineHeight="14x">
          {`${parseInt(referrerShare) / 100 ?? ''}%,`}
        </Text>
        <Text fontSize="14px" color={textColor} lineHeight="14x" ml="4px">
          {t('Referrer Share')}
        </Text>
      </Flex>}
    </Box>
  )

    return (
      <>
      <Box mt="-1px" position="relative">
        <ArrowWrapper>
          <RoundMultiplierDownArrow isActive={isActive} />
          <Content>
          {multiplierText}
            <Text bold fontSize="20px" mb="8px" color={downColor} ref={targetRef} textTransform="uppercase">
              {action?.length > 10 ? t("Action") : action}
              <HelpIcon ml="4px" width="14px" height="14px" color="textSubtle" />
            </Text>
            {tooltipVisible && tooltip}
          </Content>
        </ArrowWrapper>
      </Box>
      <Flex ml="10px" justifyContent='center' alignItems="center">
        <LinkExternal href={allBettings ? `${betting}/${bettingId}` : `/bettings/${betting}` } bold={false} small>
          {t('See %val%', { val: allBettings ? "Event Periods" : "All Events" })}
        </LinkExternal>
      </Flex>
      </>
    )
}

export default MultiplierArrow
