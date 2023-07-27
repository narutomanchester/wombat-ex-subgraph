import {
  Swap as SwapEvent
} from "../../generated/main_pool/main_pool"
import { convertTokenToDecimal, updateBlockData, getTokenDecimals, updateSecondData } from '../utils'
import { log, BigDecimal } from '@graphprotocol/graph-ts'


export function handleSwap(event: SwapEvent): void {
 

  let token0Decimal = getTokenDecimals(event.params.fromToken)
  let token1Decimal = getTokenDecimals(event.params.toToken)

  let amount0 = convertTokenToDecimal(event.params.fromAmount, token0Decimal)
  let amount1 = convertTokenToDecimal(event.params.toAmount, token1Decimal)
  log.debug("amount0 Value: " + amount0.toString() + "amount1 Value: " + amount1.toString(), [])
  
  let amount0Abs = amount0
  if (amount0.lt(BigDecimal.fromString('0'))) {
    amount0Abs = amount0.times(BigDecimal.fromString('-1'))
  }
  let amount1Abs = amount1
  if (amount1.lt(BigDecimal.fromString('0'))) {
    amount1Abs = amount1.times(BigDecimal.fromString('-1'))
  }

  // Update Block Data
  let blockData = updateBlockData(event)

  blockData.volumeUSD = blockData.volumeUSD.plus(amount0Abs)
  blockData.feesUSD = blockData.feesUSD.plus(amount1Abs.div(BigDecimal.fromString('10000')))
  blockData.save()

  // Update Hour Data
  let secondData = updateSecondData(event)

  secondData.volumeUSD = secondData.volumeUSD.plus(amount0Abs)
  secondData.feesUSD = secondData.feesUSD.plus(amount1Abs.div(BigDecimal.fromString('10000')))
  secondData.save()
}