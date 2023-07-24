import { Flex, Text, TokenImage, useMatchBreakpoints, Pool } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { memo } from 'react'
import styled from 'styled-components'
import SaveIcon from 'views/Info/components/SaveIcon'
import { getVaultPosition, VaultPosition, VaultPositionParams } from 'utils/cakePool'
import { Token } from '@pancakeswap/sdk'
import { useWatchlistTokens } from 'state/user/hooks'
import BaseCell, { CellContent } from './BaseCell'

interface NameCellProps {
  pool?: any
}

const StyledCell = styled(BaseCell)`
  flex: 5;
  flex-direction: row;
  padding-left: 12px;
  ${({ theme }) => theme.mediaQueries.sm} {
    flex: 1 0 150px;
    padding-left: 32px;
  }
`

const NameCell: React.FC<any> = ({ pool, symbol }) => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()
  const { sousId } = pool

  const title: React.ReactNode = `${t('Item')}: ${pool?.tokenId}`
  const subtitle: React.ReactNode = `${t('Stake')} ${symbol}`
  const showSubtitle = sousId !== 0 || (sousId === 0 && !isMobile)

  const [watchlistTokens, addWatchlistToken] = useWatchlistTokens()

  return (
    <StyledCell role="cell">
      <TokenImage mr="8px" width={40} height={40} src={pool?.avatar}/>
      <CellContent>
        <Text bold={!isMobile} small={isMobile}>
          <Flex flexDirection="row">
            {title}
            <SaveIcon 
              fill={watchlistTokens.includes(pool?.timestamp)} 
              onClick={() => addWatchlistToken(pool?.timestamp)} 
              style={{ marginLeft: "10px", position: "relative", top: "-5px" }}
            />
          </Flex>
        </Text>    
        {showSubtitle && (
          <Text fontSize="12px" color="textSubtle">
            {subtitle}
          </Text>
        )}
      </CellContent>
    </StyledCell>
  )
}

export default NameCell

const stakedStatus = {
  [VaultPosition.None]: { text: '', color: 'secondary' },
  [VaultPosition.Locked]: { text: 'Locked', color: 'secondary' },
  [VaultPosition.LockedEnd]: { text: 'Locked End', color: 'secondary' },
  [VaultPosition.AfterBurning]: { text: 'After Burning', color: 'failure' },
  [VaultPosition.Flexible]: { text: 'Flexible', color: 'success' },
}

export const StakedCakeStatus: React.FC<React.PropsWithChildren<VaultPositionParams>> = memo(
  ({ userShares, locked, lockEndTime }) => {
    const vaultPosition = getVaultPosition({ userShares, locked, lockEndTime })
    const { t } = useTranslation()
    return (
      <Text fontSize="12px" bold color={stakedStatus[vaultPosition].color} textTransform="uppercase">
        {t(stakedStatus[vaultPosition].text)}
      </Text>
    )
  },
)
