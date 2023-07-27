import {  log, BigInt, BigDecimal, ethereum, Address } from '@graphprotocol/graph-ts'
import { BlockData, SecondData } from "../../generated/schema"
import { ERC20 } from "../../generated/main_pool/ERC20"

export function convertTokenToDecimal(amount: BigInt, decimals: BigInt): BigDecimal {

    let amountInDecimal = BigDecimal.fromString(amount.toString());
    
    // build 10^decimal
    let pow10OfDecimal = BigDecimal.fromString('1')
    
    for (let i = BigInt.fromI32(0); i.lt(decimals as BigInt); i = i.plus(BigInt.fromI32(1))) {
      pow10OfDecimal = pow10OfDecimal.times(BigDecimal.fromString('10')) 
    }

    // = amount / 10^decimal
    let result =  amountInDecimal.div(pow10OfDecimal)
    return result
  }
  
    
export function updateBlockData(event: ethereum.Event): BlockData {
    let blockNumber = event.block.number.toI32()

    let blockData = BlockData.load(blockNumber.toString())
    if (blockData === null) {
      blockData = new BlockData(blockNumber.toString())
      blockData.blockNumber = blockNumber
      blockData.volumeUSD = BigDecimal.fromString('0')
      blockData.feesUSD = BigDecimal.fromString('0')
      blockData.txCount = BigInt.fromI32(1)

    }


    blockData.txCount = blockData.txCount.plus(BigInt.fromI32(1))
    blockData.save()

    return blockData as BlockData

  }

export function updateSecondData(event: ethereum.Event): SecondData {
    let timestamp = event.block.timestamp.toI32()
    let unixHour = (timestamp / 3600) * 3600

    let secondData = SecondData.load(timestamp.toString())
    if (secondData === null) {
      secondData = new SecondData(timestamp.toString())
      secondData.unixTime = timestamp
      secondData.unixHour = unixHour
      secondData.volumeUSD = BigDecimal.fromString('0')
      secondData.feesUSD = BigDecimal.fromString('0')
      secondData.txCount = BigInt.fromI32(1)

    }


    secondData.txCount = secondData.txCount.plus(BigInt.fromI32(1))
    secondData.save()

    return secondData as SecondData

  }

export function getTokenDecimals(tokenAddress: Address): BigInt {
    return BigInt.fromI32(ERC20.bind(tokenAddress) .decimals())
  }