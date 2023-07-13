import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import styled from 'styled-components'
import SwiperCore, { Keyboard, Mousewheel, FreeMode } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css/bundle'
// import { useGetSubjects } from 'state/bettings/hooks'
import delay from 'lodash/delay'
import RoundCard from './components/RoundCard'
import useSwiper from './hooks/useSwiper'
// import useOnNextRound from './hooks/useOnNextRound'
import useOnViewChange from './hooks/useOnViewChange'
// import { PageView } from './types'
import { CHART_DOT_CLICK_EVENT } from './helpers'

SwiperCore.use([Keyboard, Mousewheel, FreeMode])

const StyledSwiper = styled.div`
  .swiper-wrapper {
    align-items: center;
    display: flex;
  }

  .swiper-slide {
    width: 320px;
  }
`

  const Positions: React.FC<any> = ({ view, ogBetting, allBettings }) => {
  const { setSwiper, swiper } = useSwiper()
  const swiperIndex = 1

  useOnViewChange(swiperIndex, view)

  useEffect(() => {
    const handleChartDotClick = () => {
      setIsChangeTransition(true)
      delay(() => setIsChangeTransition(false), 3000)
    }
    swiper?.el?.addEventListener(CHART_DOT_CLICK_EVENT, handleChartDotClick)

    return () => {
      swiper?.el?.removeEventListener(CHART_DOT_CLICK_EVENT, handleChartDotClick)
    }
  }, [swiper?.el])
  const [isChangeTransition, setIsChangeTransition] = useState(false)
  const { bettingId } = useRouter().query
  const currEvent = ogBetting?.bettingEvents?.length && ogBetting?.bettingEvents[Number(bettingId || 1) - 1]
  const arr2 = Array.from({length: Number(currEvent?.currPeriod || 0) + 2}, (v, i) => i)
  console.log("bettingId===========>", bettingId, arr2)

  return (
    <StyledSwiper>
      <Swiper
        initialSlide={swiperIndex}
        onSwiper={setSwiper}
        spaceBetween={16}
        slidesPerView="auto"
        onBeforeDestroy={() => setSwiper(null)}
        freeMode={{ enabled: true, sticky: true, momentumRatio: 0.25, momentumVelocityRatio: 0.5 }}
        centeredSlides
        mousewheel
        keyboard
        resizeObserver
      >
        {allBettings &&
          ogBetting?.bettingEvents.map((bettingEvent) => (
          <SwiperSlide key={bettingEvent.id}>
            {({ isActive }) => {
            console.log("bettingEvent==============>", bettingEvent)
            return <RoundCard 
                    allBettings={allBettings} 
                    betting={{ idx: bettingEvent?.bettingId, ...bettingEvent, status: "Live" }} 
                    isActive={isChangeTransition && isActive} 
                  />
                }
              }
          </SwiperSlide>
        ))}
        {!allBettings && arr2.map((idx) => {
          const currPeriod = currEvent?.periods?.find((period) => Number(period.period) === idx)
          console.log("currEvent==============>", currEvent, currPeriod)
          const betting = Number(currEvent?.currPeriod || 0) > idx
          ? { 
              idx,
              rewardsBreakDown: currEvent?.rewardsBreakDown,
              action: currEvent?.action,
              pricePerTicket: currEvent?.pricePerTicket,
              adminShare: currEvent?.adminShare,
              referrerShare: currEvent?.referrerShare,
              finalNumber: currPeriod?.finalNumber,
              countWinnersPerBracket: currPeriod?.countWinnersPerBracket,
              amountCollected: 0,
              ...currEvent,
              status: "Past",
            } 
          : Number(currEvent?.currPeriod || 0) === idx 
          ? {
              idx,
              rewardsBreakDown: currEvent?.rewardsBreakDown,
              action: currEvent?.action,
              pricePerTicket: currEvent?.pricePerTicket,
              adminShare: currEvent?.adminShare,
              referrerShare: currEvent?.referrerShare,
              finalNumber: "",
              countWinnersPerBracket: "",
              amountCollected: 0,
              ...currEvent,
              status: "Live",
            }
          : {
              idx,
              rewardsBreakDown: currEvent?.rewardsBreakDown,
              action: currEvent?.action,
              pricePerTicket: currEvent?.pricePerTicket,
              adminShare: currEvent?.adminShare,
              referrerShare: currEvent?.referrerShare,
              finalNumber: "",
              countWinnersPerBracket: "",
              amountCollected: 0,
              ...currEvent,
              status: "Next",
            }
          return <SwiperSlide key={betting.id}>
                  {({ isActive }) => <RoundCard betting={betting} allBettings={allBettings} isActive={isChangeTransition && isActive} />}
                </SwiperSlide>
        })}
      </Swiper>
    </StyledSwiper>
  )
}

export default Positions
