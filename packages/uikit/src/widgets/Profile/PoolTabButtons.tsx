import { useRouter } from "next/router";
import styled from "styled-components";
import { useTranslation } from "@pancakeswap/localization";
import { ButtonMenu, ButtonMenuItem, Toggle, Text, NotificationDot, NextLinkFromReactRouter } from "../../components";
import { ToggleView, ViewMode } from "../../components/ToggleView";

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
  mineOnly: boolean;
  setMineOnly: (s: boolean) => void;
  followersOnly: boolean;
  followingOnly: boolean;
  account: string;
  setFollowersOnly: (s: boolean) => void;
  setFollowingOnly: (s: boolean) => void;
  viewMode: ViewMode;
  setViewMode: (s: ViewMode) => void;
  hasStakeInFinishedPools: boolean;
}

const PoolTabButtons = ({
  mineOnly,
  account,
  setMineOnly,
  followingOnly, 
  followersOnly, 
  setFollowersOnly,
  setFollowingOnly,
  viewMode,
  setViewMode,
}: any) => {
  const router = useRouter();

  const { t } = useTranslation();
  const isExact = router.asPath.includes('bounties')
  
  const viewModeToggle = <ToggleView idPrefix="clickPool" viewMode={viewMode} onToggle={setViewMode} />;

  const liveOrFinishedSwitch = (
    <Wrapper>
      <ButtonMenu activeIndex={!isExact ? 0 : 1} scale="sm" variant="subtle">
        <ButtonMenuItem as={NextLinkFromReactRouter} to={`/profile/${account}/transfers`} replace>
          {t('Profiles')}
        </ButtonMenuItem>
        <ButtonMenuItem as={NextLinkFromReactRouter} to={`/profile/${account}/transfers#bounties`} replace>
          {t('Bounties')}
        </ButtonMenuItem>
      </ButtonMenu>
    </Wrapper>
  );

  const mineOnlySwitch = (
    <ToggleWrapper>
      <Toggle checked={mineOnly} onChange={() => setMineOnly(!mineOnly)} scale="sm" />
      <Text> {t("Mine")}</Text>
    </ToggleWrapper>
  );
  
  const followersOnlySwitch = (
    <ToggleWrapper>
      <Toggle checked={followersOnly} onChange={() => setFollowersOnly(!followersOnly)} scale="sm" />
      <Text> {t('Followers')}</Text>
    </ToggleWrapper>
  )

  const followingOnlySwitch = (
    <ToggleWrapper>
      <Toggle checked={followingOnly} onChange={() => setFollowingOnly(!followingOnly)} scale="sm" />
      <Text> {t('Following')}</Text>
    </ToggleWrapper>
  )

  return (
    <ViewControls>
      {viewModeToggle}
      {mineOnlySwitch}
      {followersOnlySwitch}
      {followingOnlySwitch}
      {liveOrFinishedSwitch}
    </ViewControls>
  );
};

export default PoolTabButtons;
