import { useRouter } from 'next/router'
import { useState, ChangeEvent, FormEvent } from 'react'
import { Button, Card, CardBody, useToast, CardHeader, CardProps, Heading, Box, Input, AutoRenewIcon, Toggle } from '@pancakeswap/uikit'
import { Proposal } from 'state/types'
import { useWeb3React } from '@pancakeswap/wagmi'
import { useTranslation } from '@pancakeswap/localization'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { Label } from '../CreateProposal/styles'
const CryptoJS = require('crypto-js')
// import { Web3Storage } from 'web3.storage'
// import { firestore } from "utils/firebase"
// import { signMessage } from 'utils/web3React'
// import useWeb3Provider from 'hooks/useActiveWeb3React'

interface SendToIPFSProps extends CardProps {
  proposal: Proposal
}

const SendToIPFS: React.FC<SendToIPFSProps> = ({ proposal, ...props }) => {
  const { t } = useTranslation()
  const { toastSuccess, toastError } = useToast()
  const { account } = useWeb3React()
  const [isLoading, setIsLoading] = useState(false)
  const [name, setName] = useState("")
  const [answer, setAnswer] = useState("")
  const [isSend, setIsSend] = useState(true)
  const [isSearchable, setIsSearchable] = useState(false)
  const { push } = useRouter()
  // const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDNhRTFjNzM0ODg3YjM3OEU1NUMxY0ZlMjhDNGU1MTEzMzdDNDU5NjQiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NDM5MDQ3MTA2NDksIm5hbWUiOiJjYW5jYW4ifQ.fsa93YkSfn5Ks9Ry6lsUtcqCmHvHgRBy8hbGFpSZJ_Y"
  // const storage = new Web3Storage({ token })
  // const storage = new Web3Storage({ token: getAccessToken() })
  // const { library, connector } = useWeb3Provider()
  
  // const decryptWithAES = (ciphertext, passphrase) => {
  //   try {
  //     const bytes = CryptoJS.AES.decrypt(ciphertext, passphrase);
  //     const originalText = bytes.toString(CryptoJS.enc.Utf8);
  //     return originalText;
  //   } catch(err) {
  //     console.log("decryptWithAES======>", err)
  //     return '';
  //   }
  // }

  const toggle = async () => {
    setIsSend(!isSend)
  }

  const toggle2 = async () => {
    setIsSearchable(!isSearchable)
  }

  const encryptWithAES = (text, passphrase) => {
    return CryptoJS.AES.encrypt(text, passphrase).toString();
  }

  // const handleSubmit = async (evt: FormEvent<HTMLFormElement>) => {
  //   evt.preventDefault()

  //   if (isSend) {
  //     const sig = await signMessage(connector, library, account, "")
  //     try {
  //       if (sig) {
  //         setIsLoading(true)
  //         const entryAns = isSearchable ? answer : encryptWithAES(answer, sig)
  //         const obj = {
  //           id: proposal.id,
  //           type: proposal.type,
  //           owner: proposal.owner,
  //           dataOwner: proposal.dataOwner,
  //           question: proposal.question,
  //           answer: entryAns,
  //           start: proposal.start,
  //           end: proposal.end,
  //           searchable: isSearchable,
  //           auditor: name
  //         }
  //         console.log("===========================>", entryAns, answer, sig)
  //         const blob = new Blob([JSON.stringify(obj)], { type: 'application/json' })
  //         const file = [new File([blob], `${proposal.id}.json`)]
  //         const cid = await storage.put(file)
  //         await firestore.collection("SSIs")
  //         .doc(proposal.id).update({answer: entryAns, auditor: name, cid});
  //         push('/ssi')
  //         toastSuccess(t('Info sent to IPFS!'))
  //       } else { throw "Sig is null"}
  //     } catch (error) {
  //       toastError(t('Error'), (error as Error)?.message)
  //       console.error(error)
  //       setIsLoading(false)
  //     }
  //   } else {
  //     try {
  //       // delete
  //       setIsLoading(true)
  //       await firestore.collection("SSIs").doc(proposal.id).delete()
  //       push('/ssi')
  //       toastSuccess(t('Info deleted from Inbox!'))
  //     } catch (error) {
  //       toastError(t('Error'), (error as Error)?.message)
  //       console.error(error)
  //       setIsLoading(false)
  //     }
  //   }
  // }

  // const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
  //   const { name: inputName, value } = evt.currentTarget
  //   setName(value)
  //   setAnswer(decryptWithAES(proposal.answer, value))
  // }

  return (
    <Card {...props}>
      <CardHeader>
        <Heading as="h3" scale="md">
          {t('IPFS')}
        </Heading>
      </CardHeader>
      <CardBody>
        <form 
        // onSubmit={handleSubmit}
        >
            <Box mb="24px">
              <Label htmlFor="name">{t('Auditor Wallet Address')}</Label>
              <Input id="name" name="name" value={name} scale="lg" 
              // onChange={handleChange} 
              required />
            </Box>
            <Box mb="24px">
              <Label htmlFor="answer">{t('Decrypted')}</Label>
              <Input id="answer" name="answer" value={answer} scale="lg" isSuccess />
            </Box>
            <Box mb="24px">
              <Label htmlFor="name">{isSend ? t('Send') : t('Delete')}</Label>
              <Toggle checked={isSend} onChange={toggle} />
            </Box>
            <Box mb="24px">
              <Label htmlFor="name">{!isSearchable ? t('Store Encrypted') : t('Store Unencrypted')}</Label>
              <Toggle checked={isSearchable} onChange={toggle2} />
            </Box>
        {account ? (
          <Button 
            type="submit" 
            disabled={answer === ""}
            isLoading={isLoading}
            endIcon={isLoading ? <AutoRenewIcon spin color="currentColor" /> : null}
          >
            {isSend ? t('Send to IPFS') : t('Delete')}
          </Button>
        ) : (
          <ConnectWalletButton />
        )}
      </form>
      </CardBody>
    </Card>
  )
}

export default SendToIPFS
