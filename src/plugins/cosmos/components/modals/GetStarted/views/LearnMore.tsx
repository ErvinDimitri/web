import { ArrowBackIcon } from '@chakra-ui/icons'
import { Box, Flex } from '@chakra-ui/layout'
import { Button, IconButton } from '@chakra-ui/react'
import { CAIP19 } from '@shapeshiftoss/caip'
import { useSteps } from 'chakra-ui-steps'
import { DefiModalHeader } from 'plugins/cosmos/components/DefiModalHeader/DefiModalHeader'
import { useHistory } from 'react-router-dom'
import rewards from 'assets/rewards.svg'
import risk from 'assets/risk.svg'
import withdraw from 'assets/withdraw.svg'
import { CarouselDots } from 'components/CarouselDots/CarouselDots'
import { SlideTransition } from 'components/SlideTransition'
import { Text } from 'components/Text'
import { useModal } from 'context/ModalProvider/ModalProvider'

const STEP_TO_ELEMENTS_MAPPING = [
  {
    bodies: [
      'defi.modals.learnMore.bodies.rateFluctuationInfo',
      'defi.modals.learnMore.bodies.amountStakingInfo',
      'defi.modals.learnMore.bodies.withdrawInfo'
    ],
    header: 'defi.modals.learnMore.headers.aboutStakingRewards',
    headerImageSrc: rewards
  },
  {
    bodies: ['defi.modals.learnMore.bodies.unbondingInfo'],
    header: 'defi.modals.learnMore.headers.unstaking',
    headerImageSrc: withdraw
  },
  {
    bodies: [
      'defi.modals.learnMore.bodies.slashingInfo',
      'defi.modals.learnMore.bodies.partnerInfo'
    ],
    header: 'defi.modals.learnMore.headers.risks',
    headerImageSrc: risk
  }
]

type LearnMoreProps = {
  assetId: CAIP19
}

export const LearnMore = ({ assetId }: LearnMoreProps) => {
  const history = useHistory()
  const { cosmosGetStarted } = useModal()
  // TODO: wire me up, parentheses are nice but let's get asset name from selectAssetNameById instead of this
  const asset = (_ => ({
    name: 'Osmo'
  }))(assetId)

  const { nextStep, prevStep, setStep, activeStep } = useSteps({
    initialStep: 1
  })

  const stepsLength = Object.keys(STEP_TO_ELEMENTS_MAPPING).length
  const isFirstStep = activeStep === 1
  const isLastStep = activeStep === stepsLength

  const handleNextOrCloseClick = () => {
    if (isLastStep) return cosmosGetStarted.close()

    nextStep()
  }

  const handlePrevClick = () => {
    if (isFirstStep) {
      return history.goBack()
    }

    prevStep()
  }

  const currentElement = STEP_TO_ELEMENTS_MAPPING[activeStep - 1]

  return (
    <>
      <IconButton
        variant='ghost'
        icon={<ArrowBackIcon />}
        aria-label={'common.back'}
        position='absolute'
        top={2}
        left={3}
        fontSize='xl'
        size='sm'
        onClick={handlePrevClick}
      />
      <Box pt='36px' pb='20px' px='24px'>
        <Flex
          direction='column'
          maxWidth='395px'
          height='520px'
          alignItems='center'
          justifyContent='space-between'
        >
          <SlideTransition key={activeStep}>
            <Flex direction='column' alignItems='center'>
              <DefiModalHeader
                headerImageSrc={currentElement.headerImageSrc}
                headerText={[currentElement.header, { assetName: asset.name }]}
                headerImageMaxWidth={120}
              />
              <Box>
                <Flex direction='column'>
                  {currentElement.bodies.map((body, i) => (
                    <Box textAlign='left' key={i} mb='18px'>
                      <Text
                        translation={[body, { assetName: asset.name }]}
                        color='gray.500'
                        fontWeight='semibold'
                        fontSize='15px'
                      />
                    </Box>
                  ))}
                </Flex>
              </Box>
            </Flex>
          </SlideTransition>
          <Flex width='100%' direction='column' justifyContent='center' alignItems='center'>
            <Box width='100%'>
              <Button
                size='lg'
                zIndex={1}
                width='100%'
                colorScheme='blue'
                mb='20px'
                onClick={handleNextOrCloseClick}
              >
                <Text
                  translation={
                    isLastStep ? 'defi.modals.learnMore.close' : 'defi.modals.learnMore.next'
                  }
                />
              </Button>
            </Box>
            <Box width='46px'>
              <CarouselDots length={stepsLength} activeIndex={activeStep} onClick={setStep} />
            </Box>
          </Flex>
        </Flex>
      </Box>
    </>
  )
}
