import { useTranslation } from "@pancakeswap/localization";
import { memo } from "react";
import { formatNumber } from '@pancakeswap/utils/formatBalance'
// import { EntryType } from 'state/types'
import { Text, TooltipText } from "../../../../components/Text";
import { Tag, TagProps } from "../../../../components/Tag/index";
import { useTooltip } from "../../../../hooks/useTooltip";
import {
  AutoRenewIcon,
  BlockIcon,
  CommunityIcon,
  RefreshIcon,
  TimerIcon,
  VerifiedIcon,
  PrizeIcon,
  AddIcon,
  ListViewIcon,
  VoteIcon,
} from "../../../../components/Svg";

const CoreTag: React.FC<React.PropsWithChildren<TagProps>> = (props) => {
  const { t } = useTranslation();
  return (
    <Tag
      variant="secondary"
      style={{ background: "none" }}
      outline
      startIcon={<VerifiedIcon width="18px" color="secondary" mr="4px" />}
      {...props}
    >
      {t("Core")}
    </Tag>
  );
};

const FarmAuctionTagToolTipContent = memo(() => {
  const { t } = useTranslation();
  return <Text color="text">{t("Farm Auction Winner, add liquidity at your own risk.")}</Text>;
});

const FarmAuctionTag: React.FC<React.PropsWithChildren<TagProps>> = (props) => {
  const { t } = useTranslation();
  const { targetRef, tooltip, tooltipVisible } = useTooltip(<FarmAuctionTagToolTipContent />, { placement: "right" });
  return (
    <>
      {tooltipVisible && tooltip}
      <TooltipText ref={targetRef} style={{ textDecoration: "none" }}>
        <Tag variant="failure" outline startIcon={<CommunityIcon width="18px" color="failure" mr="4px" />} {...props}>
          {t("Farm Auction")}
        </Tag>
      </TooltipText>
    </>
  );
};

const StableFarmTag: React.FC<React.PropsWithChildren<TagProps>> = (props) => {
  const { t } = useTranslation();
  const { targetRef, tooltip, tooltipVisible } = useTooltip("Fees are lower for stable LP", { placement: "right" });
  return (
    <>
      {tooltipVisible && tooltip}
      <TooltipText ref={targetRef} style={{ textDecoration: "none", alignSelf: "center" }}>
        <Tag variant="failure" outline {...props}>
          {t("Stable LP")}
        </Tag>
      </TooltipText>
    </>
  );
};

const CommunityTag: React.FC<React.PropsWithChildren<TagProps>> = (props) => {
  const { t } = useTranslation();
  return (
    <Tag variant="failure" outline startIcon={<CommunityIcon width="18px" color="failure" mr="4px" />} {...props}>
      {t("Community")}
    </Tag>
  );
};

const DualTag: React.FC<React.PropsWithChildren<TagProps>> = (props) => {
  const { t } = useTranslation();
  return (
    <Tag variant="textSubtle" outline {...props}>
      {t("Dual")}
    </Tag>
  );
};

const ManualPoolTag: React.FC<React.PropsWithChildren<TagProps>> = (props) => {
  const { t } = useTranslation();
  return (
    <Tag variant="secondary" outline startIcon={<RefreshIcon width="18px" color="secondary" mr="4px" />} {...props}>
      {t("Manual")}
    </Tag>
  );
};

const CompoundingPoolTag: React.FC<React.PropsWithChildren<TagProps>> = (props) => {
  const { t } = useTranslation();
  return (
    <Tag variant="success" outline startIcon={<AutoRenewIcon width="18px" color="success" mr="4px" />} {...props}>
      {t("Auto")}
    </Tag>
  );
};

const VoteNowTag: React.FC<React.PropsWithChildren<TagProps>> = (props) => {
  const { t } = useTranslation();
  return (
    <Tag variant="success" startIcon={<VoteIcon width="18px" color="success" mr="4px" />} {...props}>
      {t("Vote Now")}
    </Tag>
  );
};

const SoonTag: React.FC<React.PropsWithChildren<TagProps>> = (props) => {
  const { t } = useTranslation();
  return (
    <Tag variant="binance" startIcon={<TimerIcon width="18px" color="success" mr="4px" />} {...props}>
      {t("Soon")}
    </Tag>
  );
};

const PendingTag: React.FC<React.PropsWithChildren<TagProps>> = (props) => {
  const { t } = useTranslation();
  return (
    <Tag variant="binance" startIcon={<TimerIcon width="18px" color="success" mr="4px" />} {...props}>
      {t("Pending")}
    </Tag>
  );
};

const NormalReviewTag: React.FC<{rating: string}> = ({ rating }) => {
  return (
    <Tag variant="success" startIcon={<VoteIcon width="18px" color="success" mr="4px" />}>
      {Number(rating) >= 5 ? "5" : Math.floor(Math.max(Number(rating), 0))}
    </Tag>
  )
}

const VotingPowerTag: React.FC<any> = ({votingPower, tagType}) => {
  return (
    <Tag variant="binance" style={{ backgroundColor: tagType === 4
      ? "binance"
      : tagType === 3
      ? "silver"
      : tagType === 2
      ? "#cd7f32"
      : "black"
    }}
      startIcon={<VoteIcon width="18px" color="secondary" mr="4px" />}>
        {formatNumber(Number(votingPower))}
    </Tag>
  )
}

const VotesTag: React.FC<any> = ({votingPower, color}) => {
  return (
    <Tag variant="binance" style={{ backgroundColor: color }}
      startIcon={<VoteIcon width="18px" color="secondary" mr="4px" />}>
        {formatNumber(Number(votingPower))}
    </Tag>
  )
}

const OpenedTag: React.FC<TagProps> = (props) => {
  const { t } = useTranslation()
  return (
    <Tag variant="binance" startIcon={<TimerIcon width="18px" color="success" mr="4px" />} {...props}>
      {t('Opened')}
    </Tag>
  )
}

const ClosedTag: React.FC<React.PropsWithChildren<TagProps>> = (props) => {
  const { t } = useTranslation();
  return (
    <Tag variant="textDisabled" startIcon={<BlockIcon width="18px" color="textDisabled" mr="4px" />} {...props}>
      {t("Closed")}
    </Tag>
  );
};

const ActiveTag: React.FC<TagProps> = (props) => {
  const { t } = useTranslation()
  return (
    <Tag variant="success" startIcon={<VoteIcon width="18px" color="success" mr="4px" />} {...props}>
      {t('Active')}
    </Tag>
  )
}

const ExpiredTag: React.FC<TagProps> = (props) => {
  const { t } = useTranslation()
  return (
    <Tag variant="textDisabled" startIcon={<BlockIcon width="18px" color="textDisabled" mr="4px" />} {...props}>
      {t('Expired')}
    </Tag>
  )
}

const TypeTag: React.FC<any> = ({ entryType, ...props}) => {
  const { t } = useTranslation()
  let startIcon = <VerifiedIcon width="18px" color="secondary" mr="4px" />
  if (entryType === "education") {
    startIcon = <PrizeIcon width="18px" color="failure" mr="4px" />
  } else if (entryType === "professional") {
    startIcon = <CommunityIcon width="18px" color="failure" mr="4px" />
  } else if (entryType === "healthcare") {
    startIcon = <AddIcon width="18px" color="secondary" mr="4px" />
  } else if (entryType === "properties") {
    startIcon = <ListViewIcon width="18px" color="secondary" mr="4px" />
  } else if (entryType === "others") {
    startIcon = <AutoRenewIcon width="18px" color="secondary" mr="4px" />
  }
  return (
    <Tag variant="secondary" outline startIcon={startIcon} {...props}>
      {t(entryType)}
    </Tag>
  )
}

const Tags = {
  TypeTag,
  CoreTag,
  ExpiredTag,
  ActiveTag,
  FarmAuctionTag,
  DualTag,
  ManualPoolTag,
  CompoundingPoolTag,
  VoteNowTag,
  SoonTag,
  PendingTag,
  OpenedTag,
  ClosedTag,
  CommunityTag,
  StableFarmTag,
  VotingPowerTag,
  VotesTag,
  NormalReviewTag,
};

export default Tags;
