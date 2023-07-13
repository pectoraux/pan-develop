import { useRouter } from "next/router";
import styled from "styled-components";
import { useTranslation } from "@pancakeswap/localization";
import { ButtonMenu, ButtonMenuItem, Toggle, Text, NotificationDot, NextLinkFromReactRouter, LinkExternal } from "../../components";
import { ToggleView, ViewMode } from "../../components/ToggleView";

const StyledLinkExternal = styled(LinkExternal)`
  font-weight: 400;
`

const ToggleWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-left: 10px;

  ${Text} {
    margin-left: 8px;
  }
`;

const ViewControls = styled.div`
  flex-wrap: wrap;
  justify-content: space-between;
  display: flex;
  align-items: center;
  width: 100%;

  > div {
    padding: 8px 0px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    justify-content: flex-start;
    width: auto;

    > div {
      padding: 0;
    }
  }
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  a {
    padding-left: 12px;
    padding-right: 12px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    margin-left: 16px;
  }
`;

interface PoolTableButtonsPropsType {
  stakedOnly: boolean;
  setStakedOnly: (s: boolean) => void;
  favoritesOnly: boolean;
  setFavoritesOnly: (s: boolean) => void;
  viewMode: ViewMode;
  setViewMode: (s: ViewMode) => void;
  hasStakeInFinishedPools: boolean;
}

const PoolTabButtons = ({
  stakedOnly,
  setStakedOnly,
  favoritesOnly, 
  setFavoritesOnly,
  viewMode,
  setViewMode,
}: any) => {
  const router = useRouter();

  const { t } = useTranslation();

  const isExact = router.pathname.includes('stakemarket')
  const isBounty = router.pathname.includes('trustbounties')
  const isVP = router.pathname.includes('valuepools')
  const isFromContracts = router.asPath.includes('#stakemarket')
  || router.asPath.includes('#trustbounties')
  || router.asPath.includes('#valuepools')
  const current = isExact ? 'stakemarket' : isBounty ? 'trustbounties' : isVP ? 'valuepools' : ""
  const currentFromContracts = router.asPath.includes('#stakemarket') 
  ? 'stakemarket' 
  : router.asPath.includes('#trustbounties') 
  ? 'trustbounties'
  : router.asPath.includes('#valuepools') 
  ? 'valuepools'
  : 'litigations'
  const indexFromContracts = router.asPath.includes('#stakemarket')
  ? 0 
  : router.asPath.includes('#trustbounties')
  ? 1 
  : router.asPath.includes('#valuepools')
  ? 2
  : 3
  const indexFromRoot = isExact ? 0 : isBounty ? 1 : isVP ? 2 : 3
  const { collectionAddress } = router.query
  const viewModeToggle = <ToggleView idPrefix="clickPool" viewMode={viewMode} onToggle={setViewMode} />;

  const liveOrFinishedSwitch = (
    <Wrapper>
      <ButtonMenu activeIndex={isFromContracts ? indexFromContracts : indexFromRoot} scale="sm" variant="subtle">
        <ButtonMenuItem as={NextLinkFromReactRouter} 
          to={isFromContracts ? `/cancan/collections/${collectionAddress}#stakemarket` : "/stakemarket"} replace>
          {t('Stakes')}
        </ButtonMenuItem>
        <ButtonMenuItem as={NextLinkFromReactRouter} 
          to={isFromContracts ? `/cancan/collections/${collectionAddress}#trustbounties` : "/trustbounties"} replace>
          {t('Bounties')}
        </ButtonMenuItem>
        <ButtonMenuItem as={NextLinkFromReactRouter} 
          to={isFromContracts ? `/cancan/collections/${collectionAddress}#valuepools` : "/valuepools"} replace>
          {t('ValuePools')}
        </ButtonMenuItem>
        <NotificationDot show>
          <StyledLinkExternal href={`/${isFromContracts ? currentFromContracts : current}/voting`}>
            {t('Litigations')}
          </StyledLinkExternal>
        </NotificationDot>
      </ButtonMenu>
    </Wrapper>
  );

  const stakedOnlySwitch = (
    <ToggleWrapper>
      <Toggle checked={stakedOnly} onChange={() => setStakedOnly(!stakedOnly)} scale="sm" />
      <Text> {t("Staked only")}</Text>
    </ToggleWrapper>
  );
  
  const favoritesOnlySwitch = (
    <ToggleWrapper>
      <Toggle checked={favoritesOnly} onChange={() => setFavoritesOnly(!favoritesOnly)} scale="sm" />
      <Text> {t('Favorites')}</Text>
    </ToggleWrapper>
  )

  return (
    <ViewControls>
      {viewModeToggle}
      {stakedOnlySwitch}
      {favoritesOnlySwitch}
      {liveOrFinishedSwitch}
    </ViewControls>
  );
};

export default PoolTabButtons;
