import { Pool } from '@pancakeswap/uikit'
import NFTMedia from 'views/Nft/market/components/NFTMedia'
import PreviewImage from 'views/Nft/market/components/CollectibleCard/PreviewImage'

const HarvestAction: React.FunctionComponent<any> = () => {

  const nft = {
    "tokenId": "6545",
    "name": "Neural Pepe #6545",
    "collectionName": "Neural Pepe",
    "collectionAddress": "0x012f90E777bdb2B4CA132f0f6EB9e7959075E9b2",
    "description": "This Pepe is AI-(de)generated at the behest of Neural God. \n\nThis NFT farms AI tokens on a daily basis. You can claim AI tokens and rename your Neural Pepe on neuralpepe.com \n\nNeural Pepe is an NFT art collectible project based on Binance Smart Chain and the first project in the Neural Frens family. Only 7,777 Neural Pepe will ever exist.\n\nWarning: Neural Pepe can be renamed any moment. You can verify the Neural Pepe you're purchasing has the name you expect by entering your NP's token ID into the tokenNameByIndex function on BSCScan.",
    "attributes": [
        {
            "traitType": "workspace",
            "value": "B2C eCommerce"
        },
        {
            "traitType": "format",
            "value": ".png"
        },
        {
            "traitType": "background_color",
            "value": "white"
        },
        {
            "traitType": "color",
            "value": "green"
        },
        {
            "traitType": "eyes",
            "value": "3"
        },
        {
            "traitType": "iteration",
            "value": "120"
        },
        {
            "traitType": "kek",
            "value": "kek"
        },
        {
            "traitType": "special",
            "value": "unknown"
        }
    ],
    "createdAt": "2022-06-29T07:24:21.063Z",
    "updatedAt": "2022-06-29T07:24:21.063Z",
    "image": {
        "original": "https://static-nft.pancakeswap.com/mainnet/0x012f90E777bdb2B4CA132f0f6EB9e7959075E9b2/neural-pepe-6545.png",
        "thumbnail": "https://static-nft.pancakeswap.com/mainnet/0x012f90E777bdb2B4CA132f0f6EB9e7959075E9b2/neural-pepe-6545-1000.png",
        "mp4": null,
        "webm": null,
        "gif": null
    },
    "usetFIAT": false,
    "tFIAT": "0x55d398326f99059fF775485246999027B3197955",
    "collection": {
        "name": "Neural Pepe"
    },
    "likes": "100",
    "dislikes": "20",
    "viewCount": "888",
    "behindPaywall": [
        {
            "address": "0x73096042a5297128e2bB074Bd91450Db58F3B4eA",
            "name": "Bashir program",
            "type": "0",
            "description": "Bashir program description",
            "banner": "https://static-nft.pancakeswap.com/mainnet/0x6f1Dc8a50489C96B6c09bb2aEc28c4043fB1A802/banner-sm.png",
            "avatar": "https://static-nft.pancakeswap.com/mainnet/0x6f1Dc8a50489C96B6c09bb2aEc28c4043fB1A802/avatar.png"
        }
    ],
    "marketData": {
        "tokenId": "6545",
        "metadataUrl": "https://ipfs.io/ipfs/Qmec1vWYzw2J7ZvdPxCBtAFocCeSG85njpU1bGn3TradVA/6545",
        "currentAskPrice": "0.14",
        "currentSeller": "0xfa5a5fae27be9f41454f2c6e21fa2a1c2f398a44",
        "latestTradedPriceInBNB": "0",
        "tradeVolumeBNB": "0",
        "totalTrades": "0",
        "isTradable": true,
        "updatedAt": "1659340110",
        "otherId": null,
        "usetFIAT": false,
        "tFIAT": "0x55d398326f99059fF775485246999027B3197955",
        "collection": {
            "id": "0x012f90e777bdb2b4ca132f0f6eb9e7959075e9b2"
        },
        "direction": "1",
        "dropinTimer": "1656079930",
        "ABTesting": true,
        "ABMin": "1",
        "ABMax": "5",
        "ABDeadline": "1656079930",
        "lastBidder": "0x981f4f5d8a32b44ca90b18453692f839f179d520",
        "bidDuration": "50000",
        "firstBidTime": "0",
        "minBidIncrementPercentage": "100",
        "rsrcTokenId": "0",
        "badgeNft": {
            "tokenId": "1266",
            "name": "BadgeNFT #1266",
            "description": "BadgeNFTs are delivered to channels or products after a review by an auditor",
            "image": {
                "original": "https://static-nft.pancakeswap.com/mainnet/0x012f90E777bdb2B4CA132f0f6EB9e7959075E9b2/neural-pepe-1266.png",
                "thumbnail": "https://static-nft.pancakeswap.com/mainnet/0x012f90E777bdb2B4CA132f0f6EB9e7959075E9b2/neural-pepe-1266-1000.png",
                "mp4": null,
                "webm": null,
                "gif": null
            },
            "createdAt": "2022-06-29T06:33:02.796Z",
            "updatedAt": "2022-06-29T06:33:02.796Z",
            "collectionAddress": "0x012f90E777bdb2B4CA132f0f6EB9e7959075E9b2",
            "auditorAddress": "0x012f90E777bdb2B4CA132f0f6EB9e7959075E9b2",
            "collectionName": "BadgeNFT",
            "superLikes": "1001",
            "superDislikes": "202",
            "testimony": "testify_non_counterfeit",
            "auditorNote": ""
        },
        "options": [
            {
                "id": "0",
                "category": "Meat",
                "element": "$1 Tilapia",
                "traitType": "Meat",
                "value": "$1 Tilapia",
                "min": 0,
                "max": 100,
                "unitPrice": 1,
                "currency": "#"
            },
            {
                "id": "1",
                "category": "Meat",
                "element": "$2 Tilapia",
                "traitType": "Meat",
                "value": "$2 Tilapia",
                "min": 0,
                "max": 100,
                "unitPrice": 2,
                "currency": "#"
            },
            {
                "id": "2",
                "category": "Meat",
                "element": "$3 Tilapia",
                "traitType": "Meat",
                "value": "$3 Tilapia",
                "min": 0,
                "max": 100,
                "unitPrice": 1,
                "currency": "#"
            },
            {
                "id": "3",
                "category": "Meat",
                "element": "$3 Beef",
                "traitType": "Meat",
                "value": "$3 Beef",
                "min": 0,
                "max": 100,
                "unitPrice": 1,
                "currency": "#"
            },
            {
                "id": "4",
                "category": "Meat",
                "element": "$3 Chicken",
                "traitType": "Meat",
                "value": "$3 Chicken",
                "min": 0,
                "max": 100,
                "unitPrice": 1,
                "currency": "#"
            },
            {
                "id": "5",
                "category": "Soup",
                "element": "$1 Gound-nut Soup",
                "traitType": "Soup",
                "value": "$1 Gound-nut Soup",
                "min": 0,
                "max": 1,
                "unitPrice": 1,
                "currency": "#"
            },
            {
                "id": "6",
                "category": "Soup",
                "element": "$2 Gound-nut Soup",
                "traitType": "Soup",
                "value": "$2 Gound-nut Soup",
                "min": 0,
                "max": 1,
                "unitPrice": 1,
                "currency": "#"
            },
            {
                "id": "7",
                "category": "Soup",
                "element": "$1 Ademe Soup",
                "traitType": "Soup",
                "value": "$1 Ademe Soup",
                "min": 0,
                "max": 1,
                "unitPrice": 1,
                "currency": "#"
            },
            {
                "id": "8",
                "category": "Soup",
                "element": "$2 Ademe Soup",
                "traitType": "Soup",
                "value": "$2 Ademe Soup",
                "min": 0,
                "max": 10,
                "unitPrice": 1,
                "currency": "#"
            },
            {
                "id": "9",
                "category": "Soup",
                "element": "$3 Ademe Soup",
                "traitType": "Soup",
                "value": "$3 Ademe Soup",
                "min": 0,
                "max": 1,
                "unitPrice": 1,
                "currency": "#"
            },
            {
                "id": "10",
                "category": "Type",
                "element": "From Yam",
                "traitType": "Type",
                "value": "From Yam",
                "min": 0,
                "max": 0,
                "unitPrice": 1,
                "currency": "$"
            },
            {
                "id": "11",
                "category": "Type",
                "element": "From Potatosdsdsd sdsdsdsdsd",
                "traitType": "Type",
                "value": "From Potatosdsdsd sdsdsdsdsd",
                "min": 3,
                "max": 1000,
                "unitPrice": 1,
                "currency": "$"
            }
        ],
        "transferrable": true,
        "identityProof": {
            "requiredIndentity": "",
            "minIDBadgeColor": "0",
            "valueName": ""
        },
        "priceReductor": {
            "discountStatus": "1",
            "discountStart": "1656079930",
            "cashbackStatus": "1",
            "cashbackStart": "1656079930",
            "cashNotCredit": true,
            "checkIdentityCode": true,
            "discountNumbers": {
                "cursor": "1656079930",
                "size": "1656979930",
                "perct": "20",
                "lowerThreshold": "20",
                "upperThreshold": "20",
                "limit": "20"
            },
            "discountCost": {
                "cursor": "1656079930",
                "size": "1656979930",
                "perct": "20",
                "lowerThreshold": "20",
                "upperThreshold": "20",
                "limit": "20"
            },
            "cashbackNumbers": {
                "cursor": "1656079930",
                "size": "1656979930",
                "perct": "20",
                "lowerThreshold": "20",
                "upperThreshold": "20",
                "limit": "20"
            },
            "cashbackCost": {
                "cursor": "1656079930",
                "size": "1656979930",
                "perct": "20",
                "lowerThreshold": "20",
                "upperThreshold": "20",
                "limit": "20"
            }
        },
        "superLikes": "1001",
        "superDislikes": "202",
        "transactionHistory": []
    }
  }

  return (
    <NFTMedia as={PreviewImage} nft={nft} height={200} width={200} ml="18px" borderRadius="8px" />
  )
}

export default HarvestAction
