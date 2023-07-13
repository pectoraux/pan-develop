import { Button } from '@pancakeswap/uikit'
import uniqueId from 'lodash/uniqueId'
import { useTranslation } from '@pancakeswap/localization'
import { OptionType } from './types'
import Choice from './Choice'

interface ChoicesProps {
  choices: OptionType[]
  onChange: (newChoices: OptionType[]) => void
}

export const MINIMUM_CHOICES = 1
export const makeChoice = (): any => ({ 
  id: uniqueId(), 
  category: '', 
  element: '', 
  currency: '', 
  value: '',
  unitPrice: null,
  min: null,
  max: null
})

const Choices: React.FC<any> = ({ choices, addValue = false, onChange }) => {
  const { t } = useTranslation()
  
  const addChoice = () => {
    onChange([...choices, makeChoice()])
  }

  return (
      <>
        {choices.map(({ id, category, element, unitPrice, value, currency, min, max }, index) => {
          const handleCategoryInput = (newValue: string) => {
            const newChoices = [...choices]
            const choiceIndex = newChoices.findIndex((newChoice) => newChoice.id === id)

            newChoices[choiceIndex].category = newValue

            onChange(newChoices)
          }

          const handleElementInput = (newValue: string) => {
            const newChoices = [...choices]
            const choiceIndex = newChoices.findIndex((newChoice) => newChoice.id === id)

            newChoices[choiceIndex].element = newValue

            onChange(newChoices)
          }

          const handleElementCurrency = (newValue: string) => {
            const newChoices = [...choices]
            const choiceIndex = newChoices.findIndex((newChoice) => newChoice.id === id)

            newChoices[choiceIndex].currency = newValue

            onChange(newChoices)
          }

          const handlePriceInput = (newValue: number) => {
            const newChoices = [...choices]
            const choiceIndex = newChoices.findIndex((newChoice) => newChoice.id === id)

            newChoices[choiceIndex].unitPrice = newValue

            onChange(newChoices)
          }
          
          const handleValueInput = (newValue: number) => {
            const newChoices = [...choices]
            const choiceIndex = newChoices.findIndex((newChoice) => newChoice.id === id)

            newChoices[choiceIndex].value = newValue

            onChange(newChoices)
          }

          const handleElementMin = (newValue: number) => {
            const newChoices = [...choices]
            const choiceIndex = newChoices.findIndex((newChoice) => newChoice.id === id)

            newChoices[choiceIndex].min = newValue

            onChange(newChoices)
          }

          const handleElementMax = (newValue: number) => {
            const newChoices = [...choices]
            const choiceIndex = newChoices.findIndex((newChoice) => newChoice.id === id)

            newChoices[choiceIndex].max = newValue

            onChange(newChoices)
          }

          const handleRemove = () => {
            onChange(choices.filter((newPrevChoice) => newPrevChoice.id !== id))
          }

          return (
            <Choice
              key={id}
              scale="sm"
              handleCategoryInput={handleCategoryInput}
              handleElementInput={handleElementInput}
              handleElementCurrency={handleElementCurrency}
              handlePriceInput={handlePriceInput}
              handleValueInput={handleValueInput}
              handleElementMin={handleElementMin}
              handleElementMax={handleElementMax}
              category={category}
              currency={currency}
              element={element}
              price={unitPrice}
              value={value}
              addValue={addValue}
              min={min}
              max={max}
              onRemove={handleRemove}
            />
          )
        })}

        <Button type="button" onClick={addChoice}>
          {t('Add Option')}
        </Button>
      </>
  )
}

export default Choices
