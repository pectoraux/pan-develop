import styled from 'styled-components'
import NextLink from 'next/link'
import { Flex, Skeleton, UserMenuItem } from '@pancakeswap/uikit'
import { useWeb3React } from '@pancakeswap/wagmi'
import { useTranslation } from '@pancakeswap/localization'

interface CanCanUserMenuItemProps {
  isLoading: boolean
  hasChannel: boolean
  disabled: boolean
}

const Dot = styled.div`
  background-color: ${({ theme }) => theme.colors.failure};
  border-radius: 50%;
  height: 8px;
  width: 8px;
`

const CanCanUserMenuItem: React.FC<React.PropsWithChildren<CanCanUserMenuItemProps>> = ({
  isLoading,
  hasChannel,
  disabled,
}) => {
  const { account } = useWeb3React()
  const { t } = useTranslation()
  
  if (isLoading) {
    return (
      <UserMenuItem>
        <Skeleton height="24px" width="35%" />
      </UserMenuItem>
    )
  }

  if (!hasChannel) {
    return (
      <NextLink href="/create-channel" passHref>
        <UserMenuItem as="a" disabled={disabled}>
          <Flex alignItems="center" justifyContent="space-between" width="100%">
            {t('Make a Channel')}
            <Dot />
          </Flex>
        </UserMenuItem>
      </NextLink>
    )
  }

  return (
    <NextLink href={`/cancan/${account?.toLowerCase()}`} passHref>
      <UserMenuItem as="a" disabled={disabled}>
        {t('Your Channel')}
      </UserMenuItem>
    </NextLink>
  )
}

export default CanCanUserMenuItem
