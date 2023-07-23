import { useTranslation } from '@pancakeswap/localization'
import { Flex, Pool, Text } from '@pancakeswap/uikit'
import { ActionContainer, ActionTitles, ActionContent } from './styles'

const HarvestAction: React.FunctionComponent<any> = ({ pool }) => {
  const { t } = useTranslation()
  
  return (
        <ActionContainer>
        <ActionContent>
          <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
            {t("%val1% %val2%", { val1: pool?.title ? "Title:" : "", val2: pool?.title ?? "" })}
            {t("Open the pitch for more details")}
          </Text>
        </ActionContent>
      </ActionContainer>
    )
}

export default HarvestAction
