import { ChangeEvent, InputHTMLAttributes, useState } from 'react'
import { Box, CloseIcon, IconButton, Input, InputProps } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'

interface ChoiceProps extends InputProps, InputHTMLAttributes<HTMLInputElement> {
  handleCategoryInput: (value: string) => void
  handleElementInput: (value: string) => void
  handleElementCurrency: (value: string) => void
  handlePriceInput: (value: number) => void
  handleElementMin: (value: number) => void
  handleElementMax: (value: number) => void
  onRemove?: () => void
}

const Choice: React.FC<any> = ({ 
  onRemove, 
  handleCategoryInput, 
  handleElementInput, 
  handleElementCurrency,
  handlePriceInput,
  handleValueInput,
  handleElementMin,
  handleElementMax,
  ...props 
}) => {
  const { t } = useTranslation()
  const [isWarning, setIsWarning] = useState(false)
  const [isDirty, setIsDirty] = useState(false)

  const handleChangeCategory = (evt: ChangeEvent<HTMLInputElement>) => {
    const { value } = evt.currentTarget

    setIsWarning(isDirty && value.length === 0)
    setIsDirty(true)
    handleCategoryInput(value)
  }

  const handleChangeElement = (evt: ChangeEvent<HTMLInputElement>) => {
    const { value } = evt.currentTarget

    setIsWarning(isDirty && value.length === 0)
    setIsDirty(true)
    handleElementInput(value)
  }

  const handleChangeCurrency = (evt: ChangeEvent<HTMLInputElement>) => {
    const { value } = evt.currentTarget

    setIsWarning(isDirty && value.length === 0)
    setIsDirty(true)
    handleElementCurrency(value)
  }

  const handleChangePrice = (evt: ChangeEvent<HTMLInputElement>) => {
    const { value } = evt.currentTarget

    setIsWarning(isDirty && value.length === 0)
    setIsDirty(true)
    handlePriceInput(value)
  }
  
  const handleChangeValue = (evt: ChangeEvent<HTMLInputElement>) => {
    const { value } = evt.currentTarget

    setIsWarning(isDirty && value.length === 0)
    setIsDirty(true)
    handleValueInput(value)
  }

  const handleChangeMin = (evt: ChangeEvent<HTMLInputElement>) => {
    const { value } = evt.currentTarget

    setIsWarning(isDirty && value.length === 0)
    setIsDirty(true)
    handleElementMin(value)
  }

  const handleChangeMax = (evt: ChangeEvent<HTMLInputElement>) => {
    const { value } = evt.currentTarget

    setIsWarning(isDirty && value.length === 0)
    setIsDirty(true)
    handleElementMax(value)
  }

  return (
    <Box position="relative" mb="26px">
    <Box position="relative" mb="5px">
      <Input {...props} placeholder={t('Category (%txt%)', { txt: props.addValue ? 'Subscription' : 'Meat'})} value={props.category} onChange={handleChangeCategory} isWarning={isWarning} />
    </Box>
    <Box position="relative" mb="5px">
      <Input {...props} placeholder={t('Element (%txt%)', { txt: props.addValue ? 'Monthly' : '$1 Tilapia'})} value={props.element} onChange={handleChangeElement} isWarning={isWarning} />
    </Box>
    {props.addValue ?
    <Box position="relative" mb="5px">
      <Input {...props} placeholder={t('Value (%txt%)', { txt: props.addValue ? '2592000' : ''})} value={props.value} onChange={handleChangeValue} isWarning={isWarning} />
    </Box>:null}
    <Box position="relative" mb="5px">
      <Input {...props} placeholder={t('Currency (#)')} value={props.currency} onChange={handleChangeCurrency} isWarning={isWarning} />
    </Box>
    <Box position="relative" mb="5px">
      <Input {...props} placeholder={t('Element Price (1)')} type='number' value={props.price} onChange={handleChangePrice} isWarning={isWarning} />
    </Box>
    <Box position="relative" mb="5px">
      <Input {...props} placeholder={t('Element Min (0)')} type='number' value={props.min} onChange={handleChangeMin} isWarning={isWarning} />
    </Box>
    <Box position="relative" mb="5px">
      <Input {...props} placeholder={t('Element Max (100)')} type='number' value={props.max} onChange={handleChangeMax} isWarning={isWarning} />
    </Box>
      {onRemove && (
        <Box position="absolute" left="-32px" bottom="180px" zIndex={30}>
          <IconButton variant="text" onClick={onRemove}>
            <CloseIcon />
          </IconButton>
        </Box>
      )}
    </Box>
  )
}

export default Choice
